// src/components/common/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchUser } from "../../store/userSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = "/admin/signin" }: ProtectedRouteProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.user);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!user && !loading && !requestedRef.current) {
      requestedRef.current = true;
      dispatch(fetchUser());
    }
  }, [user, loading, dispatch]);

  if (loading) {
    return null;
  }

  if (!user) {
    if (!requestedRef.current) {
      return null;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
