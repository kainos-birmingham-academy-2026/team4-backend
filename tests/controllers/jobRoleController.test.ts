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
	locals: {} as Record<string, unknown>,
} as unknown as Response;

const mockJobRoleService = {
	findAllJobRoles: vi.fn(),
	findJobRoleById: vi.fn(),
	findPaginatedJobRoles: vi.fn(),
} as unknown as JobRoleService;

describe("JobRoleController - getAllJobRoles", async () => {
	let jobRoleController: JobRoleController;

	beforeEach(() => {
		jobRoleController = new JobRoleController(mockJobRoleService);
		vi.clearAllMocks();
		mockResponse.locals.validatedQuery = { page: 1 };
	});

	it("should return paginated job roles with default page 1 and status 200", async () => {
		const mockPaginatedResponse = {
			jobs: mockJobRoles,
			totalCount: 25,
		};
		mockJobRoleService.findPaginatedJobRoles = vi
			.fn()
			.mockResolvedValue(mockPaginatedResponse);

		await jobRoleController.getAllJobRoles(mockRequest, mockResponse);

		expect(mockJobRoleService.findPaginatedJobRoles).toHaveBeenCalledWith(
			0,
			10,
			{},
			{ sortBy: undefined, sortOrder: undefined },
		);
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({
			jobs: mockJobRoles,
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

	it("should return paginated job roles for a specific page", async () => {
		mockResponse.locals.validatedQuery = { page: 2 };
		const mockPaginatedResponse = {
			jobs: [mockJobRoles[0]],
			totalCount: 25,
		};
		mockJobRoleService.findPaginatedJobRoles = vi
			.fn()
			.mockResolvedValue(mockPaginatedResponse);

		await jobRoleController.getAllJobRoles(mockRequest, mockResponse);

		expect(mockJobRoleService.findPaginatedJobRoles).toHaveBeenCalledWith(
			10,
			10,
			{},
			{ sortBy: undefined, sortOrder: undefined },
		);
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({
			jobs: [mockJobRoles[0]],
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

	it("should return status 500 when an error occurs", async () => {
		mockJobRoleService.findPaginatedJobRoles = vi
			.fn()
			.mockRejectedValue(new Error("Service error"));

		await jobRoleController.getAllJobRoles(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Internal server error",
		});
	});

	it("should forward the validated filters to the service", async () => {
		mockResponse.locals.validatedQuery = {
			page: 1,
			roleName: "engineer",
			capability: ["Engineering", "Data"],
			status: ["Open"],
		};
		mockJobRoleService.findPaginatedJobRoles = vi.fn().mockResolvedValue({
			jobs: [],
			totalCount: 0,
		});

		await jobRoleController.getAllJobRoles(mockRequest, mockResponse);

		expect(mockJobRoleService.findPaginatedJobRoles).toHaveBeenCalledWith(
			0,
			10,
			{
				roleName: "engineer",
				capability: ["Engineering", "Data"],
				status: ["Open"],
			},
			{ sortBy: undefined, sortOrder: undefined },
		);
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({
			jobs: [],
			pagination: {
				currentPage: 1,
				totalPages: 0,
				totalCount: 0,
				pageSize: 10,
				hasNext: false,
				hasPrev: false,
			},
		});
	});

	it("should forward ordering separately from filters", async () => {
		mockResponse.locals.validatedQuery = {
			page: 1,
			roleName: "engineer",
			sortBy: "roleName",
			sortOrder: "desc",
		};
		mockJobRoleService.findPaginatedJobRoles = vi.fn().mockResolvedValue({
			jobs: [],
			totalCount: 0,
		});

		await jobRoleController.getAllJobRoles(mockRequest, mockResponse);

		expect(mockJobRoleService.findPaginatedJobRoles).toHaveBeenCalledWith(
			0,
			10,
			{ roleName: "engineer" },
			{ sortBy: "roleName", sortOrder: "desc" },
		);
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

describe("JobRoleController - update", () => {
	let jobRoleController: JobRoleController;
	const updateInput = {
		roleName: "Senior Software Engineer",
		statusId: 2,
	};

	beforeEach(() => {
		jobRoleController = new JobRoleController(mockJobRoleService);
		vi.clearAllMocks();
		mockRequest.params.id = "1";
		mockRequest.body = updateInput;
	});

	it("returns the updated role with status 200", async () => {
		mockJobRoleService.updateJobRole = vi.fn().mockResolvedValue(mockJobRole1);

		await jobRoleController.update(mockRequest, mockResponse);

		expect(mockJobRoleService.updateJobRole).toHaveBeenCalledWith(
			1,
			updateInput,
		);
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith(mockJobRole1);
	});

	it("returns 404 when the role does not exist", async () => {
		mockJobRoleService.updateJobRole = vi.fn().mockResolvedValue(null);

		await jobRoleController.update(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(404);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Job role not found",
		});
	});

	it.each(["Capability not found", "Band not found", "Status not found"])(
		"returns 400 when %s",
		async (message) => {
			mockJobRoleService.updateJobRole = vi
				.fn()
				.mockRejectedValue(new Error(message));

			await jobRoleController.update(mockRequest, mockResponse);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({ error: message });
		},
	);

	it("returns 500 for an unexpected update error", async () => {
		mockJobRoleService.updateJobRole = vi
			.fn()
			.mockRejectedValue(new Error("Database error"));

		await jobRoleController.update(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Internal server error",
		});
	});
});
