import { describe, expect, it } from "vitest";
import { ApplicationMapper } from "../../src/mappers/applicationMapper";

const mapper = new ApplicationMapper();

describe("ApplicationMapper", () => {
	it("maps an application to a response with a display status", () => {
		const createdAt = new Date("2026-09-03T12:00:00.000Z");

		const result = mapper.mapApplicationToResponse(
			{
				applicationId: 1,
				userId: 4,
				jobRoleId: 8,
				message: "",
				statusId: 3,
				createdAt,
			},
			"In Progress",
		);

		expect(result).toEqual({
			applicationId: 1,
			userId: 4,
			jobRoleId: 8,
			status: "In Progress",
			createdAt,
		});
	});
});
