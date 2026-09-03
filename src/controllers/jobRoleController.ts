import type { Request, Response } from "express";
import type { JobRoleQuery } from "../dtos/jobRoleDto.js";
import { JobRoleService } from "../services/jobRoleService.js";

export class JobRoleController {
	constructor(
		private readonly jobRoleService: JobRoleService = new JobRoleService(),
	) {}

	async getAllJobRoles(req: Request, res: Response): Promise<void> {
		try {
			const { page, sortBy, sortOrder, ...filters } = (res.locals
				.validatedQuery ?? {
				page: 1,
			}) as JobRoleQuery;
			const limit = 10;
			const skip = (page - 1) * limit;

			const { jobs, totalCount } =
				await this.jobRoleService.findPaginatedJobRoles(skip, limit, filters, {
					sortBy,
					sortOrder,
				});
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

	async getFilterOptions(req: Request, res: Response): Promise<void> {
		try {
			const options = await this.jobRoleService.findFilterOptions();
			res.status(200).json(options);
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
