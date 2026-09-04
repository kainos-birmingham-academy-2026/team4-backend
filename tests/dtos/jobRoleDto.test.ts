import { describe, expect, it } from "vitest";
import {
	IdParamSchema,
	JobRoleCreateSchema,
	JobRoleDetailedResponse,
	JobRoleFilterSchema,
	JobRoleResponse,
} from "../../src/dtos/jobRoleDto";

describe("JobRole DTOs", () => {
	it("coerces numeric id params", () => {
		const result = IdParamSchema.parse({ id: "42" });

		expect(result.id).toBe(42);
	});

	it("fails for non-positive ids", () => {
		const result = IdParamSchema.safeParse({ id: "0" });

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toContain("positive integer");
		}
	});

	it("accepts a valid ordering query", () => {
		const result = JobRoleFilterSchema.parse({
			sortBy: "roleName",
			sortOrder: "desc",
		});

		expect(result.sortBy).toBe("roleName");
		expect(result.sortOrder).toBe("desc");
	});

	it("rejects ordering when sortBy and sortOrder are not provided together", () => {
		const result = JobRoleFilterSchema.safeParse({ sortBy: "roleName" });

		expect(result.success).toBe(false);
	});

	it("accepts a valid job role creation payload", () => {
		const result = JobRoleCreateSchema.safeParse({
			roleName: "Software Engineer",
			description: "Develop software applications.",
			sharepointUrl: "https://sharepoint.example.com/job-role",
			responsibilities: ["Write code", "Review code"],
			numberOfOpenPositions: "3",
			location: "Birmingham",
			closingDate: "2026-12-31",
			capabilityId: "1",
			bandId: "2",
		});

		expect(result.success).toBe(true);

		if (result.success) {
			expect(result.data.numberOfOpenPositions).toBe(3);
			expect(result.data.capabilityId).toBe(1);
			expect(result.data.bandId).toBe(2);
			expect(result.data.closingDate).toBeInstanceOf(Date);
		}
	});

	it("rejects an invalid job role creation payload", () => {
		const result = JobRoleCreateSchema.safeParse({
			roleName: "",
			description: "",
			sharepointUrl: "not-a-url",
			responsibilities: [],
			numberOfOpenPositions: -1,
			location: "",
			closingDate: "invalid-date",
			capabilityId: 0,
			bandId: 0,
		});

		expect(result.success).toBe(false);
	});

	it("creates a JobRoleResponse with required fields", () => {
		const dto = new JobRoleResponse(
			1,
			"Software Engineer",
			"London",
			"Engineering",
			"Band 2",
			null,
			"Open",
		);

		expect(dto.roleName).toBe("Software Engineer");
		expect(dto.status).toBe("Open");
	});

	it("throws when a required string field is empty", () => {
		expect(
			() =>
				new JobRoleResponse(
					1,
					"",
					"London",
					"Engineering",
					"Band 2",
					null,
					"Open",
				),
		).toThrow("fields are required");
	});

	it("creates a JobRoleDetailedResponse", () => {
		const dto = new JobRoleDetailedResponse(
			1,
			"Software Engineer",
			"London",
			"Engineering",
			"Band 2",
			null,
			"Open",
			"Build APIs",
			["Write code", "Review PRs"],
			"https://sharepoint.example/job",
			2,
		);

		expect(dto.description).toBe("Build APIs");
		expect(dto.numberOfOpenPositions).toBe(2);
	});
});
