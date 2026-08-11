import { describe, expect, it } from "vitest";
import {
	IdParamSchema,
	JobRoleDetailedResponse,
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
