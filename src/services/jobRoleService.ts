import type { JobRole, Prisma } from "@prisma/client";
import type {
	JobRoleCreateInput,
	JobRoleDetailedResponse,
	JobRoleFilters,
	JobRoleOrdering,
	JobRoleResponse,
	JobRoleUpdateInput,
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

	async findCreateOptions(): Promise<{
		capabilities: { id: number; name: string }[];
		bands: { id: number; name: string }[];
		statuses: { id: number; name: string }[];
	}> {
		const [capabilities, bands, statuses] = await Promise.all([
			prisma.capability.findMany({
				select: { capabilityId: true, capabilityName: true },
				orderBy: { capabilityName: "asc" },
			}),
			prisma.band.findMany({
				select: { bandId: true, bandName: true },
				orderBy: { bandName: "asc" },
			}),
			prisma.status.findMany({
				select: { statusId: true, statusName: true },
				orderBy: { statusName: "asc" },
			}),
		]);

		return {
			capabilities: capabilities.map(({ capabilityId, capabilityName }) => ({
				id: capabilityId,
				name: capabilityName,
			})),
			bands: bands.map(({ bandId, bandName }) => ({
				id: bandId,
				name: bandName,
			})),
			statuses: statuses.map(({ statusId, statusName }) => ({
				id: statusId,
				name: statusName,
			})),
		};
	}

	async createJobRole(
		input: JobRoleCreateInput,
	): Promise<JobRoleDetailedResponse> {
		const [capability, band, openStatus] = await Promise.all([
			prisma.capability.findUnique({
				where: { capabilityId: input.capabilityId },
			}),
			prisma.band.findUnique({ where: { bandId: input.bandId } }),
			prisma.status.findUnique({ where: { statusName: "Open" } }),
		]);

		if (!capability) {
			throw new Error("Capability not found");
		}
		if (!band) {
			throw new Error("Band not found");
		}
		if (!openStatus) {
			throw new Error("Open status not found");
		}

		const jobRole = await prisma.jobRole.create({
			data: {
				roleName: input.roleName,
				description: input.description,
				sharepointUrl: input.sharepointUrl,
				responsibilities: input.responsibilities,
				numberOfOpenPositions: input.numberOfOpenPositions,
				location: input.location,
				closingDate: input.closingDate,
				capabilityId: capability.capabilityId,
				bandId: band.bandId,
				statusId: openStatus.statusId,
			},
		});

		return this.jobRoleMapper.mapJobRoleToDetailedResponse(jobRole);
	}

	async updateJobRole(
		id: number,
		input: JobRoleUpdateInput,
	): Promise<JobRoleDetailedResponse | null> {
		const existingJobRole = await prisma.jobRole.findUnique({
			where: { jobRoleId: id },
		});

		if (!existingJobRole) {
			return null;
		}

		const [capability, band, status] = await Promise.all([
			prisma.capability.findUnique({
				where: { capabilityId: input.capabilityId },
			}),
			prisma.band.findUnique({ where: { bandId: input.bandId } }),
			prisma.status.findUnique({ where: { statusId: input.statusId } }),
		]);

		if (!capability) {
			throw new Error("Capability not found");
		}
		if (!band) {
			throw new Error("Band not found");
		}
		if (!status) {
			throw new Error("Status not found");
		}

		const jobRole = await prisma.jobRole.update({
			where: { jobRoleId: id },
			data: {
				roleName: input.roleName,
				description: input.description,
				sharepointUrl: input.sharepointUrl,
				responsibilities: input.responsibilities,
				numberOfOpenPositions: input.numberOfOpenPositions,
				location: input.location,
				closingDate: input.closingDate,
				capabilityId: capability.capabilityId,
				bandId: band.bandId,
				statusId: status.statusId,
			},
		});

		return this.jobRoleMapper.mapJobRoleToDetailedResponse(jobRole);
	}

	async deleteJobRole(id: number): Promise<boolean> {
		const existingJobRole = await prisma.jobRole.findUnique({
			where: { jobRoleId: id },
		});

		if (!existingJobRole) {
			return false;
		}

		await prisma.jobRole.delete({ where: { jobRoleId: id } });
		return true;
	}
}
