// src/components/common/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchUser } from "../../store/userSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
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
    return <Navigate to="/admin/signin" replace />;
  }

  return <>{children}</>;
}
