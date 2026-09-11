import { Router } from "express";
import { z } from "zod";
import { ApplicationController } from "../controllers/applicationController.js";
import { CreateApplicationSchema } from "../dtos/applicationDto.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validateBody, validateParams } from "../middlewares/validate.js";
import { ApplicationService } from "../services/applicationService.js";

const JobRoleApplicationsParamsSchema = z.object({
	jobRoleId: z.coerce.number().int().positive(),
});

const AssessApplicationParamsSchema = z.object({
	applicationId: z.coerce.number().int().positive(),
	action: z.enum(["hire", "reject"]),
});

export const createApplicationRouter = (
	applicationService?: ApplicationService,
): Router => {
	const router = Router();
	const controller = new ApplicationController(
		applicationService ?? new ApplicationService(),
	);

	router.use(requireAuth(false));

	router.get("/", controller.getMyApplications.bind(controller));
	router.get(
		"/job-role/:jobRoleId",
		requireAuth(true),
		validateParams(JobRoleApplicationsParamsSchema),
		controller.getApplicationsByJobRole.bind(controller),
	);
	router.post(
		"/:applicationId/:action",
		requireAuth(true),
		validateParams(AssessApplicationParamsSchema),
		controller.assessApplication.bind(controller),
	);
	router.post(
		"/",
		validateBody(CreateApplicationSchema),
		controller.createApplication.bind(controller),
	);

	return router;
};

export default createApplicationRouter();
