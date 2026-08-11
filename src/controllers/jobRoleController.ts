import type { JobRoleResponse } from "../dtos/jobRoleDto.js";
import { JobRoleService } from "../services/jobRoleService.js";
import type { Request, Response } from "express";

export class JobRoleController {
  constructor(private readonly jobRoleService: JobRoleService = new JobRoleService()) {}

  async getAllJobRoles(_req: Request, res: Response): Promise<void> {

    try {
        let jobRoles: JobRoleResponse[] = [];
        jobRoles = await this.jobRoleService.findAllJobRoles();
        res.status(200).json(jobRoles);
        return;
    } catch (_error) {
        res.status(500).json({ error: "Internal server error" });
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
    } catch (_error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

}