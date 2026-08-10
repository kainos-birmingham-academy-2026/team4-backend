import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { AuthService } from "../services/authService.js";
import { LoginSchema } from "../dtos/authDto.js";
import { validateBody } from "../middlewares/validate.js";

const router = Router();
const controller = new AuthController(new AuthService());

router.post("/", validateBody(LoginSchema), controller.login.bind(controller));

export default router;
    