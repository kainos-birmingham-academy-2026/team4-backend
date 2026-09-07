import type { Request, Response } from "express";
import type { CreateApplicationRequest } from "../dtos/applicationDto.js";
import {
	ApplicationError,
	ApplicationService,
} from "../services/applicationService.js";

export class ApplicationController {
	constructor(
		private readonly applicationService: ApplicationService = new ApplicationService(),
	) {}

	async createApplication(req: Request, res: Response): Promise<void> {
		const { jobRoleId, message } = req.body as CreateApplicationRequest;
		const authUser = res.locals.authUser as
			| { userId?: number; role?: string }
			| undefined;

		if (typeof authUser?.userId !== "number") {
			res.status(401).json({ message: "Invalid token" });
			return;
		}

		if (authUser.role === "ADMIN") {
			res.status(403).json({ message: "Forbidden" });
			return;
		}

		const userId = authUser.userId;

		try {
			const application = await this.applicationService.createApplication(
				userId,
				jobRoleId,
				message,
			);
			res.status(201).json(application);
		} catch (error) {
			if (error instanceof ApplicationError) {
				res.status(error.statusCode).json({ error: error.message });
				return;
			}
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getMyApplications(_req: Request, res: Response): Promise<void> {
		const authUser = res.locals.authUser as { userId?: number } | undefined;

		if (typeof authUser?.userId !== "number") {
			res.status(401).json({ message: "Invalid token" });
			return;
		}

		try {
			const applications =
				await this.applicationService.findApplicationsByUserId(authUser.userId);
			res.status(200).json({ applications });
		} catch (_error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}
}
