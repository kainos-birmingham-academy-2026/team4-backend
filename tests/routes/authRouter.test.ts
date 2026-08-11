import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAuthRouter } from "../../src/routes/authRouter";
import type { AuthService } from "../../src/services/authService";
import { AuthError } from "../../src/services/authService";

describe("Auth router", () => {
	const service = {
		login: vi.fn(),
		register: vi.fn(),
	};

	const testApp = express();
	testApp.use(express.json());
	testApp.use("/auth", createAuthRouter(service as unknown as AuthService));

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("POST /auth/login returns 200 for valid payload", async () => {
		service.login.mockResolvedValue("token-login");

		const response = await request(testApp).post("/auth/login").send({
			email: "valid@example.com",
			password: "Strong!Pass1",
		});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ token: "token-login" });
	});

	it("POST /auth/login returns 400 for invalid payload", async () => {
		const response = await request(testApp).post("/auth/login").send({
			email: "not-an-email",
			password: "short",
		});

		expect(response.status).toBe(400);
		expect(Array.isArray(response.body)).toBe(true);
	});

	it("POST /auth/register returns 201 for valid payload", async () => {
		service.register.mockResolvedValue("token-register");

		const response = await request(testApp).post("/auth/register").send({
			email: "new@example.com",
			password: "Strong!Pass1",
		});

		expect(response.status).toBe(201);
		expect(response.body).toEqual({ token: "token-register" });
	});

	it("POST /auth/register maps auth service errors", async () => {
		service.register.mockRejectedValue(
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
