export type UserRole = "admin" | "sales";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";
export type SortOrder = "latest" | "oldest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface LeadFilters {
  status: "" | LeadStatus;
  source: "" | LeadSource;
  search: string;
  sort: SortOrder;
  page: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}
