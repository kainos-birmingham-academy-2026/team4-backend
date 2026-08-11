import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createJobRoleRouter } from "../../src/routes/jobRoleRouter";
import { JobRoleService } from "../../src/services/jobRoleService";
import { mockJobRole1, mockJobRoles } from "../mockJobRoles";

vi.mock("../../src/services/jobRoleService");

const mockFindAllJobRoles = vi.fn().mockResolvedValue(mockJobRoles);
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
		mockService.findAllJobRoles = mockFindAllJobRoles;

		const response = await request(testApp).get("/api/job-roles/");

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockJobRoles);
	});
});

describe("GET /api/job-roles/:id", async () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return the job role with status 200 when found", async () => {
		mockService.findJobRoleById = vi.fn().mockResolvedValue(mockJobRole1);

		const response = await request(testApp).get(`/api/job-roles/1`);

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockJobRole1);
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
		expect(response.body).toEqual([
			{ field: "id", message: "Invalid input: expected number, received NaN" },
		]);
	});
});
