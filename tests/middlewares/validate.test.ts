import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
	formatZodError,
	validateBody,
	validateParams,
} from "../../src/middlewares/validate";

type MockResponse = Pick<Response, "status" | "json">;

describe("validate middleware", () => {
	it("formats zod errors into field/message objects", () => {
		const schema = z.object({ id: z.coerce.number().int().positive() });
		const parsed = schema.safeParse({ id: "abc" });

		expect(parsed.success).toBe(false);
		if (!parsed.success) {
			expect(formatZodError(parsed.error)).toEqual([
				{
					field: "id",
					message: "Invalid input: expected number, received NaN",
				},
			]);
		}
	});

	it("validateParams calls next for valid params", () => {
		const schema = z.object({ id: z.coerce.number().int().positive() });
		const middleware = validateParams(schema);
		const req = { params: { id: "7" } } as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as MockResponse;
		const next = vi.fn();

		middleware(req, res, next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(res.status).not.toHaveBeenCalled();
	});

	it("validateParams returns 400 for invalid params", () => {
		const schema = z.object({ id: z.coerce.number().int().positive() });
		const middleware = validateParams(schema);
		const req = { params: { id: "0" } } as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as MockResponse;
		const next = vi.fn();

		middleware(req, res, next);

		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalled();
	});

	it("validateBody rewrites req.body with parsed data", () => {
		const schema = z.object({ count: z.coerce.number().int() });
		const middleware = validateBody(schema);
		const req = { body: { count: "5" } } as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as MockResponse;
		const next = vi.fn();

		middleware(req, res, next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(req.body).toEqual({ count: 5 });
	});

	it("validateBody returns 400 for invalid body", () => {
		const schema = z.object({ email: z.email() });
		const middleware = validateBody(schema);
		const req = { body: { email: "not-an-email" } } as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as MockResponse;
		const next = vi.fn();

		middleware(req, res, next);

		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalled();
	});
});
