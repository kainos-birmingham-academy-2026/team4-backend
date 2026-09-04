import type { ApplicationResponse } from "../dtos/applicationDto.js";
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
			include: { status: true },
			orderBy: { createdAt: "desc" },
		});

		return applications.map((application) =>
			this.applicationMapper.mapApplicationToResponse(
				application,
				application.status.statusName,
			),
		);
	}
}
