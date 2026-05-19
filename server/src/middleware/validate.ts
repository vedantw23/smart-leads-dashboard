import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";

export const validate = (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction): void => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(", ");
    next({ statusCode: 400, message });
    return;
  }

  req.body = result.data.body ?? req.body;
  req.query = result.data.query ?? req.query;
  next();
};
