import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    landType: "residential",
    area: { value: "", unit: "cents" },
    location: { address: "", village: "", taluk: "", district: "", state: "Tamil Nadu", pincode: "" },
    price: { total: "", isNegotiable: false },
    features: { waterSource: "none", electricity: false, roadAccess: false, soilType: "" },
    surveyNumber: "",
  });

  const handleChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    if (section) {
      setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [name]: val } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      await API.post("/properties", formData);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        setErrors([data?.message || "Failed to add property"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.title}>Add New Property</h2>
          <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
            ← Back
          </button>
        </div>

        {errors.length > 0 && (
          <div style={styles.error}>
            {errors.map((e, i) => <div key={i}>• {e}</div>)}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Basic Info */}
          <h4 style={styles.section}>Basic Information</h4>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input name="title" value={formData.title} onChange={handleChange}
              placeholder="e.g. 10 cents residential land in Nagercoil"
              style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              placeholder="Describe the property in detail..."
              rows={3} style={{ ...styles.input, resize: "vertical" }} required />
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Land Type</label>
              <select name="landType" value={formData.landType} onChange={handleChange} style={styles.input}>
                <option value="residential">Residential</option>
                <option value="agricultural">Agricultural</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Survey Number</label>
              <input name="surveyNumber" value={formData.surveyNumber} onChange={handleChange}
                placeholder="e.g. 123/4A" style={styles.input} />
            </div>
          </div>

          {/* Area */}
          <h4 style={styles.section}>Area</h4>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Area Value</label>
              <input name="value" type="number" value={formData.area.value}
                onChange={(e) => handleChange(e, "area")}
                placeholder="e.g. 10" style={styles.input} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Unit</label>
              <select name="unit" value={formData.area.unit}
                onChange={(e) => handleChange(e, "area")} style={styles.input}>
                <option value="cents">Cents</option>
                <option value="acres">Acres</option>
                <option value="sqft">Sq.ft</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <h4 style={styles.section}>Location</h4>
          <div style={styles.field}>
            <label style={styles.label}>Address</label>
            <input name="address" value={formData.location.address}
              onChange={(e) => handleChange(e, "location")}
              placeholder="Full address" style={styles.input} required />
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Village</label>
              <input name="village" value={formData.location.village}
                onChange={(e) => handleChange(e, "location")}
                placeholder="Village name" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Taluk</label>
              <input name="taluk" value={formData.location.taluk}
                onChange={(e) => handleChange(e, "location")}
                placeholder="Taluk name" style={styles.input} />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>District</label>
              <input name="district" value={formData.location.district}
                onChange={(e) => handleChange(e, "location")}
                placeholder="e.g. Kanyakumari" style={styles.input} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Pincode</label>
              <input name="pincode" value={formData.location.pincode}
                onChange={(e) => handleChange(e, "location")}
                placeholder="6-digit pincode" style={styles.input} required />
            </div>
          </div>

          {/* Price */}
          <h4 style={styles.section}>Price</h4>
          <div style={styles.field}>
            <label style={styles.label}>Total Price (₹)</label>
            <input name="total" type="number" value={formData.price.total}
              onChange={(e) => handleChange(e, "price")}
              placeholder="e.g. 500000" style={styles.input} required />
          </div>
          <div style={styles.checkRow}>
            <input type="checkbox" name="isNegotiable" id="negotiable"
              checked={formData.price.isNegotiable}
              onChange={(e) => handleChange(e, "price")} />
            <label htmlFor="negotiable" style={styles.checkLabel}>Price is negotiable</label>
          </div>

          {/* Features */}
          <h4 style={styles.section}>Features</h4>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Water Source</label>
              <select name="waterSource" value={formData.features.waterSource}
                onChange={(e) => handleChange(e, "features")} style={styles.input}>
                <option value="none">None</option>
                <option value="borewell">Borewell</option>
                <option value="canal">Canal</option>
                <option value="rain-fed">Rain-fed</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Soil Type</label>
              <input name="soilType" value={formData.features.soilType}
                onChange={(e) => handleChange(e, "features")}
                placeholder="e.g. Red soil" style={styles.input} />
            </div>
          </div>
          <div style={styles.checkRow}>
            <input type="checkbox" name="electricity" id="electricity"
              checked={formData.features.electricity}
              onChange={(e) => handleChange(e, "features")} />
            <label htmlFor="electricity" style={styles.checkLabel}>Electricity available</label>
          </div>
          <div style={styles.checkRow}>
            <input type="checkbox" name="roadAccess" id="roadAccess"
              checked={formData.features.roadAccess}
              onChange={(e) => handleChange(e, "features")} />
            <label htmlFor="roadAccess" style={styles.checkLabel}>Road access available</label>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Posting..." : "Post Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#f0f4f8", padding: "30px 20px" },
  card: { backgroundColor: "#fff", borderRadius: "12px", padding: "30px", maxWidth: "700px", margin: "0 auto", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { margin: 0, fontSize: "22px", fontWeight: "600", color: "#1a202c" },
  backBtn: { padding: "8px 16px", backgroundColor: "#f7fafc", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: "#4a5568" },
  error: { backgroundColor: "#fff5f5", border: "1px solid #feb2b2", color: "#c53030", padding: "10px 14px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "4px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  section: { margin: "8px 0 4px", fontSize: "14px", fontWeight: "600", color: "#2b6cb0", borderBottom: "1px solid #ebf8ff", paddingBottom: "4px" },
  field: { display: "flex", flexDirection: "column", gap: "4px", flex: 1 },
  row: { display: "flex", gap: "16px" },
  label: { fontSize: "13px", fontWeight: "500", color: "#4a5568" },
  input: { padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" },
  checkRow: { display: "flex", alignItems: "center", gap: "8px" },
  checkLabel: { fontSize: "13px", color: "#4a5568" },
  submitBtn: { marginTop: "12px", padding: "12px", backgroundColor: "#2b6cb0", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
};