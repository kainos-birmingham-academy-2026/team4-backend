import { Router } from "express";
import { JobRoleController } from "../controllers/jobRoleController.js";
import { IdParamSchema, JobRoleFilterSchema } from "../dtos/jobRoleDto.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validateParams, validateQuery } from "../middlewares/validate.js";
import { JobRoleService } from "../services/jobRoleService.js";

export const createJobRoleRouter = (
	jobRoleService?: JobRoleService,
): Router => {
	const router = Router();
	const controller = new JobRoleController(
		jobRoleService ?? new JobRoleService(),
	);

	router.use(requireAuth(false));

	router.get(
		"/",
		validateQuery(JobRoleFilterSchema),
		controller.getAllJobRoles.bind(controller),
	);
	router.get("/filter-options", controller.getFilterOptions.bind(controller));
	router.get(
		"/:id",
		validateParams(IdParamSchema),
		controller.getJobRoleById.bind(controller),
	);

	//The following routes are protected and require authentication
	router.use(requireAuth(true));

	router.post("/", controller.create.bind(controller));
	router.put("/:id", controller.update.bind(controller));
	router.delete("/:id", controller.delete.bind(controller));

	return router;
};

export default createJobRoleRouter();
