import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { AuthService } from "../services/authService.js";
import { AuthSchema } from "../dtos/authDto.js";
import { validateBody } from "../middlewares/validate.js";

const router = Router();
const controller = new AuthController(new AuthService());

router.post("/login", validateBody(AuthSchema), controller.login.bind(controller));
router.post("/register", validateBody(AuthSchema), controller.register.bind(controller));

export default router;
