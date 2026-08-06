import type { JobRoleResponse } from "../dtos/jobRoleDto";
import { JobRoleService } from "../services/jobRoleService";
import type { Request, Response } from "express";

export class JobRoleController {
  constructor(private readonly jobRoleService: JobRoleService = new JobRoleService()) {}

  async getAllJobRoles(req: Request, res: Response): Promise<void> {

    try {
        let jobRoles: JobRoleResponse[] = [];
        jobRoles = await this.jobRoleService.findAllJobRoles(req, res);
        res.status(200).json(jobRoles);
        return;
    } catch (_error) {
        res.status(500).json({ error: "Internal server error" });
    }
  }

}