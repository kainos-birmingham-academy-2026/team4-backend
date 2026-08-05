import { Request, Response } from "express";
import { JobRoleService } from "../services/jobRoleService";
import prisma from "../prismaClient";
import { JobRoleResponse } from "../dtos/jobRoleDto";
import { JobRoleMapper } from "../mappers/jobRoleMapper";
import { JobRole } from "../models/jobRole";

export class JobRoleController {
  constructor(private readonly jobRoleService: JobRoleService = new JobRoleService()) {}

    private readonly jobRoleMapper = new JobRoleMapper();

    async getAllJobRoles(_req: Request, res: Response): Promise<JobRoleResponse[]> {
        const jobRoles : JobRole[] = await prisma.jobRole.findMany();
        const jobRoleResponses = await Promise.all(jobRoles.map(jobRole => this.jobRoleMapper.mapJobRoleToResponse(jobRole)));
        return jobRoleResponses;
    }
}