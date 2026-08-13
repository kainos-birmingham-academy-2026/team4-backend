import { beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../src/prismaClient";
import { JobRoleService } from "../../src/services/jobRoleService";
import {
	mockJobRole1,
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
		},
		capability: {
			findUnique: vi.fn(),
		},
		band: {
			findUnique: vi.fn(),
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
			skip: 0,
			take: 10,
			orderBy: { jobRoleId: "asc" },
		});
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
			skip: 10,
			take: 10,
			orderBy: { jobRoleId: "asc" },
		});
	});
});
