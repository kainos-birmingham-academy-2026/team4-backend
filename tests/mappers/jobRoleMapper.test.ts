import { beforeEach, describe, expect, it, vi } from "vitest";
import type { JobRoleResponse } from "../../src/dtos/jobRoleDto";
import { JobRoleMapper } from "../../src/mappers/jobRoleMapper";
import prisma from "../../src/prismaClient";
import {
	mockJobRole1,
	mockJobRoleDetailedResponse1,
	mockJobRoleResponse1,
} from "../mockJobRoles";

vi.mock("../../src/prismaClient", () => ({
	default: {
		jobRole: {
			findUnique: vi.fn(),
		},
		capability: {
			findUnique: vi.fn(),
		},
		band: {
			findUnique: vi.fn(),
		},
		status: {
			findUnique: vi.fn(),
		},
	},
}));

const jobRoleMapper = new JobRoleMapper();

describe("jobRoleMapper - mapJobRoleToResponse", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return a JobRoleResponse with correct values", async () => {
		prisma.capability.findUnique = vi
			.fn()
			.mockResolvedValue({ capabilityName: mockJobRoleResponse1.capability });
		prisma.band.findUnique = vi
			.fn()
			.mockResolvedValue({ bandName: mockJobRoleResponse1.band });
		prisma.status.findUnique = vi
			.fn()
			.mockResolvedValue({ statusName: mockJobRoleResponse1.status });

		const result = await jobRoleMapper.mapJobRoleToResponse(mockJobRole1);
		expect(result).toEqual(mockJobRoleResponse1 as JobRoleResponse);
	});

	it("should use the value 'Unknown' if a field name isn't found", async () => {
		prisma.capability.findUnique = vi.fn().mockResolvedValue(null);
		prisma.band.findUnique = vi.fn().mockResolvedValue(null);
		prisma.status.findUnique = vi.fn().mockResolvedValue(null);
		const result = await jobRoleMapper.mapJobRoleToResponse(mockJobRole1);
		expect(result.capability).toBe("Unknown");
		expect(result.band).toBe("Unknown");
		expect(result.status).toBe("Unknown");
	});
});

describe("jobRoleMapper - mapJobRoleToDetailedResponse", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return a JobRoleDetailedResponse with correct values", async () => {
		prisma.capability.findUnique = vi
			.fn()
			.mockResolvedValue({ capabilityName: mockJobRoleResponse1.capability });
		prisma.band.findUnique = vi
			.fn()
			.mockResolvedValue({ bandName: mockJobRoleResponse1.band });
		prisma.status.findUnique = vi
			.fn()
			.mockResolvedValue({ statusName: mockJobRoleResponse1.status });

		const result =
			await jobRoleMapper.mapJobRoleToDetailedResponse(mockJobRole1);
		expect(result).toEqual(mockJobRoleDetailedResponse1);
	});

	it("should use the value 'Unknown' if a field name isn't found", async () => {
		prisma.capability.findUnique = vi.fn().mockResolvedValue(null);
		prisma.band.findUnique = vi.fn().mockResolvedValue(null);
		prisma.status.findUnique = vi.fn().mockResolvedValue(null);
		const result =
			await jobRoleMapper.mapJobRoleToDetailedResponse(mockJobRole1);
		expect(result.capability).toBe("Unknown");
		expect(result.band).toBe("Unknown");
		expect(result.status).toBe("Unknown");
	});
});
