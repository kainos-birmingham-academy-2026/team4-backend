import type { Request, Response } from "express";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
	formatZodError,
	validateBody,
	validateParams,
} from "../../src/middlewares/validate";

beforeAll(() => {
	vi.clearAllMocks();
});

describe("validate.ts - formatZodError", () => {
	it("formats zod errors into field/message objects", () => {
		const schema = z.object({ id: z.coerce.number().int().positive() });
		const parsed = schema.safeParse({ id: "abc" });

		expect(parsed.success).toBe(false);
		if (!parsed.success) {
			expect(formatZodError(parsed.error)).toEqual({
				errors: [
					{
						field: "id",
						message: "Invalid input: expected number, received NaN",
					},
				],
			});
		}
	});
});

describe("validate.ts - validateParams", () => {
	it("accepts positive integers as parameters", () => {
		const schema = z.object({ id: z.coerce.number().int().positive() });
		const middleware = validateParams(schema);
		const req = { params: { id: "7" } } as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;
		const next = vi.fn();

		middleware(req, res, next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(res.status).not.toHaveBeenCalled();
	});

	it("returns 400 for invalid parameters", () => {
		const schema = z.object({ id: z.coerce.number().int().positive() });
		const middleware = validateParams(schema);
		const req = { params: { id: "0" } } as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;
		const next = vi.fn();

		middleware(req, res, next);

		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalled();
	});
});

describe("validate.ts - validateBody", () => {
	it("accepts valid request bodies", () => {
		const schema = z.object({ email: z.email() });
		const middleware = validateBody(schema);
		const req = { body: { email: "test@example.com" } } as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;
		const next = vi.fn();

		middleware(req, res, next);

		expect(next).toHaveBeenCalledTimes(1);
		expect(res.status).not.toHaveBeenCalled();
		expect(req.body).toEqual({ email: "test@example.com" });
	});

	it("returns 400 for invalid request bodies", () => {
		const schema = z.object({ email: z.email() });
		const middleware = validateBody(schema);
		const req = { body: { email: "not-an-email" } } as unknown as Request;
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		} as unknown as Response;
		const next = vi.fn();

		middleware(req, res, next);

		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalled();
	});
});
