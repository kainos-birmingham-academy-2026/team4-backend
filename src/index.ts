import express from "express";
import { app } from "./app";

const PORT = 4000;

// Middleware
app.use(express.json());

// Root endpoint
app.get("/", (_req, res) => {
  res.json({ message: "Team 4 backend is running!" });
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "UP", time: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Try: http://localhost:${PORT}/health`);
});