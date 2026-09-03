import type { JobRole, Prisma } from "@prisma/client";
import type {
	JobRoleDetailedResponse,
	JobRoleFilters,
	JobRoleOrdering,
	JobRoleResponse,
} from "../dtos/jobRoleDto.js";
import { JobRoleMapper } from "../mappers/jobRoleMapper.js";
import prisma from "../prismaClient.js";

export class JobRoleService {
	private readonly jobRoleMapper = new JobRoleMapper();

	private buildWhere(filters: JobRoleFilters): Prisma.JobRoleWhereInput {
		const where: Prisma.JobRoleWhereInput = {};

		if (filters.roleName) {
			where.roleName = { contains: filters.roleName, mode: "insensitive" };
		}
		if (filters.location) {
			where.location = { contains: filters.location, mode: "insensitive" };
		}
		if (filters.capability?.length) {
			where.capability = { capabilityName: { in: filters.capability } };
		}
		if (filters.band?.length) {
			where.band = { bandName: { in: filters.band } };
		}
		if (filters.status?.length) {
			where.status = { statusName: { in: filters.status } };
		}
		if (filters.closingDate) {
			where.closingDate = { lte: filters.closingDate };
		}

		return where;
	}

	private buildOrderBy(
		ordering: JobRoleOrdering,
	): Prisma.JobRoleOrderByWithRelationInput {
		const direction = ordering.sortOrder ?? "asc";

		switch (ordering.sortBy) {
			case "roleName":
			case "location":
			case "closingDate":
				return { [ordering.sortBy]: direction };
			case "capability":
				return { capability: { capabilityName: direction } };
			case "band":
				return { band: { bandName: direction } };
			case "status":
				return { status: { statusName: direction } };
			case "jobRoleId":
				return { jobRoleId: direction };
			default:
				return { jobRoleId: "asc" };
		}
	}

	async findAllJobRoles(): Promise<JobRoleResponse[]> {
		const jobRoles: JobRole[] = await prisma.jobRole.findMany();
		const jobRoleResponses = await Promise.all(
			jobRoles.map((jobRole) =>
				this.jobRoleMapper.mapJobRoleToResponse(jobRole),
			),
		);
		return jobRoleResponses;
	}

	async findJobRoleById(id: number): Promise<JobRoleDetailedResponse | null> {
		const jobRole = await prisma.jobRole.findUnique({
			where: { jobRoleId: id },
		});
		if (!jobRole) {
			return null;
		}
		return this.jobRoleMapper.mapJobRoleToDetailedResponse(jobRole);
	}

	async findPaginatedJobRoles(
		skip: number,
		take: number,
		filters: JobRoleFilters = {},
		ordering: JobRoleOrdering = {},
	): Promise<{ jobs: JobRoleResponse[]; totalCount: number }> {
		const where = this.buildWhere(filters);
		const orderBy = this.buildOrderBy(ordering);

		const jobRoles: JobRole[] = await prisma.jobRole.findMany({
			where,
			skip: skip,
			take: take,
			orderBy,
		});
		const totalCount = await prisma.jobRole.count({ where });
		const jobs = await Promise.all(
			jobRoles.map((jobRole) =>
				this.jobRoleMapper.mapJobRoleToResponse(jobRole),
			),
		);
		return { jobs, totalCount };
	}

	async findFilterOptions(): Promise<{
		capabilities: string[];
		bands: string[];
		statuses: string[];
	}> {
		const [capabilities, bands, statuses] = await Promise.all([
			prisma.capability.findMany({ select: { capabilityName: true } }),
			prisma.band.findMany({ select: { bandName: true } }),
			prisma.status.findMany({ select: { statusName: true } }),
		]);

		return {
			capabilities: capabilities.map((c) => c.capabilityName),
			bands: bands.map((b) => b.bandName),
			statuses: statuses.map((s) => s.statusName),
		};
	}
}
