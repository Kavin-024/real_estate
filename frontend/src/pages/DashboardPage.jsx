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
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8" },
  header: {
    backgroundColor: "#fff",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  title: { margin: 0, fontSize: "22px", fontWeight: "600", color: "#1a202c" },
  subtitle: { margin: "4px 0 0", fontSize: "13px", color: "#718096" },
  headerButtons: { display: "flex", gap: "12px" },
  addBtn: {
    padding: "10px 20px", backgroundColor: "#2b6cb0", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
  },
  logoutBtn: {
    padding: "10px 20px", backgroundColor: "#fff", color: "#e53e3e",
    border: "1px solid #e53e3e", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
  },
  content: { padding: "30px 40px" },
  sectionTitle: { fontSize: "18px", fontWeight: "600", color: "#2d3748", marginBottom: "20px" },
  info: { color: "#718096" },
  error: { color: "#e53e3e" },
  emptyBox: {
    textAlign: "center", padding: "60px", backgroundColor: "#fff",
    borderRadius: "12px", color: "#718096",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  card: {
    backgroundColor: "#fff", borderRadius: "12px",
    padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  badge: {
    padding: "3px 10px", backgroundColor: "#ebf8ff", color: "#2b6cb0",
    borderRadius: "20px", fontSize: "12px", fontWeight: "500", textTransform: "capitalize",
  },
  available: { fontSize: "12px", color: "#38a169", fontWeight: "500" },
  sold: { fontSize: "12px", color: "#e53e3e", fontWeight: "500" },
  cardTitle: { margin: "0 0 6px", fontSize: "16px", fontWeight: "600", color: "#2d3748" },
  cardText: { margin: "0 0 4px", fontSize: "13px", color: "#718096" },
  cardPrice: { margin: "0 0 8px", fontSize: "16px", fontWeight: "700", color: "#2b6cb0" },
  cardDesc: { margin: "0 0 16px", fontSize: "13px", color: "#718096", lineHeight: "1.5" },
  cardActions: { display: "flex", gap: "10px" },
  editBtn: {
    flex: 1, padding: "8px", backgroundColor: "#ebf8ff", color: "#2b6cb0",
    border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
  },
  deleteBtn: {
    flex: 1, padding: "8px", backgroundColor: "#fff5f5", color: "#e53e3e",
    border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
  },
};