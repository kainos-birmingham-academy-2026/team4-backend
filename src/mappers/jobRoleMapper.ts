import type { JobRole } from "@prisma/client";
import {
	JobRoleDetailedResponse,
	JobRoleResponse,
} from "../dtos/jobRoleDto.js";
import prisma from "../prismaClient.js";

export class JobRoleMapper {
	private async getCapabilityName(capabilityId: number): Promise<string> {
		const capability = await prisma.capability.findUnique({
			where: { capabilityId },
			select: { capabilityName: true },
		});
		return capability?.capabilityName || "Unknown";
	}

	private async getBandName(bandId: number): Promise<string> {
		const band = await prisma.band.findUnique({
			where: { bandId },
			select: { bandName: true },
		});
		return band?.bandName || "Unknown";
	}

	private async getStatusName(statusId: number): Promise<string> {
		const status = await prisma.status.findUnique({
			where: { statusId },
			select: { statusName: true },
		});
		return status?.statusName || "Unknown";
	}

	async mapJobRoleToResponse(jobRole: JobRole): Promise<JobRoleResponse> {
		const capabilityName = await this.getCapabilityName(jobRole.capabilityId);
		const bandName = await this.getBandName(jobRole.bandId);
		const status = await this.getStatusName(jobRole.statusId);

		return new JobRoleResponse(
			jobRole.jobRoleId,
			jobRole.roleName,
			jobRole.location,
			capabilityName,
			bandName,
			jobRole.closingDate,
			status,
			jobRole.capabilityId,
			jobRole.bandId,
			jobRole.statusId,
		);
	}

	async mapJobRoleToDetailedResponse(
		jobRole: JobRole,
	): Promise<JobRoleDetailedResponse> {
		const capabilityName = await this.getCapabilityName(jobRole.capabilityId);
		const bandName = await this.getBandName(jobRole.bandId);
		const status = await this.getStatusName(jobRole.statusId);

		return new JobRoleDetailedResponse(
			jobRole.jobRoleId,
			jobRole.roleName,
			jobRole.location,
			capabilityName,
			bandName,
			jobRole.closingDate,
			status,
			jobRole.description,
			jobRole.responsibilities,
			jobRole.sharepointUrl,
			jobRole.numberOfOpenPositions,
			jobRole.capabilityId,
			jobRole.bandId,
			jobRole.statusId,
		);
	}
}
