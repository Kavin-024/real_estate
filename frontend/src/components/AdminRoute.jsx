import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { seller, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loaderCard}>
          <div style={styles.spinner}></div>
          <p style={styles.text}>Checking access...</p>
        </div>
      </div>
    );
  }

  if (!seller) return <Navigate to="/login" replace />;
  if (!seller.isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    fontFamily: "'Inter', sans-serif",
  },

  loaderCard: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    margin: "0 auto 15px",
    animation: "spin 1s linear infinite",
  },

  text: {
    fontSize: "14px",
    color: "#64748b",
  },
};