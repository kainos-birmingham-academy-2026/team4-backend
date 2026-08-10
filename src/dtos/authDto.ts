import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{9,}$/, {message: "Password must be at least 9 characters long and contain at least one uppercase letter, one lowercase letter, and one special character."})
});

export type LoginRequestDto = z.infer<typeof LoginSchema>;

export interface LoginResponseDto {
    token: string;
}