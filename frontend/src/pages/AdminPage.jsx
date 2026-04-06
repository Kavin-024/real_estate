import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function AdminPage() {
  const { seller, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("sellers");
  const [sellers, setSellers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, p] = await Promise.all([
          API.get("/admin/sellers"),
          API.get("/admin/properties"),
        ]);
        setSellers(s.data.sellers);
        setProperties(p.data.properties);
      } catch (err) {
        alert("Failed to load admin data");
      } finally {
        setLoadingData(false);
      }
    };
    fetchAll();
  }, []);

  const handleDeleteSeller = async (id) => {
    if (!window.confirm("Delete this seller and all their listings?")) return;
    try {
      await API.delete(`/admin/sellers/${id}`);
      setSellers((prev) => prev.filter((s) => s._id !== id));
      setProperties((prev) => prev.filter((p) => p.seller?._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await API.delete(`/admin/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loadingData) return <div style={s.center}>Loading admin data...</div>;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.title}>⚙️ Admin Panel</h1>
        <div style={s.headerRight}>
          <span style={s.adminBadge}>Admin: {seller?.name}</span>
          <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statNum}>{sellers.length}</div>
          <div style={s.statLabel}>Total Sellers</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statNum}>{properties.length}</div>
          <div style={s.statLabel}>Total Listings</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statNum}>{properties.filter(p => p.isAvailable).length}</div>
          <div style={s.statLabel}>Available</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        <button
          onClick={() => setTab("sellers")}
          style={{ ...s.tab, ...(tab === "sellers" ? s.tabActive : {}) }}
        >
          Sellers ({sellers.length})
        </button>
        <button
          onClick={() => setTab("properties")}
          style={{ ...s.tab, ...(tab === "properties" ? s.tabActive : {}) }}
        >
          Properties ({properties.length})
        </button>
      </div>

      {/* Sellers Table */}
      {tab === "sellers" && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Name</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Phone</th>
                <th style={s.th}>Role</th>
                <th style={s.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((sel) => (
                <tr key={sel._id} style={s.tr}>
                  <td style={s.td}>{sel.name}</td>
                  <td style={s.td}>{sel.email}</td>
                  <td style={s.td}>{sel.phone}</td>
                  <td style={s.td}>
                    <span style={sel.isAdmin ? s.badgeAdmin : s.badgeSeller}>
                      {sel.isAdmin ? "Admin" : "Seller"}
                    </span>
                  </td>
                  <td style={s.td}>
                    {!sel.isAdmin && (
                      <button
                        onClick={() => handleDeleteSeller(sel._id)}
                        style={s.deleteBtn}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Properties Table */}
      {tab === "properties" && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Title</th>
                <th style={s.th}>Seller</th>
                <th style={s.th}>District</th>
                <th style={s.th}>Type</th>
                <th style={s.th}>Price (₹)</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop._id} style={s.tr}>
                  <td style={s.td}>{prop.title}</td>
                  <td style={s.td}>{prop.seller?.name || "—"}</td>
                  <td style={s.td}>{prop.location?.district}</td>
                  <td style={s.td}>{prop.landType}</td>
                  <td style={s.td}>{prop.price?.total?.toLocaleString("en-IN")}</td>
                  <td style={s.td}>
                    <span style={prop.isAvailable ? s.badgeAdmin : s.badgeSeller}>
                      {prop.isAvailable ? "Available" : "Sold"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button
                      onClick={() => handleDeleteProperty(prop._id)}
                      style={s.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: "30px", fontFamily: "sans-serif", maxWidth: "1100px", margin: "0 auto" },
  center: { display: "flex", justifyContent: "center", padding: "60px", fontSize: "16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { margin: 0, fontSize: "26px", color: "#1a202c" },
  headerRight: { display: "flex", alignItems: "center", gap: "12px" },
  adminBadge: { fontSize: "14px", color: "#4a5568" },
  logoutBtn: { padding: "8px 16px", background: "#e53e3e", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  statsRow: { display: "flex", gap: "16px", marginBottom: "28px" },
  statCard: { flex: 1, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", textAlign: "center" },
  statNum: { fontSize: "32px", fontWeight: "700", color: "#2b6cb0" },
  statLabel: { fontSize: "13px", color: "#718096", marginTop: "4px" },
  tabs: { display: "flex", gap: "10px", marginBottom: "20px" },
  tab: { padding: "10px 24px", background: "#e2e8f0", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "500" },
  tabActive: { background: "#2b6cb0", color: "#fff" },
  tableWrap: { overflowX: "auto", background: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f7fafc" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#4a5568", borderBottom: "1px solid #e2e8f0" },
  tr: { borderBottom: "1px solid #f0f4f8" },
  td: { padding: "12px 16px", fontSize: "14px", color: "#2d3748" },
  badgeAdmin: { background: "#c6f6d5", color: "#276749", padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" },
  badgeSeller: { background: "#fed7d7", color: "#9b2c2c", padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" },
  deleteBtn: { padding: "5px 14px", background: "#e53e3e", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "13px" },
};