import { Navigate, Outlet } from "react-router-dom";
import { useMyContext } from "../context/Context";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ProtecRoutes2() {
  const { isAuthenticated, loading, checkAuth } = useMyContext();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return <h1>Loading</h1>;
  }
  if (!isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
}

export function ProtecRoutes() {
  const { isAuthenticated, loading, checkAuth } = useMyContext();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return <h1>Loading</h1>;
  }
  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/authLogin" />;
}
