import type { FilterQuery } from "mongoose";
import type { Request, Response } from "express";
import { Lead, type ILead } from "../models/Lead.js";
import { AppError } from "../utils/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";

const buildLeadFilter = (query: Request["query"]): FilterQuery<ILead> => {
  const filter: FilterQuery<ILead> = {};
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.search) {
    const searchRegex = new RegExp(String(query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }
  return filter;
};

export const getLeads = async (req: Request, res: Response): Promise<Response> => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const skip = (page - 1) * limit;
  const sortDirection = req.query.sort === "oldest" ? 1 : -1;
  const filter = buildLeadFilter(req.query);

  const [leads, total] = await Promise.all([
    Lead.find(filter).populate("owner", "name email").sort({ createdAt: sortDirection }).skip(skip).limit(limit),
    Lead.countDocuments(filter)
  ]);

  return sendSuccess(res, {
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1
    }
  });
};

export const getLeadById = async (req: Request, res: Response): Promise<Response> => {
  const lead = await Lead.findById(req.params.id).populate("owner", "name email");
  if (!lead) throw new AppError("Lead not found", 404);
  return sendSuccess(res, { lead });
};

export const createLead = async (req: Request, res: Response): Promise<Response> => {
  const lead = await Lead.create({ ...req.body, owner: req.user?.userId || undefined });
  return sendSuccess(res, { lead }, "Lead created", 201);
};

export const updateLead = async (req: Request, res: Response): Promise<Response> => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!lead) throw new AppError("Lead not found", 404);
  return sendSuccess(res, { lead }, "Lead updated");
};

export const deleteLead = async (req: Request, res: Response): Promise<Response> => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw new AppError("Lead not found", 404);
  return sendSuccess(res, { id: req.params.id }, "Lead deleted");
};

export const exportLeadsCsv = async (req: Request, res: Response): Promise<void> => {
  const leads = await Lead.find(buildLeadFilter(req.query)).sort({ createdAt: -1 }).lean();
  const escapeCsv = (value: unknown): string => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const header = ["Name", "Email", "Status", "Source", "Created At"];
  const rows = leads.map((lead) => [
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    new Date(lead.createdAt).toISOString()
  ]);

  const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
  res.header("Content-Type", "text/csv");
  res.attachment(`leads-${Date.now()}.csv`);
  res.send(csv);
};

