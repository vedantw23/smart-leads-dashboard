import type { Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import type { JwtPayload } from "../types/auth.js";
import { AppError } from "../utils/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";

const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] });
};

const publicUser = (user: { _id: unknown; name: string; email: string; role: string }) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role
});

export const register = async (req: Request, res: Response): Promise<Response> => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) throw new AppError("Email is already registered", 409);

  const user = await User.create(req.body);
  const token = signToken({ userId: String(user._id), role: user.role });

  return sendSuccess(res, { user: publicUser(user), token }, "Registration successful", 201);
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({ userId: String(user._id), role: user.role });
  return sendSuccess(res, { user: publicUser(user), token }, "Login successful");
};

export const me = async (req: Request, res: Response): Promise<Response> => {
  const user = await User.findById(req.user?.userId);
  if (!user) throw new AppError("User not found", 404);
  return sendSuccess(res, { user: publicUser(user) });
};
