import type { JobRole } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobRoleMapper } from "../../src/mappers/jobRoleMapper";
import prisma from "../../src/prismaClient";

vi.mock("../../src/prismaClient", () => ({
	default: {
		capability: { findUnique: vi.fn() },
		band: { findUnique: vi.fn() },
		status: { findUnique: vi.fn() },
	},
}));

const baseJobRole: JobRole = {
	jobRoleId: 12,
	roleName: "Software Engineer",
	location: "Birmingham",
	capabilityId: 3,
	bandId: 2,
	closingDate: new Date("2026-12-01T00:00:00.000Z"),
	statusId: 1,
	description: "Build backend services",
	responsibilities: ["Code", "Review"],
	sharepointUrl: "https://sharepoint.example/jobs/12",
	numberOfOpenPositions: 2,
};

describe("JobRoleMapper", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("maps a job role response with resolved names", async () => {
		vi.mocked(prisma).capability.findUnique = vi
			.fn()
			.mockResolvedValue({ capabilityName: "Engineering" });
		vi.mocked(prisma).band.findUnique = vi
			.fn()
			.mockResolvedValue({ bandName: "Band 2" });
		vi.mocked(prisma).status.findUnique = vi
			.fn()
			.mockResolvedValue({ statusName: "Open" });

		const mapper = new JobRoleMapper();
		const result = await mapper.mapJobRoleToResponse(baseJobRole);

		expect(result.capability).toBe("Engineering");
		expect(result.band).toBe("Band 2");
		expect(result.status).toBe("Open");
		expect(result.roleName).toBe("Software Engineer");
	});

	it("falls back to Unknown when related records are missing", async () => {
		vi.mocked(prisma).capability.findUnique = vi.fn().mockResolvedValue(null);
		vi.mocked(prisma).band.findUnique = vi.fn().mockResolvedValue(null);
		vi.mocked(prisma).status.findUnique = vi.fn().mockResolvedValue(null);

		const mapper = new JobRoleMapper();
		const result = await mapper.mapJobRoleToDetailedResponse(baseJobRole);

		expect(result.capability).toBe("Unknown");
		expect(result.band).toBe("Unknown");
		expect(result.status).toBe("Unknown");
		expect(result.description).toBe("Build backend services");
		expect(result.responsibilities).toEqual(["Code", "Review"]);
	});
});
