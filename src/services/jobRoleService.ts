import { JobRoleResponse } from "../dtos/jobRoleDto";
import { JobRoleMapper } from "../mappers/jobRoleMapper";
import { Request, Response } from "express";
import { JobRole } from "../models/jobRole";
import prisma from "../prismaClient";


export class JobRoleService {
    private readonly jobRoleMapper = new JobRoleMapper();

    async findAllJobRoles(_req: Request, res: Response): Promise<JobRoleResponse[]> {
        const jobRoles : JobRole[] = await prisma.jobRole.findMany();
        const jobRoleResponses = await Promise.all(jobRoles.map(jobRole => this.jobRoleMapper.mapJobRoleToResponse(jobRole)));
        return jobRoleResponses;
    }
}