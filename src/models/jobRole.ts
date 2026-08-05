export class JobRole {
    constructor(
        public readonly jobRoleId: number,
        public readonly roleName: string,
        public readonly location: string,
        public readonly capabilityId: number,
        public readonly bandId: string,
        public readonly closingDate: Date,
        public readonly status: string
    ) {
        if (!roleName || !location || !capabilityId || !bandId || !closingDate || !status) {
            throw new Error("All fields are required");
        }
    }
}