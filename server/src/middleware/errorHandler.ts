import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";

interface ErrorWithStatus extends Error {
  statusCode?: number;
  code?: number;
}

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next({ statusCode: 404, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (error: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = error.statusCode ?? 500;
  let message = error.message || "Internal server error";

  if (error instanceof ZodError) {
    statusCode = 400;
    message = error.issues.map((issue) => issue.message).join(", ");
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = "A record with that unique value already exists";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: env.NODE_ENV === "development" ? error.stack : undefined
  });
};
