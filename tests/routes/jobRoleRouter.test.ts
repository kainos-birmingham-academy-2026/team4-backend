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

const createJobRolePayload = {
	roleName: "Software Engineer",
	description: "Develop software applications.",
	sharepointUrl: "https://sharepoint.example.com/job-role",
	responsibilities: ["Write code", "Review code"],
	numberOfOpenPositions: 3,
	location: "Birmingham",
	closingDate: "2026-12-31",
	capabilityId: 1,
	bandId: 2,
};

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

describe("GET /api/job-roles/create-options", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns capability and band IDs with status 200", async () => {
		mockService.findCreateOptions = vi.fn().mockResolvedValue({
			capabilities: [{ id: 1, name: "Engineering" }],
			bands: [{ id: 2, name: "Trainee" }],
		});

		const response = await request(testApp).get(
			"/api/job-roles/create-options",
		);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			capabilities: [{ id: 1, name: "Engineering" }],
			bands: [{ id: 2, name: "Trainee" }],
		});
	});

	it("returns 500 when options cannot be loaded", async () => {
		mockService.findCreateOptions = vi
			.fn()
			.mockRejectedValue(new Error("Database error"));

		const response = await request(testApp).get(
			"/api/job-roles/create-options",
		);

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ error: "Internal server error" });
	});
});

describe("POST /api/job-roles", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should create a job role with status 201", async () => {
		mockService.createJobRole = vi.fn().mockResolvedValue({
			jobRoleId: 3,
			roleName: "Software Engineer",
			location: "Birmingham",
			capability: "Engineering",
			band: "Trainee",
			closingDate: new Date("2026-12-31"),
			status: "Open",
			description: "Develop software applications.",
			responsibilities: ["Write code", "Review code"],
			sharepointUrl: "https://sharepoint.example.com/job-role",
			numberOfOpenPositions: 3,
		});

		const response = await request(testApp)
			.post("/api/job-roles/")
			.send(createJobRolePayload);

		expect(response.status).toBe(201);
		expect(response.body.status).toBe("Open");
		expect(mockService.createJobRole).toHaveBeenCalledWith({
			...createJobRolePayload,
			closingDate: new Date("2026-12-31"),
		});
	});

	it("should return 400 for an invalid request body", async () => {
		const response = await request(testApp)
			.post("/api/job-roles/")
			.send({
				...createJobRolePayload,
				roleName: "",
				numberOfOpenPositions: -1,
			});

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
		expect(mockService.createJobRole).not.toHaveBeenCalled();
	});

	it("should return 400 when the capability does not exist", async () => {
		mockService.createJobRole = vi
			.fn()
			.mockRejectedValue(new Error("Capability not found"));

		const response = await request(testApp)
			.post("/api/job-roles/")
			.send(createJobRolePayload);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: "Capability not found" });
	});

	it("should return 400 when the band does not exist", async () => {
		mockService.createJobRole = vi
			.fn()
			.mockRejectedValue(new Error("Band not found"));

		const response = await request(testApp)
			.post("/api/job-roles/")
			.send(createJobRolePayload);

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: "Band not found" });
	});

	it("should return 500 when creation fails unexpectedly", async () => {
		mockService.createJobRole = vi
			.fn()
			.mockRejectedValue(new Error("Database error"));

		const response = await request(testApp)
			.post("/api/job-roles/")
			.send(createJobRolePayload);

		expect(response.status).toBe(500);
		expect(response.body).toEqual({ error: "Internal server error" });
	});
});

describe("PUT /api/job-roles/:id", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("updates a job role with status 200", async () => {
		mockService.updateJobRole = vi.fn().mockResolvedValue({
			jobRoleId: 1,
			...createJobRolePayload,
			capability: "Engineering",
			band: "Trainee",
			status: "Closed",
		});

		const response = await request(testApp)
			.put("/api/job-roles/1")
			.send({ ...createJobRolePayload, statusId: 1 });

		expect(response.status).toBe(200);
		expect(mockService.updateJobRole).toHaveBeenCalledWith(1, {
			...createJobRolePayload,
			closingDate: new Date("2026-12-31"),
			statusId: 1,
		});
	});

	it("returns 400 for an invalid update body", async () => {
		const response = await request(testApp)
			.put("/api/job-roles/1")
			.send({ ...createJobRolePayload, statusId: 0 });

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
		expect(mockService.updateJobRole).not.toHaveBeenCalled();
	});

	it("returns 404 when the job role does not exist", async () => {
		mockService.updateJobRole = vi.fn().mockResolvedValue(null);

		const response = await request(testApp)
			.put("/api/job-roles/999")
			.send({ ...createJobRolePayload, statusId: 1 });

		expect(response.status).toBe(404);
		expect(response.body).toEqual({ error: "Job role not found" });
	});
});
