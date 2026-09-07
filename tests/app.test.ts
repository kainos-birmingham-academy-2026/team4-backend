import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

const authRouter = express.Router();
authRouter.get("/health", (_req, res) => {
	res.status(200).json({ scope: "auth" });
});

const jobRoleRouter = express.Router();
jobRoleRouter.get("/health", (_req, res) => {
	res.status(200).json({ scope: "jobs" });
});

const applicationRouter = express.Router();
applicationRouter.get("/health", (_req, res) => {
	res.status(200).json({ scope: "applications" });
});

vi.mock("../src/routes/authRouter", () => ({
	default: authRouter,
}));

vi.mock("../src/routes/jobRoleRouter", () => ({
	default: jobRoleRouter,
}));

vi.mock("../src/routes/applicationRouter", () => ({
	default: applicationRouter,
}));

describe("app wiring", () => {
	it("mounts job role, application, and auth routers", async () => {
		const { app } = await import("../src/app");

		const jobsResponse = await request(app).get("/api/job-roles/health");
		expect(jobsResponse.status).toBe(200);
		expect(jobsResponse.body).toEqual({ scope: "jobs" });

		const applicationsResponse = await request(app).get(
			"/api/applications/health",
		);
		expect(applicationsResponse.status).toBe(200);
		expect(applicationsResponse.body).toEqual({ scope: "applications" });

		const authResponse = await request(app).get("/auth/health");
		expect(authResponse.status).toBe(200);
		expect(authResponse.body).toEqual({ scope: "auth" });
	});
});
