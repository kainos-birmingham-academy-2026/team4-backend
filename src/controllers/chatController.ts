import type { Request, Response } from "express";
import type { ChatRequestDto } from "../dtos/chatDto.js";
import { ChatService } from "../services/chatService.js";

export class ChatController {
	public constructor(
		private readonly chatService: ChatService = new ChatService(),
	) {}

	public async askChat(req: Request, res: Response): Promise<void> {
		try {
			const payload = req.body as ChatRequestDto;
			const response = await this.chatService.getChatResponse(payload.message);
			res.status(200).json(response);
		} catch (_error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}
}
