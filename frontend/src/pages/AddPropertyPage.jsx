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

  const focusStyle = {
    onFocus: (e) => (e.target.style.border = "1px solid #2563eb"),
    onBlur: (e) => (e.target.style.border = "1px solid #e2e8f0"),
  };

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
      if (data?.errors) setErrors(data.errors);
      else setErrors([data?.message || "Failed to add property"]);
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

          <h4 style={styles.section}>Basic Information</h4>

          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input name="title" value={formData.title} onChange={handleChange}
              style={styles.input} {...focusStyle} required />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea name="description" value={formData.description}
              onChange={handleChange}
              style={{ ...styles.input, resize: "vertical" }}
              {...focusStyle} required />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Land Type</label>
              <select name="landType" value={formData.landType}
                onChange={handleChange} style={styles.input} {...focusStyle}>
                <option value="residential">Residential</option>
                <option value="agricultural">Agricultural</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Survey Number</label>
              <input name="surveyNumber" value={formData.surveyNumber}
                onChange={handleChange} style={styles.input} {...focusStyle} />
            </div>
          </div>

          <h4 style={styles.section}>Area</h4>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Area Value</label>
              <input name="value" type="number" value={formData.area.value}
                onChange={(e) => handleChange(e, "area")}
                style={styles.input} {...focusStyle} required />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Unit</label>
              <select name="unit" value={formData.area.unit}
                onChange={(e) => handleChange(e, "area")}
                style={styles.input} {...focusStyle}>
                <option value="cents">Cents</option>
                <option value="acres">Acres</option>
                <option value="sqft">Sq.ft</option>
              </select>
            </div>
          </div>

          <h4 style={styles.section}>Location</h4>

          <div style={styles.field}>
            <label style={styles.label}>Address</label>
            <input name="address" value={formData.location.address}
              onChange={(e) => handleChange(e, "location")}
              style={styles.input} {...focusStyle} required />
          </div>

          <div style={styles.row}>
            <input name="village" value={formData.location.village}
              onChange={(e) => handleChange(e, "location")}
              style={styles.input} {...focusStyle} placeholder="Village" />
            <input name="taluk" value={formData.location.taluk}
              onChange={(e) => handleChange(e, "location")}
              style={styles.input} {...focusStyle} placeholder="Taluk" />
          </div>

          <div style={styles.row}>
            <input name="district" value={formData.location.district}
              onChange={(e) => handleChange(e, "location")}
              style={styles.input} {...focusStyle} placeholder="District" required />
            <input name="pincode" value={formData.location.pincode}
              onChange={(e) => handleChange(e, "location")}
              style={styles.input} {...focusStyle} placeholder="Pincode" required />
          </div>

          <h4 style={styles.section}>Price</h4>

          <input name="total" type="number" value={formData.price.total}
            onChange={(e) => handleChange(e, "price")}
            style={styles.input} {...focusStyle} required />

          <div style={styles.checkRow}>
            <input type="checkbox" name="isNegotiable"
              checked={formData.price.isNegotiable}
              onChange={(e) => handleChange(e, "price")} />
            <label>Price is negotiable</label>
          </div>

          <h4 style={styles.section}>Features</h4>

          <div style={styles.row}>
            <select name="waterSource" value={formData.features.waterSource}
              onChange={(e) => handleChange(e, "features")}
              style={styles.input} {...focusStyle}>
              <option value="none">None</option>
              <option value="borewell">Borewell</option>
              <option value="canal">Canal</option>
            </select>

            <input name="soilType" value={formData.features.soilType}
              onChange={(e) => handleChange(e, "features")}
              style={styles.input} {...focusStyle} placeholder="Soil Type" />
          </div>

          <button type="submit" style={styles.submitBtn}>
            {loading ? "Posting..." : "Post Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc", padding: "40px 20px" },
  card: { background: "#fff", borderRadius: "16px", padding: "40px", maxWidth: "900px", margin: "auto" },
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  title: { fontSize: "24px", fontWeight: "700" },
  backBtn: { padding: "8px 14px", background: "#f1f5f9", border: "none", borderRadius: "8px" },
  error: { background: "#fee2e2", padding: "10px", borderRadius: "8px", marginBottom: "15px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  section: { fontWeight: "700", color: "#2563eb" },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  row: { display: "flex", gap: "15px", flexWrap: "wrap" },
  input: { padding: "12px", border: "1px solid #e2e8f0", borderRadius: "10px" },
  checkRow: { display: "flex", gap: "10px" },
  submitBtn: { padding: "14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "10px" },
};