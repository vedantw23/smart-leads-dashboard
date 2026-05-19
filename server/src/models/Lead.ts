import { Schema, model, Types } from "mongoose";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: ["New", "Contacted", "Qualified", "Lost"], default: "New" },
    source: { type: String, enum: ["Website", "Instagram", "Referral"], required: true },
    notes: { type: String, trim: true, maxlength: 1000 },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

leadSchema.index({ name: "text", email: "text" });
leadSchema.index({ status: 1, source: 1, createdAt: -1 });

export const Lead = model<ILead>("Lead", leadSchema);
