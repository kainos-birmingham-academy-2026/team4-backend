import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireAuth } from "../../src/middlewares/requireAuth";

describe("requireAuth", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubEnv("JWT_SECRET", "test-secret");
	});

	it("returns 401 when Authorization header is missing", () => {
		const req = {
			header: vi.fn().mockReturnValue(undefined),
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
			locals: {},
		} as unknown as Response;
		const next = vi.fn();

		requireAuth(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
		expect(next).not.toHaveBeenCalled();
	});

	it("calls next when token is valid", () => {
		const token = jwt.sign(
			{ userId: 1, email: "test@example.com" },
			"test-secret",
		);

		const req = {
			header: vi.fn().mockReturnValue(`Bearer ${token}`),
		} as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
			locals: {},
		} as unknown as Response;
		const next = vi.fn();

		requireAuth(req, res, next);

		expect(next).toHaveBeenCalledOnce();
		expect(res.locals.authUser).toEqual({
			userId: 1,
			email: "test@example.com",
		});
	});
});
