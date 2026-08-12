import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthController } from "../../src/controllers/authController";
import type { AuthService } from "../../src/services/authService";
import { AuthError } from "../../src/services/authService";

const mockResponse = {
	status: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as Response;

describe("AuthController", () => {
	const service = {
		login: vi.fn(),
		register: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns 200 with token for login", async () => {
		service.login.mockResolvedValue("token-1");
		const controller = new AuthController(service as unknown as AuthService);
		const req = {
			body: { email: "u@example.com", password: "Strong!Pass1" },
		} as Request;

		await controller.login(req, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({ token: "token-1" });
	});

	it("returns auth status for login auth errors", async () => {
		service.login.mockRejectedValue(
			new AuthError(401, "Invalid email or password"),
		);
		const controller = new AuthController(service as unknown as AuthService);
		const req = {
			body: { email: "u@example.com", password: "Strong!Pass1" },
		} as Request;

		await controller.login(req, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(401);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Invalid email or password",
		});
	});

	it("returns 500 for login unexpected errors", async () => {
		service.login.mockRejectedValue(new Error("unexpected"));
		const controller = new AuthController(service as unknown as AuthService);
		const req = {
			body: { email: "u@example.com", password: "Strong!Pass1" },
		} as Request;

		await controller.login(req, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			error: "Internal server error",
		});
	});

	it("returns 201 with token for register", async () => {
		service.register.mockResolvedValue("token-2");
		const controller = new AuthController(service as unknown as AuthService);
		const req = {
			body: { email: "new@example.com", password: "Strong!Pass1" },
		} as Request;

		await controller.register(req, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(201);
		expect(mockResponse.json).toHaveBeenCalledWith({ token: "token-2" });
	});
});
