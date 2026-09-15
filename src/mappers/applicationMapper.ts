import type { Application } from "@prisma/client";
import { ApplicationResponse } from "../dtos/applicationDto.js";

export class ApplicationMapper {
	mapApplicationToResponse(
		application: Application,
		roleName: string,
		statusName: string,
	): ApplicationResponse {
		return new ApplicationResponse(
			application.applicationId,
			application.userId,
			application.jobRoleId,
			roleName,
			statusName,
			application.createdAt,
		);
	}
}
