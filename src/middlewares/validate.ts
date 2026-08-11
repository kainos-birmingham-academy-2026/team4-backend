import type { RequestHandler } from "express";
import type { z, ZodSchema } from "zod";

export function formatZodError(error: z.ZodError) {
    return error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
    }));
}

export function validateParams(schema: ZodSchema): RequestHandler {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            res.status(400).json(formatZodError(result.error));
            return;
        }
        
        next();
    };
}
