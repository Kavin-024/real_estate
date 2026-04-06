import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { seller, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!seller) return <Navigate to="/login" replace />;
  if (!seller.isAdmin) return <Navigate to="/dashboard" replace />; // sellers go back to dashboard

  return children;
}