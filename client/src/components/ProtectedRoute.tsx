import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = () => {
  const { token, isCheckingAuth } = useAuth();
  if (isCheckingAuth) return <div className="grid min-h-screen place-items-center bg-slate-50 text-ink">Checking session...</div>;
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
