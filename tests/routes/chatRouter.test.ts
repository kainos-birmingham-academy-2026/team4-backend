import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createChatRouter } from "../../src/routes/chatRouter";
import type { ChatService } from "../../src/services/chatService";

const mockChatResponse = {
	message: "Based on your interests, these roles could be a good fit.",
	recommendations: [
		{
			jobRoleId: 1,
			roleName: "Software Engineer",
			location: "Belfast",
			capability: "Engineering",
			band: "Band 2",
			status: "Open",
			whyRecommended: "it matches Engineering capability",
		},
	],
	intent: "search" as const,
	confidence: "high" as const,
};

describe("POST /api/chat", () => {
	const mockChatService = {
		getChatResponse: vi.fn(),
	} as unknown as ChatService;

	const testApp = express();
	testApp.use(express.json());
	testApp.use(express.urlencoded({ extended: true }));
	testApp.use("/api/chat", createChatRouter(mockChatService));

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns 200 and chat recommendations when request is valid", async () => {
		vi.mocked(mockChatService.getChatResponse).mockResolvedValue(
			mockChatResponse,
		);

		const response = await request(testApp)
			.post("/api/chat")
			.send({ message: "I like building apps" });

		expect(response.status).toBe(200);
		expect(response.body).toEqual(mockChatResponse);
		expect(mockChatService.getChatResponse).toHaveBeenCalledWith(
			"I like building apps",
		);
	});

	it("returns 400 when request body is invalid", async () => {
		const response = await request(testApp)
			.post("/api/chat")
			.send({ message: "" });

		expect(response.status).toBe(400);
		expect(response.body.errors?.[0]?.field).toBe("message");
		expect(mockChatService.getChatResponse).not.toHaveBeenCalled();
	});
});
