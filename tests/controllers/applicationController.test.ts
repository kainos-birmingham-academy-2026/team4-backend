import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApplicationController } from "../../src/controllers/applicationController";
import {
	ApplicationError,
	type ApplicationService,
} from "../../src/services/applicationService";

const mockRequest = {
	body: { jobRoleId: 1 },
} as unknown as Request;

const mockResponse = {
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
	locals: {} as Record<string, unknown>,
} as unknown as Response;

const mockApplicationService = {
	createApplication: vi.fn(),
	findApplicationsByUserId: vi.fn(),
	findApplicationsByJobRoleId: vi.fn(),
	updateApplicationStatus: vi.fn(),
} as unknown as ApplicationService;

describe("ApplicationController - createApplication", () => {
	let controller: ApplicationController;

	beforeEach(() => {
		controller = new ApplicationController(mockApplicationService);
		vi.clearAllMocks();
		mockResponse.locals = {
			authUser: { userId: 5, email: "user@example.com", role: "USER" },
		};
		mockRequest.body = {
			jobRoleId: 1,
			message: "I am interested in this role.",
		};
	});

	it("returns 201 with the created application", async () => {
		const created = {
			applicationId: 10,
			userId: 5,
			jobRoleId: 1,
			status: "In Progress",
			createdAt: new Date("2026-09-03T12:00:00.000Z"),
		};
		mockApplicationService.createApplication = vi
			.fn()
			.mockResolvedValue(created);

		await controller.createApplication(mockRequest, mockResponse);

		expect(mockApplicationService.createApplication).toHaveBeenCalledWith(
			5,
			1,
			"I am interested in this role.",
		);
		expect(mockResponse.status).toHaveBeenCalledWith(201);
		expect(mockResponse.json).toHaveBeenCalledWith(created);
	});

	it("returns 401 when there is no authenticated user", async () => {
		mockResponse.locals = {};

		await controller.createApplication(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(401);
		expect(mockResponse.json).toHaveBeenCalledWith({
			message: "Invalid token",
		});
		expect(mockApplicationService.createApplication).not.toHaveBeenCalled();
	});

	it("returns 403 when an admin tries to apply", async () => {
		mockResponse.locals = {
			authUser: { userId: 1, email: "admin@example.com", role: "ADMIN" },
		};

		await controller.createApplication(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(403);
		expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden" });
		expect(mockApplicationService.createApplication).not.toHaveBeenCalled();
	});

	it("returns the application error status and message", async () => {
		mockApplicationService.createApplication = vi
			.fn()
			.mockRejectedValue(
				new ApplicationError(409, "You have already applied for this job role"),
			);

		await controller.createApplication(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(409);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "You have already applied for this job role",
		});
	});

	it("returns 500 when an unexpected error occurs", async () => {
		mockApplicationService.createApplication = vi
			.fn()
			.mockRejectedValue(new Error("database down"));

		await controller.createApplication(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Internal server error",
		});
	});
});

describe("ApplicationController - getMyApplications", () => {
	let controller: ApplicationController;

	beforeEach(() => {
		controller = new ApplicationController(mockApplicationService);
		vi.clearAllMocks();
		mockResponse.locals = {
			authUser: { userId: 5, email: "user@example.com", role: "USER" },
		};
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
		mockApplicationService.findApplicationsByUserId = vi
			.fn()
			.mockResolvedValue(applications);

		await controller.getMyApplications(mockRequest, mockResponse);

		expect(
			mockApplicationService.findApplicationsByUserId,
		).toHaveBeenCalledWith(5);
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({ applications });
	});

	it("returns 401 when there is no authenticated user", async () => {
		mockResponse.locals = {};

		await controller.getMyApplications(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(401);
		expect(
			mockApplicationService.findApplicationsByUserId,
		).not.toHaveBeenCalled();
	});
});

describe("ApplicationController - assessment", () => {
	let controller: ApplicationController;

	beforeEach(() => {
		controller = new ApplicationController(mockApplicationService);
		vi.clearAllMocks();
		mockRequest.params = { jobRoleId: "1", applicationId: "10" };
	});

	it("returns applications for a job role", async () => {
		const applications = [{ applicationId: 10, status: "In Progress" }];
		mockApplicationService.findApplicationsByJobRoleId = vi
			.fn()
			.mockResolvedValue(applications);

		await controller.getApplicationsByJobRole(mockRequest, mockResponse);

		expect(
			mockApplicationService.findApplicationsByJobRoleId,
		).toHaveBeenCalledWith(1);
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({ applications });
	});

	it("maps the hire action to the Hired status", async () => {
		const hired = { applicationId: 10, status: "Hired" };
		mockRequest.params = { applicationId: "10", action: "hire" };
		mockApplicationService.updateApplicationStatus = vi
			.fn()
			.mockResolvedValue(hired);

		await controller.assessApplication(mockRequest, mockResponse);

		expect(mockApplicationService.updateApplicationStatus).toHaveBeenCalledWith(
			10,
			"Hired",
		);
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith(hired);
	});

	it("maps the reject action to the Rejected status", async () => {
		const rejected = { applicationId: 10, status: "Rejected" };
		mockRequest.params = { applicationId: "10", action: "reject" };
		mockApplicationService.updateApplicationStatus = vi
			.fn()
			.mockResolvedValue(rejected);

		await controller.assessApplication(mockRequest, mockResponse);

		expect(mockApplicationService.updateApplicationStatus).toHaveBeenCalledWith(
			10,
			"Rejected",
		);
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith(rejected);
	});
});
