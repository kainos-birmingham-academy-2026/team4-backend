import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthController } from "../../src/controllers/authController";
import { AuthError, type AuthService } from "../../src/services/authService";

const mockRequest = {
	params: {},
	query: {},
	body: {},
} as unknown as Request;

const mockResponse = {
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as Response;

const mockAuthService = {
	login: vi.fn(),
	register: vi.fn(),
} as unknown as AuthService;

describe("AuthController - login", async () => {
	let authController: AuthController;

	beforeEach(() => {
		authController = new AuthController(mockAuthService);
		vi.clearAllMocks();
	});

	it("should return a token with status 200 when login is successful", async () => {
		mockAuthService.login = vi.fn().mockResolvedValue("mockToken");

		await authController.login(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({ token: "mockToken" });
	});

	it("should return status 401 when login fails due to invalid credentials", async () => {
		mockAuthService.login = vi
			.fn()
			.mockRejectedValue(new AuthError(401, "Invalid email or password"));

		await authController.login(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(401);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Invalid email or password",
		});
	});

	it("should return status 500 when an unexpected error occurs", async () => {
		mockAuthService.login = vi
			.fn()
			.mockRejectedValue(new Error("Unexpected error"));

		await authController.login(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Internal server error",
		});
	});
});

describe("AuthController - register", async () => {
	let authController: AuthController;

	beforeEach(() => {
		authController = new AuthController(mockAuthService);
		vi.clearAllMocks();
	});

	it("should return a token with status 201 when registration is successful", async () => {
		mockAuthService.register = vi.fn().mockResolvedValue("mockToken");

		await authController.register(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(201);
		expect(mockResponse.json).toHaveBeenCalledWith({ token: "mockToken" });
	});

	it("should return status 400 when registration fails due to user already existing", async () => {
		mockAuthService.register = vi
			.fn()
			.mockRejectedValue(new AuthError(400, "User already exists"));

		await authController.register(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "User already exists",
		});
	});

	it("should return status 500 when an unexpected error occurs", async () => {
		mockAuthService.register = vi
			.fn()
			.mockRejectedValue(new Error("Unexpected error"));

		await authController.register(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Internal server error",
		});
	});
});
