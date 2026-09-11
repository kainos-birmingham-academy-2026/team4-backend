import {
	ApplicationAssessmentResponse,
	type ApplicationResponse,
} from "../dtos/applicationDto.js";
import { ApplicationMapper } from "../mappers/applicationMapper.js";
import prisma from "../prismaClient.js";

const OPEN_STATUS = "Open";
const IN_PROGRESS_STATUS = "In Progress";

export class ApplicationError extends Error {
	public constructor(
		public readonly statusCode: number,
		message: string,
	) {
		super(message);
	}
}

export class ApplicationService {
	private readonly applicationMapper = new ApplicationMapper();

	async createApplication(
		userId: number,
		jobRoleId: number,
		message: string,
	): Promise<ApplicationResponse> {
		const jobRole = await prisma.jobRole.findUnique({
			where: { jobRoleId },
			include: { status: true },
		});

		if (!jobRole) {
			throw new ApplicationError(404, "Job role not found");
		}

		if (
			jobRole.status.statusName !== OPEN_STATUS ||
			jobRole.numberOfOpenPositions <= 0
		) {
			throw new ApplicationError(
				400,
				"This job role is not currently open for applications",
			);
		}

		const inProgressStatus = await prisma.status.findUnique({
			where: { statusName: IN_PROGRESS_STATUS },
		});

		if (!inProgressStatus) {
			throw new Error(`"${IN_PROGRESS_STATUS}" status has not been seeded`);
		}

		try {
			const application = await prisma.application.create({
				data: {
					userId,
					jobRoleId,
					message,
					statusId: inProgressStatus.statusId,
				},
			});

			return this.applicationMapper.mapApplicationToResponse(
				application,
				jobRole.roleName,
				inProgressStatus.statusName,
			);
		} catch (error) {
			if (
				error &&
				typeof error === "object" &&
				"code" in error &&
				error.code === "P2002"
			) {
				throw new ApplicationError(
					409,
					"You have already applied for this job role",
				);
			}

			throw error;
		}
	}

	async findApplicationsByUserId(
		userId: number,
	): Promise<ApplicationResponse[]> {
		const applications = await prisma.application.findMany({
			where: { userId },
			include: {
				status: true,
				jobRole: { select: { roleName: true } },
			},
			orderBy: { createdAt: "desc" },
		});

		return applications.map((application) =>
			this.applicationMapper.mapApplicationToResponse(
				application,
				application.jobRole.roleName,
				application.status.statusName,
			),
		);
	}

	async findApplicationsByJobRoleId(
		jobRoleId: number,
	): Promise<ApplicationAssessmentResponse[]> {
		const applications = await prisma.application.findMany({
			where: { jobRoleId },
			include: { status: true, user: { select: { email: true } } },
			orderBy: { createdAt: "asc" },
		});

		return applications.map(
			(application) =>
				new ApplicationAssessmentResponse(
					application.applicationId,
					application.userId,
					application.user.email,
					application.jobRoleId,
					application.message,
					application.status.statusName,
					application.createdAt,
				),
		);
	}

	async updateApplicationStatus(
		applicationId: number,
		targetStatusName: "Hired" | "Rejected",
	): Promise<ApplicationAssessmentResponse> {
		return prisma.$transaction(async (transaction) => {
			const application = await transaction.application.findUnique({
				where: { applicationId },
				include: { status: true, user: { select: { email: true } } },
			});

			if (!application) {
				throw new ApplicationError(404, "Application not found");
			}

			if (application.status.statusName !== IN_PROGRESS_STATUS) {
				throw new ApplicationError(
					409,
					"Only applications in progress can be assessed",
				);
			}

			const targetStatus = await transaction.status.findUnique({
				where: { statusName: targetStatusName },
			});
			if (!targetStatus) {
				throw new Error(`"${targetStatusName}" status has not been seeded`);
			}

			if (targetStatusName === "Hired") {
				const updatedRole = await transaction.jobRole.updateMany({
					where: {
						jobRoleId: application.jobRoleId,
						numberOfOpenPositions: { gt: 0 },
					},
					data: { numberOfOpenPositions: { decrement: 1 } },
				});

				if (updatedRole.count !== 1) {
					throw new ApplicationError(
						409,
						"There are no open positions remaining for this role",
					);
				}
			}

			const updatedApplication = await transaction.application.update({
				where: { applicationId },
				data: { statusId: targetStatus.statusId },
				include: { user: { select: { email: true } } },
			});

			return new ApplicationAssessmentResponse(
				updatedApplication.applicationId,
				updatedApplication.userId,
				updatedApplication.user.email,
				updatedApplication.jobRoleId,
				updatedApplication.message,
				targetStatusName,
				updatedApplication.createdAt,
			);
		});
	}
}
