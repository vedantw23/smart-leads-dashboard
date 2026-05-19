import { z } from "zod";

export const leadStatusSchema = z.enum(["New", "Contacted", "Qualified", "Lost"]);
export const leadSourceSchema = z.enum(["Website", "Instagram", "Referral"]);

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().toLowerCase(),
    status: leadStatusSchema.default("New"),
    source: leadSourceSchema,
    notes: z.string().trim().max(1000).optional()
  })
});

export const updateLeadSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    email: z.string().trim().email().toLowerCase().optional(),
    status: leadStatusSchema.optional(),
    source: leadSourceSchema.optional(),
    notes: z.string().trim().max(1000).optional()
  })
});

export const leadQuerySchema = z.object({
  query: z.object({
    status: leadStatusSchema.optional(),
    source: leadSourceSchema.optional(),
    search: z.string().trim().max(80).optional(),
    sort: z.enum(["latest", "oldest"]).default("latest"),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(10).default(10)
  })
});
