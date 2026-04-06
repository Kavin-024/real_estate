import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { seller } = useAuth();

  if (!seller) {
    return <Navigate to="/login" replace />;
  }

  return children;
}