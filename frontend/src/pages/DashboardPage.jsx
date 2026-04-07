import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function DashboardPage() {
  const { seller, logout } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const res = await API.get("/properties/my/listings");
      setProperties(res.data.properties);
    } catch (err) {
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await API.delete(`/properties/${id}`);
      setProperties(properties.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete property");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Welcome, {seller?.name}</h2>
          <p style={styles.subtitle}>{seller?.email}</p>
        </div>
        <div style={styles.headerButtons}>
          <button onClick={() => navigate("/add-property")} style={styles.addBtn}>
            + Add Property
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* Listings */}
      <div style={styles.content}>
        <h3 style={styles.sectionTitle}>Your Listings ({properties.length})</h3>

        {loading && <p style={styles.info}>Loading properties...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {!loading && properties.length === 0 && (
          <div style={styles.emptyBox}>
            <p>You have no listings yet.</p>
            <button onClick={() => navigate("/add-property")} style={styles.addBtn}>
              Post your first property
            </button>
          </div>
        )}

        <div style={styles.grid}>
          {properties.map((p) => (
            <div key={p._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.badge}>{p.landType}</span>
                <span style={p.isAvailable ? styles.available : styles.sold}>
                  {p.isAvailable ? "Available" : "Sold"}
                </span>
              </div>
              <h4 style={styles.cardTitle}>{p.title}</h4>
              <p style={styles.cardText}>
                {p.area.value} {p.area.unit} — {p.location.district}, {p.location.state}
              </p>
              <p style={styles.cardPrice}>₹ {p.price.total.toLocaleString("en-IN")}</p>
              <p style={styles.cardDesc}>{p.description.slice(0, 80)}...</p>
              <div style={styles.cardActions}>
                <button onClick={() => navigate(`/edit-property/${p._id}`)} style={styles.editBtn}>
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Inter', sans-serif",
    color: "#1e293b",
  },

  header: {
    background: "#ffffff",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
  },

  subtitle: {
    marginTop: "4px",
    fontSize: "13px",
    color: "#64748b",
  },

  headerButtons: {
    display: "flex",
    gap: "12px",
  },

  addBtn: {
    padding: "10px 18px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
  },

  logoutBtn: {
    padding: "10px 18px",
    background: "#fff",
    color: "#ef4444",
    border: "1px solid #ef4444",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  content: {
    padding: "40px",
    maxWidth: "1300px",
    margin: "auto",
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  info: {
    color: "#64748b",
  },

  error: {
    color: "#ef4444",
  },

  emptyBox: {
    textAlign: "center",
    padding: "60px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  badge: {
    padding: "4px 10px",
    background: "#e0f2fe",
    color: "#0284c7",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  available: {
    fontSize: "12px",
    color: "#16a34a",
    fontWeight: "600",
  },

  sold: {
    fontSize: "12px",
    color: "#ef4444",
    fontWeight: "600",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "6px",
  },

  cardText: {
    fontSize: "13px",
    color: "#64748b",
  },

  cardPrice: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#2563eb",
    margin: "10px 0",
  },

  cardDesc: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "16px",
    lineHeight: "1.5",
  },

  cardActions: {
    display: "flex",
    gap: "10px",
  },

  editBtn: {
    flex: 1,
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  deleteBtn: {
    flex: 1,
    padding: "10px",
    background: "#fee2e2",
    color: "#ef4444",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
};