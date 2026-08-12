import { z } from "zod";

export const ChatRequestSchema = z.object({
	message: z.string().trim().min(1).max(280),
});

export interface ChatRecommendation {
	jobRoleId?: number;
	roleName?: string;
	location?: string;
	capability?: string;
	band?: string;
	status?: string;
	whyRecommended?: string;
	url?: string;
}

export interface ChatResponseDto {
	message: string;
	recommendations: ChatRecommendation[];
	intent: "search" | "recommend" | "clarify" | "explain";
	confidence: "high" | "medium";
}

export type ChatRequestDto = z.infer<typeof ChatRequestSchema>;
