// src/components/common/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  // If no token, redirect to sign-in
  if (!token) {
    return <Navigate to="/admin/signin" replace />;
  }

  return <>{children}</>;
}
