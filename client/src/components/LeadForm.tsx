import { useEffect, useState } from "react";
import { Button } from "./Button";
import type { Lead, LeadSource, LeadStatus } from "../types";

interface Props {
  lead?: Lead | null;
  onSubmit(payload: { name: string; email: string; status: LeadStatus; source: LeadSource; notes?: string }): Promise<void>;
  onCancel(): void;
}

const initialForm = { name: "", email: "", status: "New" as LeadStatus, source: "Website" as LeadSource, notes: "" };

export const LeadForm = ({ lead, onSubmit, onCancel }: Props) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(
      lead
        ? { name: lead.name, email: lead.email, status: lead.status, source: lead.source, notes: lead.notes ?? "" }
        : initialForm
    );
    setError("");
  }, [lead]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await onSubmit({ ...form, notes: form.notes || undefined });
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save lead");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink dark:text-white">{lead ? "Edit lead" : "Add lead"}</h2>
        <button type="button" onClick={onCancel} className="text-sm font-medium text-slate-500 hover:text-ink dark:hover:text-white">
          Close
        </button>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Name
          <input className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-900" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Email
          <input type="email" className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-900" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Status
          <select className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-900" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as LeadStatus })}>
            {["New", "Contacted", "Qualified", "Lost"].map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Source
          <select className="mt-1 h-10 w-full rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-900" value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value as LeadSource })}>
            {["Website", "Instagram", "Referral"].map((source) => <option key={source}>{source}</option>)}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        Notes
        <textarea className="mt-1 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
      </label>

      <Button disabled={isSaving} type="submit">{isSaving ? "Saving..." : "Save lead"}</Button>
    </form>
  );
};
