import { Router } from "express";
import { ChatController } from "../controllers/chatController.js";
import { ChatRequestSchema } from "../dtos/chatDto.js";
import { validateBody } from "../middlewares/validate.js";
import { ChatService } from "../services/chatService.js";

export const createChatRouter = (chatService?: ChatService): Router => {
	const router = Router();
	const controller = new ChatController(chatService ?? new ChatService());

	router.post(
		"/",
		validateBody(ChatRequestSchema),
		controller.askChat.bind(controller),
	);

	return router;
};

export default createChatRouter();
