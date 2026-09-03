import { z } from "zod";

export const IdParamSchema = z.object({
	id: z.coerce.number().int().positive("ID must be a positive integer"),
});

const StringArrayFilter = z.preprocess(
	(value) =>
		value === undefined ? undefined : Array.isArray(value) ? value : [value],
	z.array(z.string().trim().min(1)).optional(),
);

const FreeTextFilter = z.string().trim().min(1).max(100).optional();

/** Widen to the end of the day so the whole of the chosen date is included. */
const toEndOfDay = (date: Date) =>
	new Date(
		Date.UTC(
			date.getUTCFullYear(),
			date.getUTCMonth(),
			date.getUTCDate(),
			23,
			59,
			59,
			999,
		),
	);

const SortBySchema = z.enum([
	"jobRoleId",
	"roleName",
	"location",
	"capability",
	"band",
	"closingDate",
	"status",
]);

const SortOrderSchema = z.enum(["asc", "desc"]);

export const JobRoleFilterSchema = z
	.object({
		page: z.coerce.number().int().positive().default(1),
		roleName: FreeTextFilter,
		location: FreeTextFilter,
		capability: StringArrayFilter,
		band: StringArrayFilter,
		status: StringArrayFilter,
		closingDate: z.coerce.date().transform(toEndOfDay).optional(),
		sortBy: SortBySchema.optional(),
		sortOrder: SortOrderSchema.optional(),
	})
	.refine(
		({ sortBy, sortOrder }) =>
			(sortBy === undefined && sortOrder === undefined) ||
			(sortBy !== undefined && sortOrder !== undefined),
		{
			message: "sortBy and sortOrder must be provided together",
			path: ["sortBy"],
		},
	);

export type JobRoleQuery = z.infer<typeof JobRoleFilterSchema>;
export type JobRoleFilters = Omit<
	JobRoleQuery,
	"page" | "sortBy" | "sortOrder"
>;

export type JobRoleOrdering = {
	sortBy?: JobRoleQuery["sortBy"];
	sortOrder?: JobRoleQuery["sortOrder"];
};

export class JobRoleResponse {
	constructor(
		public readonly jobRoleId: number,
		public readonly roleName: string,
		public readonly location: string,
		public readonly capability: string,
		public readonly band: string,
		public readonly closingDate: Date | null,
		public readonly status: string,
	) {
		if (!roleName || !location || !capability || !band) {
			throw new Error(
				"Role name, location, capability, and band fields are required",
			);
		}
	}
}

export class JobRoleDetailedResponse extends JobRoleResponse {
	constructor(
		jobRoleId: number,
		roleName: string,
		location: string,
		capability: string,
		band: string,
		closingDate: Date | null,
		status: string,
		public readonly description: string,
		public readonly responsibilities: string[],
		public readonly sharepointUrl: string,
		public readonly numberOfOpenPositions: number,
	) {
		super(jobRoleId, roleName, location, capability, band, closingDate, status);
	}
}
