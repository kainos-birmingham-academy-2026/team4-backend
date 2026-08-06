import { Router } from "express";
import { JobRoleController } from "../controllers/jobRoleController";
import { JobRoleService } from "../services/jobRoleService";


export const createJobRoleRouter = (jobRoleService?: JobRoleService): Router => {
    const router = Router();
    const controller = new JobRoleController(jobRoleService ?? new JobRoleService());

    router.get("/", controller.getAllJobRoles.bind(controller));

    return router;
};



export default createJobRoleRouter();