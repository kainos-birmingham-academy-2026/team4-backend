import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { AuthRequestDto } from "../dtos/authDto.js";
import prisma from "../prismaClient.js";

const LOGIN_ERROR = "Invalid email or password";

export class AuthError extends Error {
	public constructor(
		public readonly statusCode: number,
		message: string,
	) {
		super(message);
	}
}

export class AuthService {
	public async register(input: AuthRequestDto): Promise<string> {
		const existing = await prisma.user.findUnique({
			where: { email: input.email },
		});
		if (existing) {
			throw new AuthError(400, "User already exists");
		}

		const passwordHash = await argon2.hash(input.password);

		const user = await prisma.user.upsert({
			where: { email: input.email },
			update: { passwordHash },
			create: { email: input.email, passwordHash },
		});

		const secret = process.env.JWT_SECRET;

		if (!secret) {
			throw new Error("JWT_SECRET has not been configured");
		}

		return jwt.sign({ userId: user.id, email: user.email }, secret, {
			expiresIn: "1h",
		});
	}

	public async login(input: AuthRequestDto): Promise<string> {
		const user = await prisma.user.findUnique({
			where: { email: input.email },
		});

		if (!user) {
			throw new AuthError(401, LOGIN_ERROR);
		}

		const validPassword = await argon2.verify(
			user.passwordHash,
			input.password,
		);

		if (!validPassword) {
			throw new AuthError(401, LOGIN_ERROR);
		}

		const secret = process.env.JWT_SECRET;

		if (!secret) {
			throw new Error("JWT_SECRET has not been configured");
		}

		return jwt.sign({ userId: user.id, email: user.email }, secret, {
			expiresIn: "1h",
		});
	}
}
