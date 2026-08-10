import express from "express";
import jobRoleRouter from "./routes/jobRoleRouter.js";
import authRouter from "./routes/authRouter.js";

export const app = express();
app.use(express.json());
app.use("/api/job-roles", jobRoleRouter);
app.use("/api/login", authRouter);

