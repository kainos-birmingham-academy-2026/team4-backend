export class JobRoleResponse {
    constructor(
        public readonly roleName: string,
        public readonly location: string,
        public readonly capability: string,
        public readonly band: string,
        public readonly closingDate: Date | null,
    ) {
        if (!roleName || !location || !capability || !band) {
            throw new Error("Role name, location, capability, and band fields are required");
        }
    }
}