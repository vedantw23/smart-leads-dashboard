import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isCheckingAuth: boolean;
  login(email: string, password: string): Promise<void>;
  register(payload: { name: string; email: string; password: string; role: "admin" | "sales" }): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("smart-leads-token"));
  const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;
    api
      .me()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("smart-leads-token");
        setToken(null);
      })
      .finally(() => setIsCheckingAuth(false));
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isCheckingAuth,
      async login(email, password) {
        const data = await api.login(email, password);
        localStorage.setItem("smart-leads-token", data.token);
        setToken(data.token);
        setUser(data.user);
      },
      async register(payload) {
        const data = await api.register(payload);
        localStorage.setItem("smart-leads-token", data.token);
        setToken(data.token);
        setUser(data.user);
      },
      logout() {
        localStorage.removeItem("smart-leads-token");
        setToken(null);
        setUser(null);
      }
    }),
    [isCheckingAuth, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
