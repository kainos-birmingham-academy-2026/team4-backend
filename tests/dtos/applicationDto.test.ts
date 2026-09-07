import { describe, expect, it } from "vitest";
import { CreateApplicationSchema } from "../../src/dtos/applicationDto";

describe("CreateApplicationSchema", () => {
	it("accepts a positive integer jobRoleId and message", () => {
		const result = CreateApplicationSchema.safeParse({
			jobRoleId: 3,
			message: "I am interested in this role.",
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.jobRoleId).toBe(3);
		}
	});

	it("coerces a numeric string jobRoleId", () => {
		const result = CreateApplicationSchema.safeParse({
			jobRoleId: "12",
			message: "I am interested in this role.",
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.jobRoleId).toBe(12);
		}
	});

	it("rejects a missing jobRoleId", () => {
		const result = CreateApplicationSchema.safeParse({});

		expect(result.success).toBe(false);
	});

	it("rejects a non-positive jobRoleId", () => {
		const result = CreateApplicationSchema.safeParse({
			jobRoleId: 0,
			message: "I am interested in this role.",
		});

		expect(result.success).toBe(false);
	});

	it("rejects an empty message", () => {
		const result = CreateApplicationSchema.safeParse({
			jobRoleId: 3,
			message: "   ",
		});

		expect(result.success).toBe(false);
	});
});
