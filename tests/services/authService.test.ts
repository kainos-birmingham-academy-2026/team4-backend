import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("argon2", () => ({
	default: {
		hash: vi.fn(),
		verify: vi.fn(),
	},
}));

vi.mock("jsonwebtoken", () => ({
	default: {
		sign: vi.fn(),
	},
}));

vi.mock("../../src/prismaClient", () => ({
	default: {
		user: {
			findUnique: vi.fn(),
			upsert: vi.fn(),
		},
	},
}));

import argon2 from "argon2";
import jwt from "jsonwebtoken";
import prisma from "../../src/prismaClient";
import { AuthError, AuthService } from "../../src/services/authService";

describe("AuthService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.JWT_SECRET = "test-secret";
	});

	it("register throws when user already exists", async () => {
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue({ id: 1 });
		const service = new AuthService();

		await expect(
			service.register({ email: "user@example.com", password: "Strong!Pass1" }),
		).rejects.toBeInstanceOf(AuthError);
	});

	it("register throws when JWT secret is missing", async () => {
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue(null);
		vi.mocked(argon2).hash = vi.fn().mockResolvedValue("hashed-password");
		vi.mocked(prisma).user.upsert = vi.fn().mockResolvedValue({
			id: 2,
			email: "new@example.com",
		});
		delete process.env.JWT_SECRET;

		const service = new AuthService();

		await expect(
			service.register({ email: "new@example.com", password: "Strong!Pass1" }),
		).rejects.toThrow("JWT_SECRET has not been configured");
	});

	it("register returns token for valid input", async () => {
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue(null);
		vi.mocked(argon2).hash = vi.fn().mockResolvedValue("hashed-password");
		vi.mocked(prisma).user.upsert = vi.fn().mockResolvedValue({
			id: 2,
			email: "new@example.com",
		});
		vi.mocked(jwt).sign = vi.fn().mockReturnValue("signed-token" as never);

		const service = new AuthService();
		const token = await service.register({
			email: "new@example.com",
			password: "Strong!Pass1",
		});

		expect(token).toBe("signed-token");
		expect(argon2.hash).toHaveBeenCalledWith("Strong!Pass1");
		expect(jwt.sign).toHaveBeenCalled();
	});

	it("login throws for unknown user", async () => {
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue(null);
		const service = new AuthService();

		await expect(
			service.login({ email: "missing@example.com", password: "Strong!Pass1" }),
		).rejects.toBeInstanceOf(AuthError);
	});

	it("login throws for invalid password", async () => {
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue({
			id: 4,
			email: "existing@example.com",
			passwordHash: "hash",
		});
		vi.mocked(argon2).verify = vi.fn().mockResolvedValue(false);
		const service = new AuthService();

		await expect(
			service.login({ email: "existing@example.com", password: "Wrong!Pass1" }),
		).rejects.toBeInstanceOf(AuthError);
	});

	it("login throws when JWT secret is missing", async () => {
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue({
			id: 4,
			email: "existing@example.com",
			passwordHash: "hash",
		});
		vi.mocked(argon2).verify = vi.fn().mockResolvedValue(true);
		delete process.env.JWT_SECRET;
		const service = new AuthService();

		await expect(
			service.login({
				email: "existing@example.com",
				password: "Strong!Pass1",
			}),
		).rejects.toThrow("JWT_SECRET has not been configured");
	});

	it("login returns token when credentials are valid", async () => {
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue({
			id: 4,
			email: "existing@example.com",
			passwordHash: "hash",
		});
		vi.mocked(argon2).verify = vi.fn().mockResolvedValue(true);
		vi.mocked(jwt).sign = vi.fn().mockReturnValue("signed-token" as never);

		const service = new AuthService();
		const token = await service.login({
			email: "existing@example.com",
			password: "Strong!Pass1",
		});

		expect(token).toBe("signed-token");
		expect(argon2.verify).toHaveBeenCalledWith("hash", "Strong!Pass1");
		expect(jwt.sign).toHaveBeenCalled();
	});
});
