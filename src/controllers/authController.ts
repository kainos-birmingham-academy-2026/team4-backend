import type { Request, Response } from "express";
import type { AuthRequestDto, AuthResponseDto } from "../dtos/authDto.js";
import { AuthError, type AuthService } from "../services/authService.js";

export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	private handleError(error: unknown, res: Response): Response {
		if (error instanceof AuthError) {
			return res.status(error.statusCode).json({ error: error.message });
		}

		return res.status(500).json({ error: "Internal server error" });
	}

	public async login(req: Request, res: Response): Promise<Response> {
		try {
			const token = await this.authService.login(req.body as AuthRequestDto);

			return res.status(200).json({ token } satisfies AuthResponseDto);
		} catch (error) {
			return this.handleError(error, res);
		}
	}

	public async register(req: Request, res: Response): Promise<Response> {
		try {
			const token = await this.authService.register(req.body as AuthRequestDto);

			return res.status(201).json({ token } satisfies AuthResponseDto);
		} catch (error) {
			return this.handleError(error, res);
		}
	}
}
