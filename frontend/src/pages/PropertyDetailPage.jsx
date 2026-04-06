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
    } catch (err) {
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
          ← Back to listings
        </button>
      </div>

      <div style={styles.content}>
        {/* Left: Property details */}
        <div style={styles.main}>
          <div style={styles.topRow}>
            <span style={styles.badge}>{p.landType}</span>
            <span style={p.isAvailable ? styles.available : styles.sold}>
              {p.isAvailable ? "Available" : "Sold"}
            </span>
          </div>

          <h2 style={styles.title}>{p.title}</h2>
          <p style={styles.location}>📍 {p.location.address}, {p.location.village && p.location.village + ", "}{p.location.taluk && p.location.taluk + ", "}{p.location.district}, {p.location.state} — {p.location.pincode}</p>

          <div style={styles.priceRow}>
            <span style={styles.price}>₹ {p.price.total.toLocaleString("en-IN")}</span>
            {p.price.isNegotiable && <span style={styles.negotiable}>Negotiable</span>}
          </div>

          {/* Details grid */}
          <div style={styles.detailGrid}>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>Area</p>
              <p style={styles.detailValue}>{p.area.value} {p.area.unit}</p>
            </div>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>Land Type</p>
              <p style={styles.detailValue} >{p.landType}</p>
            </div>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>Water Source</p>
              <p style={styles.detailValue}>{p.features.waterSource}</p>
            </div>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>Electricity</p>
              <p style={styles.detailValue}>{p.features.electricity ? "Yes" : "No"}</p>
            </div>
            <div style={styles.detailBox}>
              <p style={styles.detailLabel}>Road Access</p>
              <p style={styles.detailValue}>{p.features.roadAccess ? "Yes" : "No"}</p>
            </div>
            {p.features.soilType && (
              <div style={styles.detailBox}>
                <p style={styles.detailLabel}>Soil Type</p>
                <p style={styles.detailValue}>{p.features.soilType}</p>
              </div>
            )}
            {p.surveyNumber && (
              <div style={styles.detailBox}>
                <p style={styles.detailLabel}>Survey Number</p>
                <p style={styles.detailValue}>{p.surveyNumber}</p>
              </div>
            )}
          </div>

          <h4 style={styles.sectionTitle}>Description</h4>
          <p style={styles.description}>{p.description}</p>
        </div>

        {/* Right: Seller contact card */}
        <div style={styles.sidebar}>
          <div style={styles.sellerCard}>
            <h4 style={styles.sellerTitle}>Contact Seller</h4>
            <div style={styles.sellerInfo}>
              <p style={styles.sellerName}>👤 {p.seller.name}</p>
              <p style={styles.sellerDetail}>📧 {p.seller.email}</p>
              <p style={styles.sellerDetail}>📞 {p.seller.phone}</p>
            </div>
            <a href={`tel:${p.seller.phone}`} style={styles.callBtn}>
              Call Seller
            </a>
            <a href={`mailto:${p.seller.email}`} style={styles.emailBtn}>
              Email Seller
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", color: "#718096" },
  navbar: {
    backgroundColor: "#fff", padding: "16px 40px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  logo: { margin: 0, fontSize: "22px", fontWeight: "700", color: "#2b6cb0", cursor: "pointer" },
  backBtn: {
    padding: "8px 16px", backgroundColor: "#f7fafc", border: "1px solid #e2e8f0",
    borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: "#4a5568",
  },
  content: { padding: "30px 40px", display: "flex", gap: "24px", alignItems: "flex-start" },
  main: { flex: 1, backgroundColor: "#fff", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  topRow: { display: "flex", gap: "10px", marginBottom: "12px" },
  badge: {
    padding: "3px 12px", backgroundColor: "#ebf8ff", color: "#2b6cb0",
    borderRadius: "20px", fontSize: "13px", fontWeight: "500", textTransform: "capitalize",
  },
  available: { padding: "3px 12px", backgroundColor: "#f0fff4", color: "#38a169", borderRadius: "20px", fontSize: "13px", fontWeight: "500" },
  sold: { padding: "3px 12px", backgroundColor: "#fff5f5", color: "#e53e3e", borderRadius: "20px", fontSize: "13px", fontWeight: "500" },
  title: { margin: "0 0 8px", fontSize: "24px", fontWeight: "700", color: "#1a202c" },
  location: { margin: "0 0 16px", fontSize: "14px", color: "#718096" },
  priceRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" },
  price: { fontSize: "26px", fontWeight: "700", color: "#2b6cb0" },
  negotiable: { padding: "3px 10px", backgroundColor: "#f0fff4", color: "#38a169", borderRadius: "20px", fontSize: "12px", fontWeight: "500" },
  detailGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", marginBottom: "24px" },
  detailBox: { backgroundColor: "#f7fafc", borderRadius: "8px", padding: "12px" },
  detailLabel: { margin: "0 0 4px", fontSize: "11px", color: "#a0aec0", textTransform: "uppercase", fontWeight: "600" },
  detailValue: { margin: 0, fontSize: "14px", fontWeight: "600", color: "#2d3748", textTransform: "capitalize" },
  sectionTitle: { margin: "0 0 8px", fontSize: "16px", fontWeight: "600", color: "#2d3748" },
  description: { margin: 0, fontSize: "14px", color: "#4a5568", lineHeight: "1.7" },
  sidebar: { width: "280px", flexShrink: 0 },
  sellerCard: { backgroundColor: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
  sellerTitle: { margin: "0 0 16px", fontSize: "16px", fontWeight: "600", color: "#2d3748" },
  sellerInfo: { marginBottom: "16px" },
  sellerName: { margin: "0 0 8px", fontSize: "15px", fontWeight: "600", color: "#2d3748" },
  sellerDetail: { margin: "0 0 6px", fontSize: "13px", color: "#718096" },
  callBtn: {
    display: "block", textAlign: "center", padding: "10px",
    backgroundColor: "#2b6cb0", color: "#fff", borderRadius: "8px",
    fontSize: "14px", fontWeight: "600", textDecoration: "none", marginBottom: "10px",
  },
  emailBtn: {
    display: "block", textAlign: "center", padding: "10px",
    backgroundColor: "#fff", color: "#2b6cb0", border: "1px solid #2b6cb0",
    borderRadius: "8px", fontSize: "14px", fontWeight: "600", textDecoration: "none",
  },
};