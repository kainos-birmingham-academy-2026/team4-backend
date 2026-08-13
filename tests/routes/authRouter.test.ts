import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAuthRouter } from "../../src/routes/authRouter";
import { AuthError } from "../../src/services/authService";

const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockAuthService = {
	login: mockLogin,
	register: mockRegister,
};

const mockBody = {
	email: "test@example.com",
	password: "Password321!",
};

const mockInvalidBody = {
	email: "invalid-email",
	password: "short",
};

const testApp = express();
testApp.use(express.json());
testApp.use(express.urlencoded({ extended: true }));
testApp.use("/auth", createAuthRouter(mockAuthService));

describe("POST /auth/login", async () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return a token with status 200 when login is successful", async () => {
		mockAuthService.login = mockLogin.mockResolvedValue("mockToken");
		const response = await request(testApp).post("/auth/login").send(mockBody);

		expect(response.status).toBe(200);
		expect(mockLogin).toHaveBeenCalledWith(mockBody);
		expect(response.body).toEqual({ token: "mockToken" });
	});

	it("should return status 401 when login fails due to invalid credentials", async () => {
		mockAuthService.login = mockLogin.mockRejectedValue(
			new AuthError(401, "Invalid email or password"),
		);

		const response = await request(testApp).post("/auth/login").send(mockBody);

		expect(response.status).toBe(401);
		expect(mockLogin).toHaveBeenCalledWith(mockBody);
		expect(response.body).toEqual({ error: "Invalid email or password" });
	});

	it("should return status 500 when an unexpected error occurs", async () => {
		mockAuthService.login = mockLogin.mockRejectedValue(
			new Error("Internal server error"),
		);

		const response = await request(testApp).post("/auth/login").send(mockBody);

		expect(response.status).toBe(500);
		expect(mockLogin).toHaveBeenCalledWith(mockBody);
		expect(response.body).toEqual({ error: "Internal server error" });
	});

	it("should return status 400 when login fails due to an invalid request body", async () => {
		const response = await request(testApp)
			.post("/auth/login")
			.send(mockInvalidBody);

		expect(response.status).toBe(400);
		expect(mockLogin).not.toHaveBeenCalled();
		expect(response.body.errors).toBeDefined();
	});
});

describe("POST /auth/register", async () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return a token with status 201 when registration is successful", async () => {
		mockAuthService.register = mockRegister.mockResolvedValue("mockToken");

		const response = await request(testApp)
			.post("/auth/register")
			.send(mockBody);

		expect(response.status).toBe(201);
		expect(mockRegister).toHaveBeenCalledWith(mockBody);
		expect(response.body).toEqual({ token: "mockToken" });
	});

	it("should return status 400 when registration fails due to an invalid request body", async () => {
		const response = await request(testApp)
			.post("/auth/register")
			.send(mockInvalidBody);

		expect(response.status).toBe(400);
		expect(mockRegister).not.toHaveBeenCalled();
		expect(response.body.errors).toBeDefined();
	});

	it("should return status 201 when given a valid payload", async () => {
		mockAuthService.register = mockRegister.mockResolvedValue("token-register");

		const response = await request(testApp).post("/auth/register").send({
			email: "new@example.com",
			password: "Strong!Pass1",
		});

		expect(response.status).toBe(201);
		expect(response.body).toEqual({ token: "token-register" });
	});

	it("should map auth service errors on registration", async () => {
		mockAuthService.register = mockRegister.mockRejectedValue(
			new AuthError(400, "User already exists"),
		);

		const response = await request(testApp).post("/auth/register").send({
			email: "existing@example.com",
			password: "Strong!Pass1",
		});

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: "User already exists" });
	});
});
