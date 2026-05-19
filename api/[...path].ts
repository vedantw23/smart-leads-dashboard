import type { VercelRequest, VercelResponse } from "@vercel/node";
import { app } from "../server/src/app.js";
import { connectDb } from "../server/src/config/db.js";

let dbConnection: Promise<void> | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  dbConnection ??= connectDb();
  await dbConnection;
  return app(req, res);
}
