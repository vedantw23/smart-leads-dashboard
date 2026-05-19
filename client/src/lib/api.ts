import type { ApiEnvelope, Lead, LeadFilters, Pagination, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

interface AuthResponse {
  user: User;
  token: string;
}

interface LeadsResponse {
  leads: Lead[];
  pagination: Pagination;
}

const getToken = (): string | null => localStorage.getItem("smart-leads-token");

const authHeaders = (headersInit?: HeadersInit, includeJson = true): Headers => {
  const headers = new Headers(headersInit);
  if (includeJson) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers = authHeaders(options.headers);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const json = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok) throw new Error(json.message || "Something went wrong");
  return json.data;
};

const buildLeadQuery = (filters: LeadFilters): string => {
  const params = new URLSearchParams({
    sort: filters.sort,
    page: String(filters.page),
    limit: "10"
  });
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.search) params.set("search", filters.search);
  return params.toString();
};

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (payload: { name: string; email: string; password: string; role: "admin" | "sales" }) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request<{ user: User }>("/auth/me"),
  getLeads: (filters: LeadFilters) => request<LeadsResponse>(`/leads?${buildLeadQuery(filters)}`),
  createLead: (lead: Omit<Lead, "_id" | "createdAt" | "updatedAt">) =>
    request<{ lead: Lead }>("/leads", { method: "POST", body: JSON.stringify(lead) }),
  updateLead: (id: string, lead: Partial<Omit<Lead, "_id" | "createdAt" | "updatedAt">>) =>
    request<{ lead: Lead }>(`/leads/${id}`, { method: "PATCH", body: JSON.stringify(lead) }),
  deleteLead: (id: string) => request<{ id: string }>(`/leads/${id}`, { method: "DELETE" }),
  exportCsv: async (filters: LeadFilters) => {
    const response = await fetch(`${API_URL}/leads/export?${buildLeadQuery(filters)}`, { headers: authHeaders(undefined, false) });
    if (!response.ok) throw new Error("Unable to export CSV");
    return response.blob();
  },
  token: getToken
};
