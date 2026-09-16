import { z } from "zod";

export const CreateApplicationSchema = z.object({
	jobRoleId: z.coerce.number().int().positive("ID must be a positive integer"),
	message: z.string().trim().min(1, "Message is required"),
});

export type CreateApplicationRequest = z.infer<typeof CreateApplicationSchema>;

export const FitAssessmentSchema = z.object({
	fitScore: z.number().int().min(0).max(100),
	strengths: z.array(z.string().trim().min(1).max(300)).max(8),
	gaps: z.array(z.string().trim().min(1).max(300)).max(8),
	summary: z.string().trim().min(1).max(1_000),
});

export type FitAssessment = z.infer<typeof FitAssessmentSchema>;
export type FitAssessmentStatus = "Complete" | "Unavailable" | "Failed";

export class BulkFitAssessmentResponse {
	constructor(
		public readonly processed: number,
		public readonly completed: number,
		public readonly unavailable: number,
		public readonly failed: number,
		public readonly skippedComplete: number,
	) {}
}

export class ApplicationResponse {
	constructor(
		public readonly applicationId: number,
		public readonly userId: number,
		public readonly jobRoleId: number,
		public readonly roleName: string,
		public readonly status: string,
		public readonly createdAt: Date,
	) {}
}

export class ApplicationAssessmentResponse {
	constructor(
		public readonly applicationId: number,
		public readonly userId: number,
		public readonly applicantEmail: string,
		public readonly jobRoleId: number,
		public readonly message: string,
		public readonly status: string,
		public readonly createdAt: Date,
		public readonly fitScore: number | null = null,
		public readonly fitSummary: string | null = null,
		public readonly fitStrengths: string[] = [],
		public readonly fitGaps: string[] = [],
		public readonly fitStatus: FitAssessmentStatus | null = null,
		public readonly fitAssessedAt: Date | null = null,
		public readonly fitModel: string | null = null,
		public readonly fitPromptVersion: string | null = null,
	) {}
}
