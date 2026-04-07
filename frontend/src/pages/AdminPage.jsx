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
      } catch {
        alert("Failed to load admin data");
      } finally {
        setLoadingData(false);
      }
    };
    fetchAll();
  }, []);

  const handleDeleteSeller = async (id) => {
    if (!window.confirm("Delete this seller and all their listings?")) return;
    await API.delete(`/admin/sellers/${id}`);
    setSellers((prev) => prev.filter((s) => s._id !== id));
    setProperties((prev) => prev.filter((p) => p.seller?._id !== id));
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    await API.delete(`/admin/properties/${id}`);
    setProperties((prev) => prev.filter((p) => p._id !== id));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loadingData) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={styles.headerRight}>
          <span style={styles.admin}>👤 {seller?.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.card}>
          <h2>{sellers.length}</h2>
          <p>Total Sellers</p>
        </div>
        <div style={styles.card}>
          <h2>{properties.length}</h2>
          <p>Total Listings</p>
        </div>
        <div style={styles.card}>
          <h2>{properties.filter(p => p.isAvailable).length}</h2>
          <p>Available</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={tab === "sellers" ? styles.activeTab : styles.tab}
          onClick={() => setTab("sellers")}
        >
          Sellers
        </button>
        <button
          style={tab === "properties" ? styles.activeTab : styles.tab}
          onClick={() => setTab("properties")}
        >
          Properties
        </button>
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {tab === "sellers" ? (
                <>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </>
              ) : (
                <>
                  <th>Title</th>
                  <th>Seller</th>
                  <th>District</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {(tab === "sellers" ? sellers : properties).map((item) => (
              <tr key={item._id}>
                {tab === "sellers" ? (
                  <>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>
                      <span style={item.isAdmin ? styles.adminBadge : styles.userBadge}>
                        {item.isAdmin ? "Admin" : "Seller"}
                      </span>
                    </td>
                    <td>
                      {!item.isAdmin && (
                        <button onClick={() => handleDeleteSeller(item._id)} style={styles.deleteBtn}>
                          Delete
                        </button>
                      )}
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.title}</td>
                    <td>{item.seller?.name}</td>
                    <td>{item.location?.district}</td>
                    <td>{item.landType}</td>
                    <td>₹ {item.price?.total?.toLocaleString("en-IN")}</td>
                    <td>
                      <span style={item.isAvailable ? styles.available : styles.sold}>
                        {item.isAvailable ? "Available" : "Sold"}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteProperty(item._id)} style={styles.deleteBtn}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    background: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    padding: "60px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "800",
  },

  headerRight: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  admin: {
    fontSize: "14px",
    color: "#475569",
  },

  logoutBtn: {
    padding: "8px 14px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  stats: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  tab: {
    padding: "10px 20px",
    background: "#e2e8f0",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  activeTab: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  tableWrap: {
    background: "#fff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  deleteBtn: {
    padding: "6px 12px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  adminBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 10px",
    borderRadius: "999px",
  },

  userBadge: {
    background: "#e0f2fe",
    color: "#0284c7",
    padding: "4px 10px",
    borderRadius: "999px",
  },

  available: {
    color: "#16a34a",
    fontWeight: "600",
  },

  sold: {
    color: "#ef4444",
    fontWeight: "600",
  },
};