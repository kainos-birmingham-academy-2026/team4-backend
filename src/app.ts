import express from "express";
import jobRoleRouter from "./routes/jobRoleRouter.js";

export const app = express();
app.use(express.json());
app.use("/api/job-roles", jobRoleRouter);

