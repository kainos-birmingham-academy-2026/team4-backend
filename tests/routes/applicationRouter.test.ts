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

describe("GET /api/applications/job-role/:jobRoleId", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns applications for a job role", async () => {
		const applications = [{ applicationId: 10, status: "In Progress" }];
		mockService.findApplicationsByJobRoleId = vi
			.fn()
			.mockResolvedValue(applications);

		const response = await request(testApp).get("/api/applications/job-role/1");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ applications });
		expect(mockService.findApplicationsByJobRoleId).toHaveBeenCalledWith(1);
	});

	it("rejects an invalid job role ID", async () => {
		const response = await request(testApp).get(
			"/api/applications/job-role/not-a-number",
		);

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});

describe("POST /api/applications/:applicationId/:action", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("hires an application", async () => {
		const hired = { applicationId: 10, status: "Hired" };
		mockService.updateApplicationStatus = vi.fn().mockResolvedValue(hired);

		const response = await request(testApp).post("/api/applications/10/hire");

		expect(response.status).toBe(200);
		expect(response.body).toEqual(hired);
		expect(mockService.updateApplicationStatus).toHaveBeenCalledWith(
			10,
			"Hired",
		);
	});

	it("rejects an unsupported assessment action", async () => {
		const response = await request(testApp).post(
			"/api/applications/10/shortlist",
		);

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});
