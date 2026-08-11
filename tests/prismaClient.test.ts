import { describe, expect, it } from "vitest";
import prisma from "../src/prismaClient";

describe("prismaClient", () => {
	it("exports a prisma client instance", () => {
		expect(prisma).toBeDefined();
		expect(typeof prisma.$connect).toBe("function");
	});
});
