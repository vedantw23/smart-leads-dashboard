import { useEffect, useMemo, useState } from "react";
import { Download, LogOut, Moon, Plus, Search, Sun, Trash2, Pencil } from "lucide-react";
import { Button } from "../components/Button";
import { LeadForm } from "../components/LeadForm";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { api } from "../lib/api";
import type { Lead, LeadFilters, LeadSource, LeadStatus, Pagination } from "../types";

const defaultFilters: LeadFilters = { status: "", source: "", search: "", sort: "latest", page: 1 };

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState(defaultFilters);
  const [searchInput, setSearchInput] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("smart-leads-theme") === "dark");
  const debouncedSearch = useDebounce(searchInput);

  useEffect(() => {
    setFilters((current) => ({ ...current, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("smart-leads-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const fetchLeads = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await api.getLeads(filters);
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load leads");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const stats = useMemo(() => {
    return ["New", "Contacted", "Qualified", "Lost"].map((status) => ({
      status,
      count: leads.filter((lead) => lead.status === status).length
    }));
  }, [leads]);

  const saveLead = async (payload: { name: string; email: string; status: LeadStatus; source: LeadSource; notes?: string }) => {
    if (selectedLead) await api.updateLead(selectedLead._id, payload);
    else await api.createLead(payload);
    setIsFormOpen(false);
    setSelectedLead(null);
    await fetchLeads();
  };

  const removeLead = async (lead: Lead) => {
    if (!window.confirm(`Delete ${lead.name}?`)) return;
    await api.deleteLead(lead._id);
    await fetchLeads();
  };

  const exportCsv = async () => {
    try {
      const blob = await api.exportCsv(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "leads.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to export CSV");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-ink dark:bg-slate-950 dark:text-white">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-meadow">Smart Leads Dashboard</p>
            <h1 className="text-2xl font-bold">Lead pipeline</h1>
          </div>
          <div className="flex items-center gap-2">
            <button title="Toggle dark mode" onClick={() => setDarkMode((value) => !value)} className="grid h-10 w-10 place-items-center rounded-md border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Button variant="secondary" onClick={logout}><LogOut size={16} />Logout</Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.status} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.status}</p>
              <p className="mt-2 text-3xl font-bold">{item.count}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-64 flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search name or email" className="h-10 w-full rounded-md border border-slate-300 pl-10 pr-3 dark:border-slate-700 dark:bg-slate-950" />
            </div>
            <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value as LeadFilters["status"], page: 1 })} className="h-10 rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-950">
              <option value="">All statuses</option>
              {["New", "Contacted", "Qualified", "Lost"].map((status) => <option key={status}>{status}</option>)}
            </select>
            <select value={filters.source} onChange={(event) => setFilters({ ...filters, source: event.target.value as LeadFilters["source"], page: 1 })} className="h-10 rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-950">
              <option value="">All sources</option>
              {["Website", "Instagram", "Referral"].map((source) => <option key={source}>{source}</option>)}
            </select>
            <select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value as LeadFilters["sort"], page: 1 })} className="h-10 rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-950">
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
            <Button variant="secondary" onClick={exportCsv}><Download size={16} />CSV</Button>
            <Button onClick={() => { setSelectedLead(null); setIsFormOpen(true); }}><Plus size={16} />Lead</Button>
          </div>
        </div>

        {isFormOpen && <LeadForm lead={selectedLead} onSubmit={saveLead} onCancel={() => setIsFormOpen(false)} />}

        {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{error}</p>}

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">Loading leads...</td></tr>}
                {!isLoading && leads.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">No leads match these filters.</td></tr>}
                {!isLoading && leads.map((lead) => (
                  <tr key={lead._id} className="align-top">
                    <td className="px-4 py-4">
                      <p className="font-semibold">{lead.name}</p>
                      <p className="text-sm text-slate-500">{lead.email}</p>
                      {lead.notes && <p className="mt-1 max-w-md text-sm text-slate-500">{lead.notes}</p>}
                    </td>
                    <td className="px-4 py-4"><span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">{lead.status}</span></td>
                    <td className="px-4 py-4">{lead.source}</td>
                    <td className="px-4 py-4 text-sm text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button title="Edit lead" onClick={() => { setSelectedLead(lead); setIsFormOpen(true); }} className="grid h-9 w-9 place-items-center rounded-md border border-slate-300 dark:border-slate-700"><Pencil size={16} /></button>
                        {user?.role === "admin" && <button title="Delete lead" onClick={() => removeLead(lead)} className="grid h-9 w-9 place-items-center rounded-md border border-red-200 text-coral dark:border-red-900"><Trash2 size={16} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
            <span>Page {pagination?.page ?? 1} of {pagination?.totalPages || 1} · {pagination?.total ?? 0} leads</span>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={!pagination?.hasPreviousPage} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Previous</Button>
              <Button variant="secondary" disabled={!pagination?.hasNextPage} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
