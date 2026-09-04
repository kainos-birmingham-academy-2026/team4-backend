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
});
