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
        <div>
          <button onClick={() => navigate("/login")} style={styles.loginBtn}>
            Seller Login
          </button>
          <button onClick={() => navigate("/register")} style={styles.registerBtn}>
            Register
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>Discover Premium Lands</h2>
        <p style={styles.heroSubtitle}>Explore verified properties across Tamil Nadu</p>

        {/* Filters */}
        <div style={styles.filterBox}>
          <select name="landType" value={filters.landType} onChange={handleFilter} style={styles.input}>
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
            placeholder="Search district..."
            style={styles.input}
          />

          <input
            name="maxPrice"
            type="number"
            value={filters.maxPrice}
            onChange={handleFilter}
            placeholder="Max Price"
            style={styles.input}
          />

          <button onClick={clearFilters} style={styles.clearBtn}>
            Clear
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h3 style={styles.result}>
          {loading ? "Loading..." : `${filtered.length} Properties Found`}
        </h3>

        {filtered.length === 0 && !loading && (
          <div style={styles.empty}>
            No properties found matching your filters.
          </div>
        )}

        <div style={styles.grid}>
          {filtered.map((p) => (
            <div
              key={p._id}
              style={styles.card}
              onClick={() => navigate(`/property/${p._id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div style={styles.cardHeader}>
                <span>{p.landType}</span>
                {p.price.isNegotiable && <span style={styles.neg}>Negotiable</span>}
              </div>

              <h3 style={styles.title}>{p.title}</h3>
              <p style={styles.text}>📍 {p.location.district}</p>
              <p style={styles.text}>📐 {p.area.value} {p.area.unit}</p>

              <h2 style={styles.price}>₹ {p.price.total.toLocaleString("en-IN")}</h2>

              <button style={styles.btn}>View Details</button>
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

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 40px",
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  logo: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#2563eb",
  },

  loginBtn: {
    marginRight: "10px",
    padding: "8px 18px",
    background: "#fff",
    border: "1px solid #2563eb",
    color: "#2563eb",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  registerBtn: {
    padding: "8px 18px",
    background: "#2563eb",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  hero: {
    background: "linear-gradient(to right, #2563eb, #3b82f6)",
    padding: "70px 20px 100px",
    textAlign: "center",
    color: "#fff",
  },

  heroTitle: {
    fontSize: "40px",
    fontWeight: "800",
  },

  heroSubtitle: {
    marginTop: "10px",
    fontSize: "16px",
    opacity: 0.9,
  },

  filterBox: {
    marginTop: "-40px",
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    maxWidth: "1000px",
    marginInline: "auto",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    minWidth: "180px",
    fontSize: "14px",
    outline: "none",
  },

  clearBtn: {
    padding: "12px 16px",
    background: "#f1f5f9",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500",
  },

  content: {
    padding: "40px",
    maxWidth: "1300px",
    margin: "auto",
  },

  result: {
    marginBottom: "20px",
    fontSize: "15px",
    color: "#64748b",
  },

  empty: {
    background: "#ffffff",
    padding: "60px",
    textAlign: "center",
    borderRadius: "16px",
    color: "#64748b",
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },

  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "12px",
  },

  neg: {
    color: "#16a34a",
    fontWeight: "600",
  },

  title: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "6px",
  },

  text: {
    fontSize: "13px",
    color: "#64748b",
  },

  price: {
    marginTop: "10px",
    fontSize: "20px",
    fontWeight: "800",
    color: "#2563eb",
  },

  btn: {
    marginTop: "12px",
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};