import { describe, expect, it, vi } from "vitest";
import { JobRoleResponse } from "../../src/dtos/jobRoleDto";
import { ChatService } from "../../src/services/chatService";

const jobRoles = [
	new JobRoleResponse(
		1,
		"Software Engineer",
		"Belfast",
		"Engineering",
		"Band 2",
		new Date("2026-12-10"),
		"Open",
	),
	new JobRoleResponse(
		2,
		"Data Analyst",
		"London",
		"Data",
		"Band 1",
		new Date("2026-12-10"),
		"Open",
	),
	new JobRoleResponse(
		3,
		"QA Engineer",
		"Manchester",
		"Quality",
		"Band 2",
		new Date("2026-12-10"),
		"Open",
	),
];

describe("ChatService", () => {
	it("explains capability and returns example roles", async () => {
		const mockJobRoleService = {
			findAllJobRoles: vi.fn().mockResolvedValue(jobRoles),
		};
		const chatService = new ChatService(mockJobRoleService);

		const response = await chatService.getChatResponse(
			"what does capability mean?",
		);

		expect(response.intent).toBe("explain");
		expect(response.message.toLowerCase()).toContain("discipline");
		expect(response.recommendations.length).toBeGreaterThan(0);
	});

	it("recommends engineering roles for app-building language", async () => {
		const mockJobRoleService = {
			findAllJobRoles: vi.fn().mockResolvedValue(jobRoles),
		};
		const chatService = new ChatService(mockJobRoleService);

		const response = await chatService.getChatResponse(
			"I like to build apps and websites",
		);

		expect(response.intent).toBe("search");
		expect(response.confidence).toBe("high");
		expect(response.recommendations[0]?.capability).toBe("Engineering");
	});

	it("handles uncertain prompts with starter recommendations", async () => {
		const mockJobRoleService = {
			findAllJobRoles: vi.fn().mockResolvedValue(jobRoles),
		};
		const chatService = new ChatService(mockJobRoleService);

		const response = await chatService.getChatResponse(
			"I am not sure what role suits me",
		);

		expect(response.intent).toBe("recommend");
		expect(response.recommendations.length).toBeGreaterThan(0);
	});

	it("returns clarify response when no roles are available", async () => {
		const mockJobRoleService = {
			findAllJobRoles: vi.fn().mockResolvedValue([]),
		};
		const chatService = new ChatService(mockJobRoleService);

		const response = await chatService.getChatResponse("engineering jobs");

		expect(response.intent).toBe("clarify");
		expect(response.recommendations).toEqual([]);
	});

	it("returns blanket clarify response for unknown intent", async () => {
		const mockJobRoleService = {
			findAllJobRoles: vi.fn().mockResolvedValue(jobRoles),
		};
		const chatService = new ChatService(mockJobRoleService);

		const response = await chatService.getChatResponse("blorple?? maybe stuff");

		expect(response.intent).toBe("clarify");
		expect(response.recommendations.length).toBe(1);
		expect(response.recommendations[0].url).toBe("/job-roles");
		expect(response.message.toLowerCase()).toContain(
			"did not fully understand",
		);
	});

	it("detects capability but has no open roles for that capability", async () => {
		const closedDataRole = new JobRoleResponse(
			4,
			"Data Scientist",
			"London",
			"Data & AI",
			"Band 3",
			new Date("2026-12-10"),
			"Closed",
		);
		const allRoles = [
			new JobRoleResponse(
				1,
				"Software Engineer",
				"Belfast",
				"Engineering",
				"Band 2",
				new Date("2026-12-10"),
				"Open",
			),
		];
		const mockJobRoleService = {
			findAllJobRoles: vi.fn().mockResolvedValue([...allRoles, closedDataRole]),
		};
		const chatService = new ChatService(mockJobRoleService);

		const response = await chatService.getChatResponse("i like data");

		expect(response.intent).toBe("search");
		expect(response.message.toLowerCase()).toContain("unfortunately");
		expect(response.recommendations.length).toBe(1);
		expect(response.recommendations[0].url).toBe("/job-roles");
	});

	it("includes explore all roles button in successful recommendations", async () => {
		const mockJobRoleService = {
			findAllJobRoles: vi.fn().mockResolvedValue(jobRoles),
		};
		const chatService = new ChatService(mockJobRoleService);

		const response = await chatService.getChatResponse("engineering roles");

		expect(response.recommendations.length).toBeGreaterThan(1);
		const lastRecommendation =
			response.recommendations[response.recommendations.length - 1];
		expect(lastRecommendation.url).toBe("/job-roles");
		expect(lastRecommendation.roleName?.toLowerCase()).toContain("browse");
	});

	it("filters by location when mentioned", async () => {
		const mockJobRoleService = {
			findAllJobRoles: vi.fn().mockResolvedValue(jobRoles),
		};
		const chatService = new ChatService(mockJobRoleService);

		const response = await chatService.getChatResponse(
			"engineering roles in belfast",
		);

		expect(response.recommendations.length).toBeGreaterThan(0);
		const belfastRoles = response.recommendations.filter((r) =>
			r.location?.toLowerCase().includes("belfast"),
		);
		expect(belfastRoles.length).toBeGreaterThan(0);
	});
});
