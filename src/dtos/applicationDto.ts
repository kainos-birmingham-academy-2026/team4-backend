import { z } from "zod";

export const CreateApplicationSchema = z.object({
	jobRoleId: z.coerce.number().int().positive("ID must be a positive integer"),
	message: z.string().trim().min(1, "Message is required"),
});

export type CreateApplicationRequest = z.infer<typeof CreateApplicationSchema>;

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
	) {}
}
