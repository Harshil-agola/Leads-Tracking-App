import cors from "cors";
import express, { type Application } from "express";
import morgan from "morgan";
import { EnvConfig } from './config/env.js';

const app: Application = express();

app.use(morgan("dev"));

app.use(
  cors({
    origin: [EnvConfig.FRONTEND_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Server is running", timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
