import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { AuthService } from "../services/authService.js";
import { AuthSchema } from "../dtos/authDto.js";
import { validateBody } from "../middlewares/validate.js";

export const createAuthRouter = (authService?: AuthService): Router => {
    const router = Router();
    const controller = new AuthController(authService ?? new AuthService());

    router.post("/login", validateBody(AuthSchema), controller.login.bind(controller));
    router.post("/register", validateBody(AuthSchema), controller.register.bind(controller));

    return router;
};

export default createAuthRouter();