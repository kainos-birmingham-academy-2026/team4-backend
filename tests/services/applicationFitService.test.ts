import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import prisma from "../../src/prismaClient.js";
import {
	type ApplicationFitClient,
	ApplicationFitService,
	AzureOpenAiFitClient,
} from "../../src/services/applicationFitService.js";
import { ApplicationError } from "../../src/services/applicationService.js";

vi.mock("../../src/prismaClient.js", () => ({
	default: {
		jobRole: { findUnique: vi.fn() },
		application: { update: vi.fn() },
	},
}));

const jobRole = {
	jobRoleId: 1,
	description: "Build web applications.",
	responsibilities: ["Write TypeScript"],
	applications: [
		{
			applicationId: 10,
			message: "I have TypeScript experience.",
			fitStatus: null,
		},
		{
			applicationId: 11,
			message: "Already assessed.",
			fitStatus: "Complete",
		},
	],
};

describe("ApplicationFitService", () => {
	const fitClient: ApplicationFitClient = { assess: vi.fn() };

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("assesses incomplete applications and preserves completed assessments", async () => {
		vi.mocked(prisma.jobRole.findUnique).mockResolvedValue(jobRole as never);
		vi.mocked(fitClient.assess).mockResolvedValue({
			fitScore: 78,
			strengths: ["TypeScript experience"],
			gaps: ["Testing experience is unclear"],
			summary: "Relevant TypeScript evidence is present.",
		});

		const result = await new ApplicationFitService(
			fitClient,
		).assessApplicationsForJobRole(1);

		expect(fitClient.assess).toHaveBeenCalledWith({
			message: "I have TypeScript experience.",
			roleDescription: "Build web applications.",
			responsibilities: ["Write TypeScript"],
		});
		expect(result).toMatchObject({
			processed: 1,
			completed: 1,
			skippedComplete: 1,
		});
		expect(prisma.application.update).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { applicationId: 10 },
				data: expect.objectContaining({
					fitScore: 78,
					fitStatus: "Complete",
				}),
			}),
		);
	});

	it("stores an unavailable state when the model request fails", async () => {
		vi.mocked(prisma.jobRole.findUnique).mockResolvedValue({
			...jobRole,
			applications: [jobRole.applications[0]],
		} as never);
		vi.mocked(fitClient.assess).mockRejectedValue(new Error("timeout"));

		const result = await new ApplicationFitService(
			fitClient,
		).assessApplicationsForJobRole(1);

		expect(result).toMatchObject({ unavailable: 1, completed: 0 });
		expect(prisma.application.update).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({
					fitStatus: "Unavailable",
					fitScore: null,
				}),
			}),
		);
	});

	it("throws when the job role does not exist", async () => {
		vi.mocked(prisma.jobRole.findUnique).mockResolvedValue(null);

		await expect(
			new ApplicationFitService(fitClient).assessApplicationsForJobRole(999),
		).rejects.toEqual(new ApplicationError(404, "Job role not found"));
	});

	it("stores a failed state when the model response is invalid", async () => {
		vi.mocked(prisma.jobRole.findUnique).mockResolvedValue({
			...jobRole,
			applications: [jobRole.applications[0]],
		} as never);
		vi.mocked(fitClient.assess).mockResolvedValue({ fitScore: "not a number" });

		const result = await new ApplicationFitService(
			fitClient,
		).assessApplicationsForJobRole(1);

		expect(result).toMatchObject({ failed: 1, completed: 0, unavailable: 0 });
		expect(prisma.application.update).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({ fitStatus: "Failed", fitScore: null }),
			}),
		);
	});
});

describe("AzureOpenAiFitClient", () => {
	const originalEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
	const originalApiKey = process.env.AZURE_OPENAI_API_KEY;

	beforeEach(() => {
		process.env.AZURE_OPENAI_ENDPOINT = "https://example.openai.azure.com/";
		process.env.AZURE_OPENAI_API_KEY = "test-key";
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		if (originalEndpoint === undefined)
			delete process.env.AZURE_OPENAI_ENDPOINT;
		else process.env.AZURE_OPENAI_ENDPOINT = originalEndpoint;
		if (originalApiKey === undefined) delete process.env.AZURE_OPENAI_API_KEY;
		else process.env.AZURE_OPENAI_API_KEY = originalApiKey;
	});

	it("rejects when Azure OpenAI configuration is unavailable", async () => {
		delete process.env.AZURE_OPENAI_ENDPOINT;

		await expect(
			new AzureOpenAiFitClient().assess({
				message: "message",
				roleDescription: "role",
				responsibilities: [],
			}),
		).rejects.toThrow("Azure OpenAI configuration is unavailable");
	});

	it("returns output_text from a successful response", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(JSON.stringify({ output_text: '{"fitScore":80}' }), {
					status: 200,
				}),
			),
		);

		await expect(
			new AzureOpenAiFitClient().assess({
				message: "message",
				roleDescription: "role",
				responsibilities: [],
			}),
		).resolves.toEqual({ fitScore: 80 });
	});

	it("uses nested output content when output_text is absent", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						output: [{ content: [{ text: '{"fitScore":60}' }] }],
					}),
					{ status: 200 },
				),
			),
		);

		await expect(
			new AzureOpenAiFitClient().assess({
				message: "message",
				roleDescription: "role",
				responsibilities: [],
			}),
		).resolves.toEqual({ fitScore: 60 });
	});

	it("rejects unsuccessful responses and responses without content", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValueOnce(new Response(null, { status: 503 })),
		);
		await expect(
			new AzureOpenAiFitClient().assess({
				message: "message",
				roleDescription: "role",
				responsibilities: [],
			}),
		).rejects.toThrow("Azure OpenAI returned 503");

		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValueOnce(
					new Response(JSON.stringify({ output: [] }), { status: 200 }),
				),
		);
		await expect(
			new AzureOpenAiFitClient().assess({
				message: "message",
				roleDescription: "role",
				responsibilities: [],
			}),
		).rejects.toThrow("Azure OpenAI returned no assessment content");
	});
});
