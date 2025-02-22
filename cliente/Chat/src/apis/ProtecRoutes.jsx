import { Navigate, Outlet } from "react-router-dom";
import { useMyContext } from "../context/Context";

export function ProtecRoutes() {
  const { isAuthenticated, loading } = useMyContext();
  console.log(`Valor de isAuthenticated: ${isAuthenticated} `)
  if (loading) {
    return <h1>Loading</h1>;
  }
  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/authLogin" />;
}
