import { z } from "zod";

export const IdParamSchema = z.object({
    id: z.coerce.number().int().positive("ID must be a positive integer"),
});

export class JobRoleResponse {
    constructor(
        public readonly roleName: string,
        public readonly location: string,
        public readonly capability: string,
        public readonly band: string,
        public readonly closingDate: Date | null,
        public readonly status: string
    ) {
        if (!roleName || !location || !capability || !band) {
            throw new Error("Role name, location, capability, and band fields are required");
        }
    }
}

export class JobRoleDetailedResponse extends JobRoleResponse {
    constructor(
        roleName: string,
        location: string,
        capability: string,
        band: string,
        closingDate: Date | null,
        status: string,
        public readonly description: string,
        public readonly responsibilities: string[],
        public readonly sharepointUrl: string,
        public readonly numberOfOpenPositions: number
    ) {
        super(roleName, location, capability, band, closingDate, status);
    }
}

