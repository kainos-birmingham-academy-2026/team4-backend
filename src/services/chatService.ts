import type { ChatRecommendation, ChatResponseDto } from "../dtos/chatDto.js";
import type { JobRoleResponse } from "../dtos/jobRoleDto.js";
import { JobRoleService } from "./jobRoleService.js";

interface RankedRole {
	role: JobRoleResponse;
	score: number;
	reasons: string[];
}

interface JobRoleLookupService {
	findAllJobRoles: () => Promise<JobRoleResponse[]>;
}

export class ChatService {
	public constructor(
		private readonly jobRoleService: JobRoleLookupService = new JobRoleService(),
	) {}

	private readonly synonymGroups: Record<string, string[]> = {
		Engineering: [
			"engineering",
			"engineer",
			"developer",
			"coding",
			"code",
			"software",
			"technical",
			"app",
			"apps",
			"website",
			"websites",
			"web",
			"frontend",
			"backend",
			"fullstack",
			"full-stack",
		],
		Platform: [
			"platform",
			"platforms",
			"cloud",
			"aws",
			"azure",
			"infrastructure",
		],
		"People Operations": ["people", "hr", "talent", "culture", "recruitment"],
		"Data & AI": [
			"data",
			"analysis",
			"analyst",
			"insight",
			"reporting",
			"numbers",
			"ai",
			"machine learning",
		],
		"Product Consultant": [
			"product",
			"product manager",
			"product owner",
			"roadmap",
			"consultant",
			"consulting",
		],
		Quality: ["quality", "qa", "test", "testing", "tester", "automation"],
		Cybersecurity: [
			"cyber",
			"security",
			"cybersecurity",
			"infosec",
			"secure",
			"risk",
		],
	};

	private matchesRoleFamily(
		role: JobRoleResponse,
		roleFamily: string,
	): boolean {
		const capabilityLower = role.capability.toLowerCase();
		const roleNameLower = role.roleName.toLowerCase();

		switch (roleFamily) {
			case "Engineering":
				return capabilityLower.includes("engineering");
			case "Platform":
				return capabilityLower.includes("platform");
			case "People Operations":
				return capabilityLower.includes("people");
			case "Data & AI":
				return capabilityLower.includes("data");
			case "Product Consultant":
				return (
					capabilityLower.includes("product") ||
					roleNameLower.includes("consult")
				);
			case "Quality":
				return (
					roleNameLower.includes("qa") ||
					roleNameLower.includes("test") ||
					roleNameLower.includes("quality")
				);
			case "Cybersecurity":
				return capabilityLower.includes("cyber");
			default:
				return capabilityLower.includes(roleFamily.toLowerCase());
		}
	}

	public async getChatResponse(message: string): Promise<ChatResponseDto> {
		const normalized = message.toLowerCase();
		const roles = await this.jobRoleService.findAllJobRoles();
		const openRoles = roles.filter(
			(role) => role.status.toLowerCase() === "open",
		);
		const scopedRoles = openRoles.length > 0 ? openRoles : roles;

		if (scopedRoles.length === 0) {
			return {
				message:
					"I cannot find any available role data right now. Please try again shortly or browse job roles directly.",
				recommendations: [],
				intent: "clarify",
				confidence: "medium",
			};
		}

		if (this.isCapabilityExplanationQuestion(normalized)) {
			return {
				message:
					"A capability is the main discipline or team a role belongs to, such as Engineering, Platform, People Operations, Data & AI, Product Consultant, Quality, or Cybersecurity. It helps group similar jobs so you can find roles that match your strengths.",
				recommendations: this.pickCapabilityExamples(scopedRoles),
				intent: "explain",
				confidence: "high",
			};
		}

		const capability = this.detectCapability(normalized);
		const location = this.detectLocation(normalized, scopedRoles);
		const rankedRoles = this.rankRoles(
			this.tokenizeMessage(normalized),
			capability,
			location,
			scopedRoles,
		);

		// Case 1: Found matching roles
		if (rankedRoles.length > 0) {
			const recommendations = rankedRoles
				.slice(0, 3)
				.map((rankedRole) =>
					this.mapRecommendation(rankedRole.role, rankedRole.reasons[0]),
				);
			recommendations.push(this.createExploreAllButton());

			return {
				message:
					"Based on your interests, these roles could be a good fit. I can narrow this down further by location or level if you want.",
				recommendations,
				intent: this.isUncertain(normalized) ? "recommend" : "search",
				confidence: "high",
			};
		}

		// Case 2: Capability detected but no open roles available
		if (capability) {
			const capabilityExistsInAllRoles = roles.some((role) =>
				this.matchesRoleFamily(role, capability),
			);

			if (capabilityExistsInAllRoles) {
				return {
					message: `We have ${capability} roles, but unfortunately none are currently open. You can browse all roles or check back soon for new openings.`,
					recommendations: [this.createExploreAllButton()],
					intent: "search",
					confidence: "medium",
				};
			}
		}

		// Case 3: No capability detected - help if uncertain
		if (this.isUncertain(normalized)) {
			const fallbackRecommendations = scopedRoles
				.slice(0, 3)
				.map((role) =>
					this.mapRecommendation(
						role,
						"This is an open role you can use as a starting point.",
					),
				);
			fallbackRecommendations.push(this.createExploreAllButton());

			return {
				message:
					"No problem. Tell me what you enjoy, such as building apps, platform/cloud work, people-focused work, data & AI, product consulting, QA/testing, or cybersecurity, and I can recommend a capability.",
				recommendations: fallbackRecommendations,
				intent: "recommend",
				confidence: "medium",
			};
		}

		// Case 4: Unrecognized keyword
		return {
			message:
				"I did not fully understand that yet. Try asking about capabilities, locations, or interests.",
			recommendations: [this.createExploreAllButton()],
			intent: "clarify",
			confidence: "medium",
		};
	}

	private detectCapability(message: string): string {
		for (const [capability, synonyms] of Object.entries(this.synonymGroups)) {
			if (synonyms.some((term) => message.includes(term))) {
				return capability;
			}
		}

		return "";
	}

	private detectLocation(message: string, roles: JobRoleResponse[]): string {
		const locations = Array.from(
			new Set(roles.map((role) => role.location).filter(Boolean)),
		);
		return (
			locations.find((location) => message.includes(location.toLowerCase())) ||
			""
		);
	}

	private tokenizeMessage(message: string): string[] {
		const stopWords = new Set([
			"i",
			"me",
			"my",
			"the",
			"a",
			"an",
			"to",
			"and",
			"or",
			"for",
			"with",
			"about",
			"in",
			"on",
			"at",
			"of",
			"like",
			"want",
			"looking",
			"role",
			"roles",
			"job",
			"jobs",
		]);

		return message
			.replace(/[^a-z0-9\s-]/g, " ")
			.split(/\s+/)
			.map((token) => token.trim())
			.filter((token) => token.length >= 3 && !stopWords.has(token));
	}

	private rankRoles(
		tokens: string[],
		capabilityHint: string,
		locationHint: string,
		roles: JobRoleResponse[],
	): RankedRole[] {
		const rankedRoles = roles
			.map((role) => {
				let score = 0;
				const reasons: string[] = [];
				const roleNameLower = role.roleName.toLowerCase();
				const capabilityLower = role.capability.toLowerCase();
				const locationLower = role.location.toLowerCase();
				const bandLower = role.band.toLowerCase();

				if (capabilityHint && this.matchesRoleFamily(role, capabilityHint)) {
					score += 8;
					reasons.push(`it matches the ${capabilityHint} capability`);
				}

				if (
					locationHint &&
					locationLower.includes(locationHint.toLowerCase())
				) {
					score += 5;
					reasons.push(`it is available in ${role.location}`);
				}

				for (const token of tokens) {
					if (roleNameLower.includes(token)) {
						score += 3;
					}
					if (capabilityLower.includes(token)) {
						score += 2;
					}
					if (bandLower.includes(token)) {
						score += 1;
					}
				}

				return { role, score, reasons };
			})
			.filter((rankedRole) => rankedRole.score > 0)
			.sort((left, right) => right.score - left.score);

		return rankedRoles;
	}

	private isCapabilityExplanationQuestion(message: string): boolean {
		return (
			message.includes("what does capability mean") ||
			message.includes("what is capability") ||
			message.includes("what are capabilities") ||
			message.includes("define capability") ||
			message.includes("explain capability")
		);
	}

	private isUncertain(message: string): boolean {
		return (
			message.includes("not sure") ||
			message.includes("dont know") ||
			message.includes("don't know") ||
			message.includes("help me")
		);
	}

	private pickCapabilityExamples(
		roles: JobRoleResponse[],
	): ChatRecommendation[] {
		const byCapability = new Map<string, JobRoleResponse>();
		for (const role of roles) {
			if (role.capability && !byCapability.has(role.capability)) {
				byCapability.set(role.capability, role);
			}
		}

		return Array.from(byCapability.values())
			.slice(0, 3)
			.map((role) =>
				this.mapRecommendation(
					role,
					`This is an example role in ${role.capability}.`,
				),
			);
	}

	private mapRecommendation(
		role: JobRoleResponse,
		whyRecommended: string,
		url?: string,
	): ChatRecommendation {
		return {
			jobRoleId: role.jobRoleId,
			roleName: role.roleName,
			location: role.location,
			capability: role.capability,
			band: role.band,
			status: role.status,
			whyRecommended,
			url,
		};
	}

	private createExploreAllButton(): ChatRecommendation {
		return {
			roleName: "Browse all open roles",
			whyRecommended:
				"Explore all available positions and filter by your preferences.",
			url: "/job-roles",
		};
	}
}
