import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobRoleController } from "../../src/controllers/jobRoleController";
import type { JobRoleService } from "../../src/services/jobRoleService";
import { mockJobRole1, mockJobRoles } from "../mockJobRoles";

const mockRequest = {
	params: {},
	query: {},
	body: {},
} as unknown as Request;

const mockResponse = {
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as Response;

const mockJobRoleService = {
	findAllJobRoles: vi.fn(),
	findJobRoleById: vi.fn(),
} as unknown as JobRoleService;

describe("JobRoleController - getAllJobRoles", async () => {
	let jobRoleController: JobRoleController;

	beforeEach(() => {
		jobRoleController = new JobRoleController(mockJobRoleService);
		vi.clearAllMocks();
	});

	it("should return all open job roles with status 200", async () => {
		mockJobRoleService.findAllJobRoles = vi
			.fn()
			.mockResolvedValue(mockJobRoles);

		await jobRoleController.getAllJobRoles(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith(mockJobRoles);
	});

	it("should return status 500 when an error occurs", async () => {
		mockJobRoleService.findAllJobRoles = vi
			.fn()
			.mockRejectedValue(new Error("Service error"));

		await jobRoleController.getAllJobRoles(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Internal server error",
		});
	});
});

describe("JobRoleController - getJobRoleById", async () => {
	let jobRoleController: JobRoleController;

	beforeEach(() => {
		jobRoleController = new JobRoleController(mockJobRoleService);
		vi.clearAllMocks();
	});

	it("should return the job role with status 200 when found", async () => {
		const jobRoleId = 1;
		mockRequest.params.id = jobRoleId.toString();
		mockJobRoleService.findJobRoleById = vi
			.fn()
			.mockResolvedValue(mockJobRole1);

		await jobRoleController.getJobRoleById(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith(mockJobRole1);
	});

	it("should return status 404 when the job role is not found", async () => {
		mockJobRoleService.findJobRoleById = vi.fn().mockResolvedValue(null);

		await jobRoleController.getJobRoleById(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(404);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Job role not found",
		});
	});

	it("should return status 500 when the service throws", async () => {
		mockJobRoleService.findJobRoleById = vi
			.fn()
			.mockRejectedValue(new Error("Service error"));

		await jobRoleController.getJobRoleById(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Internal server error",
		});
	});
});
