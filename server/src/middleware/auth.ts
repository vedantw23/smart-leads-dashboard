import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { JwtPayload, UserRole } from "../types/auth.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) return next(new AppError("Authentication token is required", 401));

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};

export const authorize = (...roles: UserRole[]) => (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) return next(new AppError("Authentication required", 401));
  if (!roles.includes(req.user.role)) return next(new AppError("You do not have permission for this action", 403));
  next();
};
