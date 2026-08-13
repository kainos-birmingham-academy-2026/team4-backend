import type { Request, Response } from "express";
import type { JobRoleResponse } from "../dtos/jobRoleDto.js";
import { JobRoleService } from "../services/jobRoleService.js";

export class JobRoleController {
	constructor(
		private readonly jobRoleService: JobRoleService = new JobRoleService(),
	) {}

	async getAllJobRoles(req: Request, res: Response): Promise<void> {
		try {
			const pageParam = req.query.page as string | undefined;
			const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
			const limit = 10;
			const skip = (page - 1) * limit;

			const { jobs, totalCount } =
				await this.jobRoleService.findPaginatedJobRoles(skip, limit);
			const totalPages = Math.ceil(totalCount / limit);
			const hasNext = page < totalPages;
			const hasPrev = page > 1;

			res.status(200).json({
				jobs,
				pagination: {
					currentPage: page,
					totalPages,
					totalCount,
					pageSize: limit,
					hasNext,
					hasPrev,
				},
			});
		} catch (_error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getJobRoleById(req: Request, res: Response): Promise<void> {
		const id = Number(req.params.id);

		try {
			const jobRole = await this.jobRoleService.findJobRoleById(id);
			if (!jobRole) {
				res.status(404).json({ error: "Job role not found" });
				return;
			}
			res.status(200).json(jobRole);
		} catch (_error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}

	// The following methods are placeholders for future implementation
	async create() {}

	async update() {}

	async delete() {}
}
