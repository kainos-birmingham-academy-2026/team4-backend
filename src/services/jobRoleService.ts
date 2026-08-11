import type { JobRole } from "@prisma/client";
import type { JobRoleDetailedResponse, JobRoleResponse } from "../dtos/jobRoleDto.js";
import { JobRoleMapper } from "../mappers/jobRoleMapper.js";
import prisma from "../prismaClient.js";


export class JobRoleService {
    private readonly jobRoleMapper = new JobRoleMapper();

    async findAllJobRoles(): Promise<JobRoleResponse[]> {
        const jobRoles : JobRole[] = await prisma.jobRole.findMany();
        const jobRoleResponses = await Promise.all(jobRoles.map(jobRole => this.jobRoleMapper.mapJobRoleToResponse(jobRole)));
        return jobRoleResponses;
    }

    async findJobRoleById(id: number): Promise<JobRoleDetailedResponse | null> {
        const jobRole = await prisma.jobRole.findUnique({ where: { jobRoleId: id } });
        if (!jobRole) {
            return null;
        }
        return this.jobRoleMapper.mapJobRoleToDetailedResponse(jobRole);
    }
}