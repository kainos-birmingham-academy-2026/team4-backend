import { beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../src/prismaClient";
import { JobRoleService } from "../../src/services/jobRoleService";
import {
	mockJobRole1,
	mockJobRoleDetailedResponse1,
	mockJobRoleResponse1,
	mockJobRoleResponses,
	mockJobRoles,
} from "../mockJobRoles";

const mapJobRoleToResponseMock = vi.fn();
const mapJobRoleToDetailedResponseMock = vi.fn();

vi.mock("../../src/prismaClient", () => ({
	default: {
		jobRole: {
			findMany: vi.fn(),
			create: vi.fn(),
		},
		capability: {
			findUnique: vi.fn(),
			findMany: vi.fn(),
		},
		band: {
			findUnique: vi.fn(),
			findMany: vi.fn(),
		},
		status: {
			findUnique: vi.fn(),
			findMany: vi.fn(),
		},
	},
}));

vi.mock("../../src/mappers/jobRoleMapper", () => ({
	JobRoleMapper: vi.fn(function (this: {
		mapJobRoleToResponse: typeof mapJobRoleToResponseMock;
		mapJobRoleToDetailedResponse: typeof mapJobRoleToDetailedResponseMock;
	}) {
		this.mapJobRoleToResponse = mapJobRoleToResponseMock;
		this.mapJobRoleToDetailedResponse = mapJobRoleToDetailedResponseMock;
	}),
}));

describe("JobRoleService - findAllJobRoles", () => {
	let jobRoleService: JobRoleService;

	beforeEach(() => {
		vi.clearAllMocks();
		mapJobRoleToResponseMock.mockReset();
		jobRoleService = new JobRoleService();
	});

	it("should return all seeded job roles", async () => {
		vi.mocked(prisma).jobRole.findMany = vi
			.fn()
			.mockResolvedValue(mockJobRoles);
		mapJobRoleToResponseMock
			.mockResolvedValueOnce(mockJobRoleResponses[0])
			.mockResolvedValueOnce(mockJobRoleResponses[1]);

		const result = await jobRoleService.findAllJobRoles();

		expect(result).toEqual(mockJobRoleResponses);
		expect(mapJobRoleToResponseMock).toHaveBeenCalledTimes(mockJobRoles.length);
	});
});

describe("JobRoleService - findJobRoleById", () => {
	let jobRoleService: JobRoleService;

	beforeEach(() => {
		vi.clearAllMocks();
		mapJobRoleToDetailedResponseMock.mockReset();
		jobRoleService = new JobRoleService();
	});

	it("should return the job role when found", async () => {
		const jobRoleId = 1;
		vi.mocked(prisma).jobRole.findUnique = vi
			.fn()
			.mockResolvedValue(mockJobRole1);
		mapJobRoleToDetailedResponseMock.mockResolvedValue(mockJobRoleResponse1);

		const result = await jobRoleService.findJobRoleById(jobRoleId);

		expect(result).toEqual(mockJobRoleResponse1);
		expect(mapJobRoleToDetailedResponseMock).toHaveBeenCalledTimes(1);
	});

	it("should return null when the job role is not found", async () => {
		vi.mocked(prisma).jobRole.findUnique = vi.fn().mockResolvedValue(null);

		const result = await jobRoleService.findJobRoleById(999);

		expect(result).toBeNull();
		expect(mapJobRoleToDetailedResponseMock).not.toHaveBeenCalled();
	});
});

describe("JobRoleService - findPaginatedJobRoles", () => {
	let jobRoleService: JobRoleService;

	beforeEach(() => {
		vi.clearAllMocks();
		mapJobRoleToResponseMock.mockReset();
		jobRoleService = new JobRoleService();
	});

	it("should return paginated job roles with total count", async () => {
		vi.mocked(prisma).jobRole.findMany = vi
			.fn()
			.mockResolvedValue([mockJobRoles[0]]);
		vi.mocked(prisma).jobRole.count = vi.fn().mockResolvedValue(25);
		mapJobRoleToResponseMock.mockResolvedValue(mockJobRoleResponses[0]);

		const result = await jobRoleService.findPaginatedJobRoles(0, 10);

		expect(result).toEqual({
			jobs: [mockJobRoleResponses[0]],
			totalCount: 25,
		});
		expect(vi.mocked(prisma).jobRole.findMany).toHaveBeenCalledWith({
			where: {},
			skip: 0,
			take: 10,
			orderBy: { jobRoleId: "asc" },
		});
		expect(vi.mocked(prisma).jobRole.count).toHaveBeenCalledWith({ where: {} });
		expect(mapJobRoleToResponseMock).toHaveBeenCalledTimes(1);
	});

	it("should return paginated results for page 2", async () => {
		vi.mocked(prisma).jobRole.findMany = vi
			.fn()
			.mockResolvedValue([mockJobRoles[1]]);
		vi.mocked(prisma).jobRole.count = vi.fn().mockResolvedValue(25);
		mapJobRoleToResponseMock.mockResolvedValue(mockJobRoleResponses[1]);

		const result = await jobRoleService.findPaginatedJobRoles(10, 10);

		expect(result).toEqual({
			jobs: [mockJobRoleResponses[1]],
			totalCount: 25,
		});
		expect(vi.mocked(prisma).jobRole.findMany).toHaveBeenCalledWith({
			where: {},
			skip: 10,
			take: 10,
			orderBy: { jobRoleId: "asc" },
		});
	});

	it("should order by a direct job role field", async () => {
		vi.mocked(prisma).jobRole.findMany = vi.fn().mockResolvedValue([]);
		vi.mocked(prisma).jobRole.count = vi.fn().mockResolvedValue(0);

		await jobRoleService.findPaginatedJobRoles(
			0,
			10,
			{},
			{ sortBy: "roleName", sortOrder: "desc" },
		);

		expect(vi.mocked(prisma).jobRole.findMany).toHaveBeenCalledWith({
			where: {},
			skip: 0,
			take: 10,
			orderBy: { roleName: "desc" },
		});
	});

	it("should order by a related job role field", async () => {
		vi.mocked(prisma).jobRole.findMany = vi.fn().mockResolvedValue([]);
		vi.mocked(prisma).jobRole.count = vi.fn().mockResolvedValue(0);

		await jobRoleService.findPaginatedJobRoles(
			0,
			10,
			{},
			{ sortBy: "capability", sortOrder: "asc" },
		);

		expect(vi.mocked(prisma).jobRole.findMany).toHaveBeenCalledWith({
			where: {},
			skip: 0,
			take: 10,
			orderBy: { capability: { capabilityName: "asc" } },
		});
	});
});

describe("JobRoleService - findPaginatedJobRoles filtering", () => {
	let jobRoleService: JobRoleService;

	beforeEach(() => {
		vi.clearAllMocks();
		mapJobRoleToResponseMock.mockReset();
		jobRoleService = new JobRoleService();
		vi.mocked(prisma).jobRole.findMany = vi.fn().mockResolvedValue([]);
		vi.mocked(prisma).jobRole.count = vi.fn().mockResolvedValue(0);
	});

	it("should build a case-insensitive contains clause for free text fields", async () => {
		await jobRoleService.findPaginatedJobRoles(0, 10, {
			roleName: "engineer",
			location: "belfast",
		});

		expect(vi.mocked(prisma).jobRole.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({
					roleName: { contains: "engineer", mode: "insensitive" },
					location: { contains: "belfast", mode: "insensitive" },
				}),
			}),
		);
	});

	it("should build an 'in' clause on the related name for checkbox fields", async () => {
		await jobRoleService.findPaginatedJobRoles(0, 10, {
			capability: ["Engineering", "Data"],
			band: ["Consultant"],
			status: ["Open"],
		});

		expect(vi.mocked(prisma).jobRole.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: {
					capability: { capabilityName: { in: ["Engineering", "Data"] } },
					band: { bandName: { in: ["Consultant"] } },
					status: { statusName: { in: ["Open"] } },
				},
			}),
		);
	});

	it("should build an upper bound clause for closing date", async () => {
		const closingDate = new Date("2026-12-31T23:59:59.999Z");

		await jobRoleService.findPaginatedJobRoles(0, 10, { closingDate });

		expect(vi.mocked(prisma).jobRole.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: {
					closingDate: { lte: closingDate },
				},
			}),
		);
	});

	it("should apply the same where clause to the count", async () => {
		await jobRoleService.findPaginatedJobRoles(0, 10, { status: ["Open"] });

		expect(vi.mocked(prisma).jobRole.count).toHaveBeenCalledWith({
			where: {
				status: { statusName: { in: ["Open"] } },
			},
		});
	});

	it("should ignore empty array filters", async () => {
		await jobRoleService.findPaginatedJobRoles(0, 10, {
			capability: [],
			band: [],
			status: [],
		});

		expect(vi.mocked(prisma).jobRole.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				where: {},
			}),
		);
	});
});

describe("JobRoleService - findFilterOptions", () => {
	let jobRoleService: JobRoleService;

	beforeEach(() => {
		vi.clearAllMocks();
		jobRoleService = new JobRoleService();
	});

	it("it should return the distinct names for each checkbox filter", async () => {
		vi.mocked(prisma).capability.findMany = vi
			.fn()
			.mockResolvedValue([
				{ capabilityName: "Data" },
				{ capabilityName: "Engineering" },
			]);
		vi.mocked(prisma).band.findMany = vi
			.fn()
			.mockResolvedValue([{ bandName: "Consultant" }]);
		vi.mocked(prisma).status.findMany = vi
			.fn()
			.mockResolvedValue([{ statusName: "Open" }, { statusName: "Closed" }]);

		const result = await jobRoleService.findFilterOptions();

		expect(result).toEqual({
			capabilities: ["Data", "Engineering"],
			bands: ["Consultant"],
			statuses: ["Open", "Closed"],
		});
	});
});

describe("JobRoleService - findCreateOptions", () => {
	let jobRoleService: JobRoleService;

	beforeEach(() => {
		vi.clearAllMocks();
		jobRoleService = new JobRoleService();
	});

	it("returns capability and band IDs with names", async () => {
		vi.mocked(prisma).capability.findMany = vi
			.fn()
			.mockResolvedValue([{ capabilityId: 2, capabilityName: "Engineering" }]);
		vi.mocked(prisma).band.findMany = vi
			.fn()
			.mockResolvedValue([{ bandId: 3, bandName: "Consultant" }]);

		const result = await jobRoleService.findCreateOptions();

		expect(result).toEqual({
			capabilities: [{ id: 2, name: "Engineering" }],
			bands: [{ id: 3, name: "Consultant" }],
		});
		expect(prisma.capability.findMany).toHaveBeenCalledWith({
			select: { capabilityId: true, capabilityName: true },
			orderBy: { capabilityName: "asc" },
		});
		expect(prisma.band.findMany).toHaveBeenCalledWith({
			select: { bandId: true, bandName: true },
			orderBy: { bandName: "asc" },
		});
	});
});

describe("JobRoleService - createJobRole", () => {
	let jobRoleService: JobRoleService;

	beforeEach(() => {
		vi.clearAllMocks();
		mapJobRoleToDetailedResponseMock.mockReset();
		jobRoleService = new JobRoleService();
	});

	it("creates a job role with the Open status", async () => {
		const input = {
			roleName: "Software Engineer",
			description: "Develop software applications.",
			sharepointUrl: "https://sharepoint.example.com/job-role",
			responsibilities: ["Write code", "Review code"],
			numberOfOpenPositions: 3,
			location: "Birmingham",
			closingDate: new Date("2026-12-31"),
			capabilityId: 1,
			bandId: 2,
		};

		vi.mocked(prisma).capability.findUnique = vi.fn().mockResolvedValue({
			capabilityId: 1,
			capabilityName: "Engineering",
		});
		vi.mocked(prisma).band.findUnique = vi.fn().mockResolvedValue({
			bandId: 2,
			bandName: "Trainee",
		});
		vi.mocked(prisma).status.findUnique = vi.fn().mockResolvedValue({
			statusId: 1,
			statusName: "Open",
		});
		vi.mocked(prisma).jobRole.create = vi.fn().mockResolvedValue(mockJobRole1);
		mapJobRoleToDetailedResponseMock.mockResolvedValue(
			mockJobRoleDetailedResponse1,
		);

		const result = await jobRoleService.createJobRole(input);

		expect(result).toEqual(mockJobRoleDetailedResponse1);
		expect(prisma.status.findUnique).toHaveBeenCalledWith({
			where: { statusName: "Open" },
		});
		expect(prisma.jobRole.create).toHaveBeenCalledWith({
			data: {
				...input,
				statusId: 1,
			},
		});
	});

	it("throws when the capability does not exist", async () => {
		vi.mocked(prisma).capability.findUnique = vi.fn().mockResolvedValue(null);
		vi.mocked(prisma).band.findUnique = vi.fn().mockResolvedValue({
			bandId: 2,
			bandName: "Trainee",
		});
		vi.mocked(prisma).status.findUnique = vi.fn().mockResolvedValue({
			statusId: 1,
			statusName: "Open",
		});

		await expect(
			jobRoleService.createJobRole({
				roleName: "Software Engineer",
				description: "Develop software applications.",
				sharepointUrl: "https://sharepoint.example.com/job-role",
				responsibilities: ["Write code"],
				numberOfOpenPositions: 1,
				location: "Birmingham",
				closingDate: new Date("2026-12-31"),
				capabilityId: 999,
				bandId: 2,
			}),
		).rejects.toThrow("Capability not found");

		expect(prisma.jobRole.create).not.toHaveBeenCalled();
	});

	it("throws when the band does not exist", async () => {
		vi.mocked(prisma).capability.findUnique = vi.fn().mockResolvedValue({
			capabilityId: 1,
			capabilityName: "Engineering",
		});
		vi.mocked(prisma).band.findUnique = vi.fn().mockResolvedValue(null);
		vi.mocked(prisma).status.findUnique = vi.fn().mockResolvedValue({
			statusId: 1,
			statusName: "Open",
		});

		await expect(
			jobRoleService.createJobRole({
				roleName: "Software Engineer",
				description: "Develop software applications.",
				sharepointUrl: "https://sharepoint.example.com/job-role",
				responsibilities: ["Write code"],
				numberOfOpenPositions: 1,
				location: "Birmingham",
				closingDate: new Date("2026-12-31"),
				capabilityId: 1,
				bandId: 999,
			}),
		).rejects.toThrow("Band not found");

		expect(prisma.jobRole.create).not.toHaveBeenCalled();
	});
});
