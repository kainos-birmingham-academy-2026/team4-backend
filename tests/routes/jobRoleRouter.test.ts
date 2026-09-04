import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createJobRoleRouter } from "../../src/routes/jobRoleRouter";
import { JobRoleService } from "../../src/services/jobRoleService";
import { mockJobRoleResponse1, mockJobRoleResponses } from "../mockJobRoles";

vi.mock("../../src/services/jobRoleService");
vi.mock("../../src/middlewares/requireAuth", () => ({
	requireAuth: vi.fn((_requireAdmin?: boolean) => {
		return (
			_req: express.Request,
			_res: express.Response,
			next: express.NextFunction,
		) => {
			next();
		};
	}),
}));

// Set JWT_SECRET for test environment
process.env.JWT_SECRET = "test-secret";

const mockFindPaginatedJobRoles = vi.fn().mockResolvedValue({
	jobs: mockJobRoleResponses,
	totalCount: mockJobRoleResponses.length,
});
const mockService = new (vi.mocked(JobRoleService))();

const testApp = express();
testApp.use(express.json());
testApp.use(express.urlencoded({ extended: true }));
testApp.use("/api/job-roles", createJobRoleRouter(mockService));

describe("GET /api/job-roles", async () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return all open job roles with status 200", async () => {
		mockService.findPaginatedJobRoles = mockFindPaginatedJobRoles;
		const response = await request(testApp).get("/api/job-roles/");

		expect(response.status).toBe(200);
		expect(response.body.jobs).toEqual(
			JSON.parse(JSON.stringify(mockJobRoleResponses)),
		);
	});
});

describe("GET /api/job-roles/:id", async () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return the job role with status 200 when found", async () => {
		mockService.findJobRoleById = vi
			.fn()
			.mockResolvedValue(mockJobRoleResponse1);

		const response = await request(testApp).get(`/api/job-roles/1`);

		expect(response.status).toBe(200);
		expect(response.body).toEqual(
			JSON.parse(JSON.stringify(mockJobRoleResponse1)),
		);
	});

	it("should return status 404 when the job role is not found", async () => {
		mockService.findJobRoleById = vi.fn().mockResolvedValue(null);

		const response = await request(testApp).get(`/api/job-roles/1`);

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ error: "Job role not found" });
	});

	it("should return status 500 when a service error occurs", async () => {
		mockService.findJobRoleById = vi
			.fn()
			.mockRejectedValue(new Error("Service error"));

		const response = await request(testApp).get(`/api/job-roles/1`);

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ error: "Internal server error" });
	});

	it("should return status 400 when the id is not a number", async () => {
		const response = await request(testApp).get(`/api/job-roles/abc`);

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});

	it("should return status 400 when the id isn't positive", async () => {
		const response = await request(testApp).get(`/api/job-roles/0`);

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});
