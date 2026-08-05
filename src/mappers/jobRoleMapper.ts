import { JobRole } from "../models/jobRole";
import { JobRoleResponse } from "../dtos/jobRoleDto";
import prisma from "../prismaClient";


export class JobRoleMapper {

    private async getCapabilityName(capabilityId: number): Promise<string> {
        const capability = await prisma.capability.findUnique({
            where: { capabilityId },
            select: { capabilityName: true },
        });
        return capability?.capabilityName || "Unknown";
    }

    private async getBandName(bandId: string): Promise<string> {
        const band = await prisma.band.findUnique({
            where: { bandId },
            select: { bandName: true },
        });
        return band?.bandName || "Unknown";
    }

    async mapJobRoleToResponse(jobRole: JobRole): Promise<JobRoleResponse> {
        const capabilityName = await this.getCapabilityName(jobRole.capabilityId);
        const bandName = await this.getBandName(jobRole.bandId);

        return new JobRoleResponse(
            jobRole.roleName,
            jobRole.location,
            capabilityName,
            bandName,
            jobRole.closingDate
        );
    }

}