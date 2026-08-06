import { Router } from "express";
import { JobRoleController } from "../controllers/jobRoleController.js";
import { JobRoleService } from "../services/jobRoleService.js";


export const createJobRoleRouter = (jobRoleService?: JobRoleService): Router => {
    const router = Router();
    const controller = new JobRoleController(jobRoleService ?? new JobRoleService());

    router.get("/", controller.getAllJobRoles.bind(controller));

    return router;
};



export default createJobRoleRouter();