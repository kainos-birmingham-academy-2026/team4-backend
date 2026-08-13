import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createJobRoleRouter } from "../../src/routes/jobRoleRouter";
import { JobRoleService } from "../../src/services/jobRoleService";
import {
	mockJobRoleResponse1,
	mockJobRoleResponses,
	mockJobRoles,
} from "../mockJobRoles";

vi.mock("../../src/services/jobRoleService");
vi.mock("../../src/middlewares/requireAuth", () => ({
	requireAuth: vi.fn((_req, _res, next) => next()),
}));

const mockService = new (vi.mocked(JobRoleService))();

const testApp = express();
testApp.use(express.json());
testApp.use(express.urlencoded({ extended: true }));
testApp.use(
	"/api/job-roles",
	createJobRoleRouter(mockService as unknown as JobRoleService),
);

describe("GET /api/job-roles", async () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return paginated job roles with status 200", async () => {
		mockService.findPaginatedJobRoles = vi.fn().mockResolvedValue({
			jobs: mockJobRoles,
			totalCount: 25,
		});

		const response = await request(testApp).get("/api/job-roles");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			jobs: JSON.parse(JSON.stringify(mockJobRoles)),
			pagination: {
				currentPage: 1,
				totalPages: 3,
				totalCount: 25,
				pageSize: 10,
				hasNext: true,
				hasPrev: false,
			},
		});
	});

	it("should return paginated results for page 2", async () => {
		mockService.findPaginatedJobRoles = vi.fn().mockResolvedValue({
			jobs: [mockJobRoles[0]],
			totalCount: 25,
		});

		const response = await request(testApp).get("/api/job-roles?page=2");

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			jobs: JSON.parse(JSON.stringify([mockJobRoles[0]])),
			pagination: {
				currentPage: 2,
				totalPages: 3,
				totalCount: 25,
				pageSize: 10,
				hasNext: true,
				hasPrev: true,
			},
		});
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
