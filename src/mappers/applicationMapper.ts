import type { Application } from "@prisma/client";
import { ApplicationResponse } from "../dtos/applicationDto.js";

export class ApplicationMapper {
	mapApplicationToResponse(
		application: Application,
		statusName: string,
	): ApplicationResponse {
		return new ApplicationResponse(
			application.applicationId,
			application.userId,
			application.jobRoleId,
			statusName,
			application.createdAt,
		);
	}
}
