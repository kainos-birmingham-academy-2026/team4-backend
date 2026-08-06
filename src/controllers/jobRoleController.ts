import { Request, Response } from "express";
import { JobRoleService } from "../services/jobRoleService";
import { JobRoleResponse } from "../dtos/jobRoleDto";
import { JobRoleMapper } from "../mappers/jobRoleMapper";
import type { JobRole } from "@prisma/client";

export class JobRoleController {
  constructor(private readonly jobRoleService: JobRoleService = new JobRoleService()) {}

  async getAllJobRoles(req: Request, res: Response): Promise<void> {

    try {
        let jobRoles: JobRoleResponse[] = [];
        jobRoles = await this.jobRoleService.findAllJobRoles(req, res);
        res.status(200).json(jobRoles);
        return;
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
  }

}