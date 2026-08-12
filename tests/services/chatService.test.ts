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
		expect(response.recommendations).toEqual([]);
		expect(response.message.toLowerCase()).toContain(
			"did not fully understand",
		);
	});
});
