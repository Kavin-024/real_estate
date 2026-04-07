import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await API.get(`/properties/${id}`);
      setProperty(res.data.property);
    } catch {
      alert("Property not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.center}>Loading property...</div>;
  if (!property) return null;

  const p = property;

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo} onClick={() => navigate("/")}>🏡 RealEstate</h1>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back
        </button>
      </div>

      <div style={styles.container}>
        {/* LEFT */}
        <div style={styles.main}>
          <div style={styles.badges}>
            <span style={styles.type}>{p.landType}</span>
            <span style={p.isAvailable ? styles.available : styles.sold}>
              {p.isAvailable ? "Available" : "Sold"}
            </span>
          </div>

          <h2 style={styles.title}>{p.title}</h2>

          <p style={styles.location}>
            📍 {p.location.address}, {p.location.district}, {p.location.state}
          </p>

          <div style={styles.priceRow}>
            <h2 style={styles.price}>₹ {p.price.total.toLocaleString("en-IN")}</h2>
            {p.price.isNegotiable && <span style={styles.neg}>Negotiable</span>}
          </div>

          <div style={styles.grid}>
            <div style={styles.box}>📐 {p.area.value} {p.area.unit}</div>
            <div style={styles.box}>💧 {p.features.waterSource}</div>
            <div style={styles.box}>⚡ {p.features.electricity ? "Yes" : "No"}</div>
            <div style={styles.box}>🛣️ {p.features.roadAccess ? "Yes" : "No"}</div>
          </div>

          <h3 style={styles.section}>Description</h3>
          <p style={styles.desc}>{p.description}</p>
        </div>

        {/* RIGHT */}
        <div style={styles.sidebar}>
          <div style={styles.contact}>
            <h3>Contact Seller</h3>
            <p>👤 {p.seller.name}</p>
            <p>📞 {p.seller.phone}</p>
            <p>📧 {p.seller.email}</p>

            <a href={`tel:${p.seller.phone}`} style={styles.callBtn}>
              Call
            </a>

            <a href={`mailto:${p.seller.email}`} style={styles.mailBtn}>
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    padding: "60px",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 40px",
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
  },

  logo: {
    fontWeight: "800",
    color: "#2563eb",
    cursor: "pointer",
  },

  backBtn: {
    padding: "8px 14px",
    background: "#f1f5f9",
    border: "none",
    borderRadius: "8px",
  },

  container: {
    display: "flex",
    gap: "30px",
    padding: "40px",
  },

  main: {
    flex: 1,
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
  },

  badges: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },

  type: {
    background: "#e0f2fe",
    padding: "4px 10px",
    borderRadius: "999px",
  },

  available: {
    color: "#16a34a",
  },

  sold: {
    color: "#ef4444",
  },

  title: {
    fontSize: "26px",
    fontWeight: "800",
  },

  location: {
    color: "#64748b",
  },

  priceRow: {
    marginTop: "10px",
  },

  price: {
    color: "#2563eb",
  },

  neg: {
    color: "#16a34a",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "10px",
    marginTop: "20px",
  },

  box: {
    background: "#f1f5f9",
    padding: "12px",
    borderRadius: "8px",
  },

  section: {
    marginTop: "20px",
  },

  desc: {
    color: "#475569",
  },

  sidebar: {
    width: "280px",
  },

  contact: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
  },

  callBtn: {
    display: "block",
    marginTop: "10px",
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    textAlign: "center",
    borderRadius: "8px",
    textDecoration: "none",
  },

  mailBtn: {
    display: "block",
    marginTop: "10px",
    padding: "10px",
    border: "1px solid #2563eb",
    textAlign: "center",
    borderRadius: "8px",
    textDecoration: "none",
  },
};