import { Router } from "express";
import { ApplicationController } from "../controllers/applicationController.js";
import { CreateApplicationSchema } from "../dtos/applicationDto.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validateBody } from "../middlewares/validate.js";
import { ApplicationService } from "../services/applicationService.js";

export const createApplicationRouter = (
	applicationService?: ApplicationService,
): Router => {
	const router = Router();
	const controller = new ApplicationController(
		applicationService ?? new ApplicationService(),
	);

	router.use(requireAuth(false));

	router.get("/", controller.getMyApplications.bind(controller));
	router.post(
		"/",
		validateBody(CreateApplicationSchema),
		controller.createApplication.bind(controller),
	);

	return router;
};

export default createApplicationRouter();
