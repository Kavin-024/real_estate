import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function HomePage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    landType: "",
    district: "",
    maxPrice: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  const fetchProperties = async () => {
    try {
      const res = await API.get("/properties");
      setProperties(res.data.properties);
      setFiltered(res.data.properties);
    } catch (err) {
      console.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...properties];
    if (filters.landType) {
      result = result.filter((p) => p.landType === filters.landType);
    }
    if (filters.district) {
      result = result.filter((p) =>
        p.location.district.toLowerCase().includes(filters.district.toLowerCase())
      );
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price.total <= Number(filters.maxPrice));
    }
    setFiltered(result);
  };

  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ landType: "", district: "", maxPrice: "" });
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo}>🏡 RealEstate</h1>
        <div style={styles.navButtons}>
          <button onClick={() => navigate("/login")} style={styles.loginBtn}>
            Seller Login
          </button>
          <button onClick={() => navigate("/register")} style={styles.registerBtn}>
            Register as Seller
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>Find Your Perfect Land</h2>
        <p style={styles.heroSubtitle}>
          Browse verified land listings across Tamil Nadu
        </p>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <select name="landType" value={filters.landType} onChange={handleFilter} style={styles.filterInput}>
          <option value="">All Types</option>
          <option value="residential">Residential</option>
          <option value="agricultural">Agricultural</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
        </select>
        <input
          name="district"
          value={filters.district}
          onChange={handleFilter}
          placeholder="Search by district..."
          style={styles.filterInput}
        />
        <input
          name="maxPrice"
          type="number"
          value={filters.maxPrice}
          onChange={handleFilter}
          placeholder="Max price (₹)"
          style={styles.filterInput}
        />
        <button onClick={clearFilters} style={styles.clearBtn}>
          Clear
        </button>
      </div>

      {/* Results count */}
      <div style={styles.content}>
        <p style={styles.resultCount}>
          {loading ? "Loading..." : `${filtered.length} properties found`}
        </p>

        {/* Grid */}
        {!loading && filtered.length === 0 && (
          <div style={styles.empty}>No properties found matching your filters.</div>
        )}

        <div style={styles.grid}>
          {filtered.map((p) => (
            <div
              key={p._id}
              style={styles.card}
              onClick={() => navigate(`/property/${p._id}`)}
            >
              <div style={styles.cardTop}>
                <span style={styles.badge}>{p.landType}</span>
                {p.price.isNegotiable && (
                  <span style={styles.negotiable}>Negotiable</span>
                )}
              </div>
              <h3 style={styles.cardTitle}>{p.title}</h3>
              <p style={styles.cardLocation}>
                📍 {p.location.district}, {p.location.state}
              </p>
              <p style={styles.cardArea}>
                📐 {p.area.value} {p.area.unit}
              </p>
              <p style={styles.cardPrice}>
                ₹ {p.price.total.toLocaleString("en-IN")}
              </p>
              <div style={styles.cardFeatures}>
                {p.features.electricity && <span style={styles.tag}>⚡ Electricity</span>}
                {p.features.roadAccess && <span style={styles.tag}>🛣️ Road Access</span>}
                {p.features.waterSource !== "none" && (
                  <span style={styles.tag}>💧 {p.features.waterSource}</span>
                )}
              </div>
              <button style={styles.viewBtn}>View Details →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8" },
  navbar: {
    backgroundColor: "#fff",
    padding: "16px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  logo: { margin: 0, fontSize: "22px", fontWeight: "700", color: "#2b6cb0" },
  navButtons: { display: "flex", gap: "12px" },
  loginBtn: {
    padding: "8px 18px", backgroundColor: "#fff", color: "#2b6cb0",
    border: "1px solid #2b6cb0", borderRadius: "8px", fontSize: "14px",
    fontWeight: "600", cursor: "pointer",
  },
  registerBtn: {
    padding: "8px 18px", backgroundColor: "#2b6cb0", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "14px",
    fontWeight: "600", cursor: "pointer",
  },
  hero: {
    backgroundColor: "#2b6cb0",
    padding: "50px 40px",
    textAlign: "center",
  },
  heroTitle: { margin: "0 0 10px", fontSize: "32px", fontWeight: "700", color: "#fff" },
  heroSubtitle: { margin: 0, fontSize: "16px", color: "#bee3f8" },
  filterBar: {
    backgroundColor: "#fff",
    padding: "16px 40px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    flexWrap: "wrap",
  },
  filterInput: {
    padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0",
    fontSize: "14px", outline: "none", minWidth: "160px",
  },
  clearBtn: {
    padding: "9px 16px", backgroundColor: "#f7fafc", border: "1px solid #e2e8f0",
    borderRadius: "8px", fontSize: "14px", cursor: "pointer", color: "#4a5568",
  },
  content: { padding: "24px 40px" },
  resultCount: { fontSize: "14px", color: "#718096", marginBottom: "16px" },
  empty: {
    textAlign: "center", padding: "60px", backgroundColor: "#fff",
    borderRadius: "12px", color: "#718096",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff", borderRadius: "12px", padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)", cursor: "pointer",
    transition: "transform 0.2s",
  },
  cardTop: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  badge: {
    padding: "3px 10px", backgroundColor: "#ebf8ff", color: "#2b6cb0",
    borderRadius: "20px", fontSize: "12px", fontWeight: "500", textTransform: "capitalize",
  },
  negotiable: {
    padding: "3px 10px", backgroundColor: "#f0fff4", color: "#38a169",
    borderRadius: "20px", fontSize: "12px", fontWeight: "500",
  },
  cardTitle: { margin: "0 0 8px", fontSize: "16px", fontWeight: "600", color: "#2d3748" },
  cardLocation: { margin: "0 0 4px", fontSize: "13px", color: "#718096" },
  cardArea: { margin: "0 0 4px", fontSize: "13px", color: "#718096" },
  cardPrice: { margin: "8px 0", fontSize: "18px", fontWeight: "700", color: "#2b6cb0" },
  cardFeatures: { display: "flex", gap: "6px", flexWrap: "wrap", margin: "8px 0 12px" },
  tag: {
    padding: "3px 8px", backgroundColor: "#f7fafc", border: "1px solid #e2e8f0",
    borderRadius: "6px", fontSize: "11px", color: "#4a5568",
  },
  viewBtn: {
    width: "100%", padding: "9px", backgroundColor: "#2b6cb0", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer",
  },
};