import { Router } from "express";
import { JobRoleController } from "../controllers/jobRoleController";
import { JobRoleService } from "../services/jobRoleService";

const router = Router();
const controller = new JobRoleController(new JobRoleService());

router.get("/", controller.getAllJobRoles.bind(controller));

export default router;