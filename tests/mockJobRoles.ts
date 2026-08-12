import type {
	JobRoleDetailedResponse,
	JobRoleResponse,
} from "../src/dtos/jobRoleDto";

export const mockJobRole1 = {
	jobRoleId: 1,
	roleName: "Software Engineer",
	description: "Develop and maintain software applications.",
	location: "Remote",
	capabilityId: 1,
	bandId: 1,
	closingDate: new Date("2024-12-31"),
	statusId: 1,
	responsibilities: ["Write code", "Review code", "Deploy applications"],
	sharepointUrl: "https://sharepoint.example.com/jobroles/1",
	numberOfOpenPositions: 3,
};

export const mockJobRole2 = {
	jobRoleId: 2,
	roleName: "Product Manager",
	description: "Oversee product development and strategy.",
	location: "New York",
	capabilityId: 2,
	bandId: 2,
	closingDate: new Date("2024-11-30"),
	statusId: 1,
	responsibilities: ["Define product roadmap", "Coordinate with stakeholders"],
	sharepointUrl: "https://sharepoint.example.com/jobroles/2",
	numberOfOpenPositions: 2,
};
export const mockJobRoles = [mockJobRole1, mockJobRole2];

export const mockJobRoleResponse1: JobRoleResponse = {
	jobRoleId: 1,
	roleName: "Software Engineer",
	location: "Remote",
	capability: "Engineering",
	band: "Band 1",
	closingDate: new Date("2024-12-31"),
	status: "Open",
};

export const mockJobRoleResponse2: JobRoleResponse = {
	jobRoleId: 2,
	roleName: "Product Manager",
	location: "New York",
	capability: "Product Management",
	band: "Band 2",
	closingDate: new Date("2024-11-30"),
	status: "Open",
};

export const mockJobRoleResponses = [
	mockJobRoleResponse1,
	mockJobRoleResponse2,
];

export const mockJobRoleDetailedResponse1: JobRoleDetailedResponse = {
	jobRoleId: 1,
	roleName: "Software Engineer",
	location: "Remote",
	capability: "Engineering",
	band: "Band 1",
	closingDate: new Date("2024-12-31"),
	status: "Open",
	responsibilities: ["Write code", "Review code", "Deploy applications"],
	sharepointUrl: "https://sharepoint.example.com/jobroles/1",
	numberOfOpenPositions: 3,
	description: "Develop and maintain software applications.",
};

export const mockJobRoleDetailedResponse2: JobRoleDetailedResponse = {
	jobRoleId: 2,
	roleName: "Product Manager",
	location: "New York",
	capability: "Product Management",
	band: "Band 2",
	closingDate: new Date("2024-11-30"),
	status: "Open",
	responsibilities: ["Define product roadmap", "Coordinate with stakeholders"],
	sharepointUrl: "https://sharepoint.example.com/jobroles/2",
	numberOfOpenPositions: 2,
	description: "Oversee product development and strategy.",
};

export const mockJobRoleDetailedResponses = [
	mockJobRoleDetailedResponse1,
	mockJobRoleDetailedResponse2,
];
