import { beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../src/prismaClient";
import {
	ApplicationError,
	ApplicationService,
} from "../../src/services/applicationService";

const mapResponse = vi.fn();

vi.mock("../../src/prismaClient", () => ({
	default: {
		jobRole: { findUnique: vi.fn() },
		status: { findUnique: vi.fn() },
		application: { create: vi.fn(), findMany: vi.fn() },
		$transaction: vi.fn(),
	},
}));

vi.mock("../../src/mappers/applicationMapper", () => ({
	ApplicationMapper: vi.fn(function (this: {
		mapApplicationToResponse: typeof mapResponse;
	}) {
		this.mapApplicationToResponse = mapResponse;
	}),
}));

const openRole = {
	jobRoleId: 1,
	numberOfOpenPositions: 2,
	status: { statusName: "Open" },
};
const inProgress = { statusId: 3, statusName: "In Progress" };
const savedApplication = {
	applicationId: 10,
	userId: 5,
	jobRoleId: 1,
	message: "I am interested.",
	statusId: 3,
	createdAt: new Date("2026-09-03T12:00:00.000Z"),
};

const userApplication = {
	...savedApplication,
	status: inProgress,
	jobRole: { roleName: "Software Engineer" },
};

const assessmentApplication = {
	...savedApplication,
	status: inProgress,
	user: { email: "applicant@example.com" },
};

const transactionClient = {
	application: {
		findUnique: vi.fn(),
		update: vi.fn(),
	},
	status: { findUnique: vi.fn() },
	jobRole: { updateMany: vi.fn() },
};

describe("ApplicationService", () => {
	let service: ApplicationService;

	beforeEach(() => {
		vi.clearAllMocks();
		service = new ApplicationService();
	});

	it("creates an in-progress application with the supplied message", async () => {
		vi.mocked(prisma.jobRole.findUnique).mockResolvedValue(openRole as never);
		vi.mocked(prisma.status.findUnique).mockResolvedValue(inProgress as never);
		vi.mocked(prisma.application.create).mockResolvedValue(
			savedApplication as never,
		);
		mapResponse.mockReturnValue({ ...savedApplication, status: "In Progress" });

		const result = await service.createApplication(5, 1, "I am interested.");

		expect(prisma.application.create).toHaveBeenCalledWith({
			data: {
				userId: 5,
				jobRoleId: 1,
				message: "I am interested.",
				statusId: 3,
			},
		});
		expect(result.status).toBe("In Progress");
	});

	it("rejects a missing role", async () => {
		vi.mocked(prisma.jobRole.findUnique).mockResolvedValue(null);

		await expect(
			service.createApplication(5, 99, "Message"),
		).rejects.toMatchObject({
			statusCode: 404,
			message: "Job role not found",
		});
	});

	it("rejects closed roles and roles with no open positions", async () => {
		vi.mocked(prisma.jobRole.findUnique).mockResolvedValue({
			...openRole,
			status: { statusName: "Closed" },
		} as never);

		await expect(
			service.createApplication(5, 1, "Message"),
		).rejects.toBeInstanceOf(ApplicationError);
	});

	it("converts duplicate applications into a 409 error", async () => {
		vi.mocked(prisma.jobRole.findUnique).mockResolvedValue(openRole as never);
		vi.mocked(prisma.status.findUnique).mockResolvedValue(inProgress as never);
		vi.mocked(prisma.application.create).mockRejectedValue({ code: "P2002" });

		await expect(
			service.createApplication(5, 1, "Message"),
		).rejects.toMatchObject({
			statusCode: 409,
			message: "You have already applied for this job role",
		});
	});

	it("lists applications for a job role with applicant details", async () => {
		vi.mocked(prisma.application.findMany).mockResolvedValue([
			assessmentApplication,
		] as never);

		const result = await service.findApplicationsByJobRoleId(1);

		expect(prisma.application.findMany).toHaveBeenCalledWith({
			where: { jobRoleId: 1 },
			include: { status: true, user: { select: { email: true } } },
			orderBy: { createdAt: "asc" },
		});
		expect(result).toEqual([
			expect.objectContaining({
				applicationId: 10,
				applicantEmail: "applicant@example.com",
				message: "I am interested.",
				status: "In Progress",
			}),
		]);
	});

	it("lists the current user's applications with role names", async () => {
		vi.mocked(prisma.application.findMany).mockResolvedValue([
			userApplication,
		] as never);
		mapResponse.mockImplementation((_application, roleName, statusName) => ({
			roleName,
			status: statusName,
		}));

		const result = await service.findApplicationsByUserId(5);

		expect(prisma.application.findMany).toHaveBeenCalledWith({
			where: { userId: 5 },
			include: {
				status: true,
				jobRole: { select: { roleName: true } },
			},
			orderBy: { createdAt: "desc" },
		});
		expect(result).toEqual([
			{ roleName: "Software Engineer", status: "In Progress" },
		]);
	});

	it("hires an application and decrements an open position", async () => {
		vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
			callback(transactionClient as never),
		);
		transactionClient.application.findUnique.mockResolvedValue(
			assessmentApplication as never,
		);
		transactionClient.status.findUnique.mockResolvedValue({
			statusId: 4,
			statusName: "Hired",
		} as never);
		transactionClient.jobRole.updateMany.mockResolvedValue({ count: 1 });
		transactionClient.application.update.mockResolvedValue({
			...savedApplication,
			statusId: 4,
			user: { email: "applicant@example.com" },
		} as never);

		const result = await service.updateApplicationStatus(10, "Hired");

		expect(transactionClient.jobRole.updateMany).toHaveBeenCalledWith({
			where: { jobRoleId: 1, numberOfOpenPositions: { gt: 0 } },
			data: { numberOfOpenPositions: { decrement: 1 } },
		});
		expect(transactionClient.application.update).toHaveBeenCalledWith({
			where: { applicationId: 10 },
			data: { statusId: 4 },
			include: { user: { select: { email: true } } },
		});
		expect(result.status).toBe("Hired");
	});

	it("rejects an application without changing open positions", async () => {
		vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
			callback(transactionClient as never),
		);
		transactionClient.application.findUnique.mockResolvedValue(
			assessmentApplication as never,
		);
		transactionClient.status.findUnique.mockResolvedValue({
			statusId: 5,
			statusName: "Rejected",
		} as never);
		transactionClient.application.update.mockResolvedValue({
			...savedApplication,
			statusId: 5,
			user: { email: "applicant@example.com" },
		} as never);

		const result = await service.updateApplicationStatus(10, "Rejected");

		expect(transactionClient.jobRole.updateMany).not.toHaveBeenCalled();
		expect(result.status).toBe("Rejected");
	});

	it("does not assess an application that is no longer in progress", async () => {
		vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
			callback(transactionClient as never),
		);
		transactionClient.application.findUnique.mockResolvedValue({
			...assessmentApplication,
			status: { statusId: 4, statusName: "Hired" },
		} as never);

		await expect(
			service.updateApplicationStatus(10, "Rejected"),
		).rejects.toMatchObject({
			statusCode: 409,
			message: "Only applications in progress can be assessed",
		});
	});

	it("does not hire when no open positions remain", async () => {
		vi.mocked(prisma.$transaction).mockImplementation(async (callback) =>
			callback(transactionClient as never),
		);
		transactionClient.application.findUnique.mockResolvedValue(
			assessmentApplication as never,
		);
		transactionClient.status.findUnique.mockResolvedValue({
			statusId: 4,
			statusName: "Hired",
		} as never);
		transactionClient.jobRole.updateMany.mockResolvedValue({ count: 0 });

		await expect(
			service.updateApplicationStatus(10, "Hired"),
		).rejects.toMatchObject({
			statusCode: 409,
			message: "There are no open positions remaining for this role",
		});
		expect(transactionClient.application.update).not.toHaveBeenCalled();
	});
});
