import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApplicationRouter } from "../../src/routes/applicationRouter";
import { ApplicationService } from "../../src/services/applicationService";

vi.mock("../../src/services/applicationService");
vi.mock("../../src/middlewares/requireAuth", () => ({
	requireAuth: vi.fn(() => {
		return (
			_req: unknown,
			res: { locals: Record<string, unknown> },
			next: () => void,
		) => {
			res.locals.authUser = {
				userId: 5,
				email: "user@example.com",
				role: "USER",
			};
			next();
		};
	}),
}));

process.env.JWT_SECRET = "test-secret";

const mockService = new (vi.mocked(ApplicationService))();

const testApp = express();
testApp.use(express.json());
testApp.use("/api/applications", createApplicationRouter(mockService));

describe("POST /api/applications", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("creates an application and returns 201", async () => {
		const created = {
			applicationId: 10,
			userId: 5,
			jobRoleId: 1,
			status: "In Progress",
			createdAt: new Date("2026-09-03T12:00:00.000Z"),
		};
		mockService.createApplication = vi.fn().mockResolvedValue(created);

		const response = await request(testApp)
			.post("/api/applications")
			.send({ jobRoleId: 1, message: "I am interested in this role." });

		expect(response.status).toBe(201);
		expect(response.body).toEqual(JSON.parse(JSON.stringify(created)));
		expect(mockService.createApplication).toHaveBeenCalledWith(
			5,
			1,
			"I am interested in this role.",
		);
	});

	it("returns 400 when jobRoleId is missing", async () => {
		const response = await request(testApp).post("/api/applications").send({});

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});

	it("returns 400 when jobRoleId is not a positive integer", async () => {
		const response = await request(testApp)
			.post("/api/applications")
			.send({ jobRoleId: 0 });

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});

describe("GET /api/applications", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns the current user's applications", async () => {
		const applications = [
			{
				applicationId: 10,
				userId: 5,
				jobRoleId: 1,
				status: "In Progress",
				createdAt: new Date("2026-09-03T12:00:00.000Z"),
			},
		];
		mockService.findApplicationsByUserId = vi
			.fn()
			.mockResolvedValue(applications);

		const response = await request(testApp).get("/api/applications");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			applications: JSON.parse(JSON.stringify(applications)),
		});
		expect(mockService.findApplicationsByUserId).toHaveBeenCalledWith(5);
	});
});
