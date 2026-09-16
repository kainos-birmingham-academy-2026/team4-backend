import type { Request, Response } from "express";
import type {
	JobRoleCreateInput,
	JobRoleDetailedResponse,
	JobRoleQuery,
	JobRoleUpdateInput,
} from "../dtos/jobRoleDto.js";
import { JobRoleService } from "../services/jobRoleService.js";

const csvHeaders = [
	"jobRoleId",
	"roleName",
	"location",
	"capability",
	"band",
	"closingDate",
	"description",
	"responsibilities",
	"sharepointUrl",
	"numberOfOpenPositions",
	"status",
];

const escapeCsvValue = (value: unknown): string => {
	const stringValue =
		value instanceof Date ? value.toISOString() : String(value ?? "");
	return /[",\r\n]/.test(stringValue)
		? `"${stringValue.replace(/"/g, '""')}"`
		: stringValue;
};

const jobRoleToCsvRow = (jobRole: JobRoleDetailedResponse): string[] => [
	escapeCsvValue(jobRole.jobRoleId),
	escapeCsvValue(jobRole.roleName),
	escapeCsvValue(jobRole.location),
	escapeCsvValue(jobRole.capability),
	escapeCsvValue(jobRole.band),
	escapeCsvValue(jobRole.closingDate),
	escapeCsvValue(jobRole.description),
	escapeCsvValue(jobRole.responsibilities.join("; ")),
	escapeCsvValue(jobRole.sharepointUrl),
	escapeCsvValue(jobRole.numberOfOpenPositions),
	escapeCsvValue(jobRole.status),
];

const jobRolesToCsv = (jobRoles: JobRoleDetailedResponse[]): string =>
	`${[csvHeaders, ...jobRoles.map(jobRoleToCsvRow)]
		.map((row) => row.join(","))
		.join("\r\n")}\r\n`;

export class JobRoleController {
	constructor(
		private readonly jobRoleService: JobRoleService = new JobRoleService(),
	) {}

	private sendInternalServerError(res: Response, error: unknown): void {
		const errorMessage = error instanceof Error ? `: ${error.message}` : "";
		res.status(500).json({ error: `Internal server error${errorMessage}` });
	}

	async getAllJobRoles(_req: Request, res: Response): Promise<void> {
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
		} catch (error) {
			this.sendInternalServerError(res, error);
		}
	}

	async exportJobRoles(_req: Request, res: Response): Promise<void> {
		try {
			const jobRoles = await this.jobRoleService.findAllDetailedJobRoles();
			res
				.status(200)
				.setHeader("Content-Type", "text/csv; charset=utf-8")
				.setHeader(
					"Content-Disposition",
					'attachment; filename="job-roles.csv"',
				)
				.send(jobRolesToCsv(jobRoles));
		} catch (error) {
			this.sendInternalServerError(res, error);
		}
	}

	async getFilterOptions(_req: Request, res: Response): Promise<void> {
		try {
			const options = await this.jobRoleService.findFilterOptions();
			res.status(200).json(options);
		} catch (error) {
			this.sendInternalServerError(res, error);
		}
	}

	async getCreateOptions(_req: Request, res: Response): Promise<void> {
		try {
			const options = await this.jobRoleService.findCreateOptions();
			res.status(200).json(options);
		} catch (error) {
			this.sendInternalServerError(res, error);
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
		} catch (error) {
			this.sendInternalServerError(res, error);
		}
	}

	async create(req: Request, res: Response): Promise<void> {
		try {
			const jobRole = await this.jobRoleService.createJobRole(
				req.body as JobRoleCreateInput,
			);
			res.status(201).json(jobRole);
		} catch (error) {
			if (
				error instanceof Error &&
				(error.message === "Capability not found" ||
					error.message === "Band not found" ||
					error.message === "Open status not found")
			) {
				res.status(400).json({ error: error.message });
				return;
			}

			this.sendInternalServerError(res, error);
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		const id = Number(req.params.id);

		try {
			const jobRole = await this.jobRoleService.updateJobRole(
				id,
				req.body as JobRoleUpdateInput,
			);
			if (!jobRole) {
				res.status(404).json({ error: "Job role not found" });
				return;
			}
			res.status(200).json(jobRole);
		} catch (error) {
			if (
				error instanceof Error &&
				(error.message === "Capability not found" ||
					error.message === "Band not found" ||
					error.message === "Status not found")
			) {
				res.status(400).json({ error: error.message });
				return;
			}

			this.sendInternalServerError(res, error);
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		const id = Number(req.params.id);

		try {
			const deleted = await this.jobRoleService.deleteJobRole(id);
			if (!deleted) {
				res.status(404).json({ error: "Job role not found" });
				return;
			}

			res.status(204).send();
		} catch (error) {
			this.sendInternalServerError(res, error);
		}
	}
}
