import argon2 from "argon2";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../src/prismaClient";
import { AuthError, AuthService } from "../../src/services/authService";

vi.mock("../../src/prismaClient", () => ({
	default: {
		user: {
			findUnique: vi.fn(),
			upsert: vi.fn(),
		},
	},
}));

vi.mock("argon2", () => ({
	default: {
		hash: vi.fn(),
		verify: vi.fn(),
	},
}));

vi.mock("jsonwebtoken", () => ({
	default: {
		sign: vi.fn().mockReturnValue("testToken"),
	},
}));

const mockUser = {
	id: 1,
	email: "test@example.com",
	password: "Password321!",
};

describe("AuthService - login", () => {
	let authService: AuthService;

	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubEnv("JWT_SECRET", "testSecret");
		authService = new AuthService();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("should return a token when login is successful", async () => {
		vi.mocked(argon2).verify = vi.fn().mockResolvedValue(true);
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue(mockUser);

		const token = await authService.login({
			email: mockUser.email,
			password: mockUser.password,
		});

		expect(token).toBeDefined();
		expect(prisma.user.findUnique).toHaveBeenCalledWith({
			where: { email: mockUser.email },
		});
	});

	it("should throw AuthError with status 401 when user is not found", async () => {
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue(null);

		const result = authService.login({
			email: mockUser.email,
			password: mockUser.password,
		});
		await expect(result).rejects.toThrow(
			new AuthError(401, "Invalid email or password"),
		);
	});

	it("should throw AuthError with status 401 when credentials are invalid", async () => {
		vi.mocked(argon2).verify = vi.fn().mockResolvedValue(false);
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue(mockUser);

		const result = authService.login({
			email: mockUser.email,
			password: "WrongPassword123!",
		});
		await expect(result).rejects.toThrow(
			new AuthError(401, "Invalid email or password"),
		);
	});

	it("should throw an error when JWT_SECRET is not configured", async () => {
		vi.unstubAllEnvs();
		vi.mocked(argon2).verify = vi.fn().mockResolvedValue(true);
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue(mockUser);

		const result = authService.login({
			email: mockUser.email,
			password: mockUser.password,
		});
		await expect(result).rejects.toThrow(
			new Error("JWT_SECRET has not been configured"),
		);
	});
});

describe("AuthService - register", () => {
	let authService: AuthService;

	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubEnv("JWT_SECRET", "testSecret");
		authService = new AuthService();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("should return a token when registration is successful", async () => {
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue(null);
		vi.mocked(argon2).hash = vi.fn().mockResolvedValue("hashedPassword");
		vi.mocked(prisma).user.upsert = vi.fn().mockResolvedValue(mockUser);

		const token = await authService.register({
			email: mockUser.email,
			password: mockUser.password,
		});

		expect(token).toBeDefined();
		expect(prisma.user.findUnique).toHaveBeenCalledWith({
			where: { email: mockUser.email },
		});
	});

	it("should throw AuthError with status 400 when user already exists", async () => {
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue(mockUser);

		const result = authService.register({
			email: mockUser.email,
			password: mockUser.password,
		});
		await expect(result).rejects.toThrow(
			new AuthError(400, "User already exists"),
		);
	});

	it("should throw an error when JWT_SECRET is not configured", async () => {
		vi.unstubAllEnvs();
		vi.mocked(prisma).user.findUnique = vi.fn().mockResolvedValue(null);
		vi.mocked(argon2).hash = vi.fn().mockResolvedValue("hashedPassword");
		vi.mocked(prisma).user.create = vi.fn().mockResolvedValue(mockUser);

		const result = authService.register({
			email: mockUser.email,
			password: mockUser.password,
		});
		await expect(result).rejects.toThrow(
			new Error("JWT_SECRET has not been configured"),
		);
	});
});
