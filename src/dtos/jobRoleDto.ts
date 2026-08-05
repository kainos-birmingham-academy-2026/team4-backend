import { z } from "zod";

export class JobRoleResponse {
    constructor(
        public readonly roleName: string,
        public readonly location: string,
        public readonly capability: string,
        public readonly band: string,
        public readonly closingDate: Date,
    ) {
        if (!roleName || !location || !capability || !band || !closingDate) {
            throw new Error("All fields are required");
        }
    }
}