import express from "express";
import authRouter from "./routes/authRouter.js";
import chatRouter from "./routes/chatRouter.js";
import jobRoleRouter from "./routes/jobRoleRouter.js";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/job-roles", jobRoleRouter);
app.use("/api/chat", chatRouter);
app.use("/auth", authRouter);
