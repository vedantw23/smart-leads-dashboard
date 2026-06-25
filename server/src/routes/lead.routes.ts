import { Router } from "express";
import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  getLeadById,
  getLeads,
  updateLead
} from "../controllers/lead.controller.js";
import { validate } from "../middleware/validate.js";
import { createLeadSchema, leadQuerySchema, updateLeadSchema } from "../schemas/lead.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const leadRouter = Router();

leadRouter.get("/", validate(leadQuerySchema), asyncHandler(getLeads));
leadRouter.get("/export", validate(leadQuerySchema), asyncHandler(exportLeadsCsv));
leadRouter.get("/:id", asyncHandler(getLeadById));
leadRouter.post("/", validate(createLeadSchema), asyncHandler(createLead));
leadRouter.patch("/:id", validate(updateLeadSchema), asyncHandler(updateLead));
leadRouter.delete("/:id", asyncHandler(deleteLead));

