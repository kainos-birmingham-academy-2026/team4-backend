import type { RequestHandler } from "express";

export const requireJobRoleStatusUpdateSecret: RequestHandler = (
	req,
	res,
	next,
) => {
	const configuredSecret = process.env.JOB_ROLE_STATUS_UPDATE_SECRET;
	const requestSecret = req.header("x-job-role-status-secret");

	if (!configuredSecret || requestSecret !== configuredSecret) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	next();
};
