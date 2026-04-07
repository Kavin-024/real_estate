import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

export default function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    isAvailable: true,
  });

  const focusStyle = {
    onFocus: (e) => (e.target.style.border = "1px solid #2563eb"),
    onBlur: (e) => (e.target.style.border = "1px solid #e2e8f0"),
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await API.get(`/properties/${id}`);
      const p = res.data.property;

      setFormData({
        title: p.title,
        description: p.description,
        landType: p.landType,
        area: { value: p.area.value, unit: p.area.unit },
        location: {
          address: p.location.address,
          village: p.location.village || "",
          taluk: p.location.taluk || "",
          district: p.location.district,
          state: p.location.state,
          pincode: p.location.pincode,
        },
        price: { total: p.price.total, isNegotiable: p.price.isNegotiable },
        features: {
          waterSource: p.features.waterSource,
          electricity: p.features.electricity,
          roadAccess: p.features.roadAccess,
          soilType: p.features.soilType || "",
        },
        surveyNumber: p.surveyNumber || "",
        isAvailable: p.isAvailable,
      });
    } catch (err) {
      alert("Failed to load property");
      navigate("/dashboard");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: val },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      await API.put(`/properties/${id}`, formData);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else setErrors([data?.message || "Failed to update property"]);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={styles.center}>Loading property...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.title}>Edit Property</h2>
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

          <input name="title" value={formData.title}
            onChange={handleChange} style={styles.input} {...focusStyle} required />

          <textarea name="description" value={formData.description}
            onChange={handleChange}
            style={{ ...styles.input, resize: "vertical" }}
            {...focusStyle} required />

          <div style={styles.row}>
            <select name="landType" value={formData.landType}
              onChange={handleChange} style={styles.input} {...focusStyle}>
              <option value="residential">Residential</option>
              <option value="agricultural">Agricultural</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
            </select>

            <input name="surveyNumber" value={formData.surveyNumber}
              onChange={handleChange} style={styles.input} {...focusStyle} />
          </div>

          <div style={styles.checkRow}>
            <input type="checkbox" name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange} />
            <label>Property is still available</label>
          </div>

          <h4 style={styles.section}>Area</h4>

          <div style={styles.row}>
            <input name="value" type="number" value={formData.area.value}
              onChange={(e) => handleChange(e, "area")}
              style={styles.input} {...focusStyle} required />

            <select name="unit" value={formData.area.unit}
              onChange={(e) => handleChange(e, "area")}
              style={styles.input} {...focusStyle}>
              <option value="cents">Cents</option>
              <option value="acres">Acres</option>
              <option value="sqft">Sq.ft</option>
            </select>
          </div>

          <h4 style={styles.section}>Location</h4>

          <input name="address" value={formData.location.address}
            onChange={(e) => handleChange(e, "location")}
            style={styles.input} {...focusStyle} required />

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
              style={styles.input} {...focusStyle} required />

            <input name="pincode" value={formData.location.pincode}
              onChange={(e) => handleChange(e, "location")}
              style={styles.input} {...focusStyle} required />
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
              <option value="rain-fed">Rain-fed</option>
            </select>

            <input name="soilType" value={formData.features.soilType}
              onChange={(e) => handleChange(e, "features")}
              style={styles.input} {...focusStyle} />
          </div>

          <button type="submit" style={styles.submitBtn}>
            {loading ? "Updating..." : "Update Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc", padding: "40px 20px" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
  card: { background: "#fff", borderRadius: "18px", padding: "40px", maxWidth: "900px", margin: "auto", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" },
  cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  title: { fontSize: "26px", fontWeight: "800" },
  backBtn: { padding: "8px 14px", background: "#f1f5f9", border: "none", borderRadius: "8px" },
  error: { background: "#fee2e2", padding: "10px", borderRadius: "8px", marginBottom: "15px" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  section: { fontWeight: "700", color: "#2563eb" },
  row: { display: "flex", gap: "15px", flexWrap: "wrap" },
  input: { padding: "12px", border: "1px solid #e2e8f0", borderRadius: "10px" },
  checkRow: { display: "flex", gap: "10px" },
  submitBtn: { padding: "14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700" },
};