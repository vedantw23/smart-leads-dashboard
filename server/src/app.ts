import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { leadRouter } from "./routes/lead.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const allowedOrigins = new Set([env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"]);

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 150 }));

app.get("/api/health", (_req, res) => res.json({ success: true, message: "Smart Leads API is healthy" }));
app.use("/api/auth", authRouter);
app.use("/api/leads", leadRouter);
app.use(notFound);
app.use(errorHandler);
