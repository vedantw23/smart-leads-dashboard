import { useState } from "react";
import { Navigate } from "react-router-dom";
import { BarChart3, LockKeyhole } from "lucide-react";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";

export const AuthPage = () => {
  const { login, register, token } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "sales" as "admin" | "sales" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (token) return <Navigate to="/" replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-100 text-ink lg:grid-cols-[0.9fr_1.1fr] dark:bg-slate-950 dark:text-white">
      <section className="flex flex-col justify-between bg-ink p-8 text-white lg:p-12">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-meadow"><BarChart3 size={24} /></span>
          <span className="text-xl font-bold">Smart Leads</span>
        </div>
        <div className="max-w-lg py-16">
          <h1 className="text-4xl font-bold leading-tight lg:text-5xl">Lead management that feels crisp from first login.</h1>
          <p className="mt-5 text-base leading-7 text-slate-300">
            Track prospects, filter every pipeline view, and export clean CSV reports with role-aware controls.
          </p>
        </div>
        <p className="text-sm text-slate-400">Demo seed: admin@smartleads.dev / Password123</p>
      </section>

      <section className="grid place-items-center p-6">
        <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-meadow">{mode === "login" ? "Welcome back" : "Create account"}</p>
              <h2 className="mt-1 text-2xl font-bold">{mode === "login" ? "Log in" : "Register"}</h2>
            </div>
            <LockKeyhole className="text-slate-400" />
          </div>

          {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">{error}</p>}

          <div className="space-y-4">
            {mode === "register" && (
              <label className="block text-sm font-medium">
                Name
                <input className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-950" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
            )}
            <label className="block text-sm font-medium">
              Email
              <input type="email" className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-950" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input type="password" className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-950" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            </label>
            {mode === "register" && (
              <label className="block text-sm font-medium">
                Role
                <select className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 dark:border-slate-700 dark:bg-slate-950" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as "admin" | "sales" })}>
                  <option value="sales">Sales User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            )}
          </div>

          <Button className="mt-6 w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </Button>

          <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-4 w-full text-sm font-semibold text-meadow">
            {mode === "login" ? "Need an account? Register" : "Already registered? Log in"}
          </button>
        </form>
      </section>
    </main>
  );
};
