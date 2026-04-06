import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);   // changed from single error to array
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);          // clear old errors
    setLoading(true);
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(data.errors);   // array of validation messages from backend
      } else {
        setErrors([data?.message || "Registration failed. Try again."]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Seller Account</h2>
        <p style={styles.subtitle}>Start listing your properties today</p>

        {/* Error messages — shows all validation errors as a list */}
        {errors.length > 0 && (
          <div style={styles.error}>
            {errors.map((e, i) => (
              <div key={i}>• {e}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@email.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 chars, one uppercase, one number"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account?{" "}
          <Link to="/login" style={styles.linkText}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "420px",
  },
  title: {
    margin: "0 0 6px",
    fontSize: "24px",
    fontWeight: "600",
    color: "#1a202c",
  },
  subtitle: {
    margin: "0 0 24px",
    fontSize: "14px",
    color: "#718096",
  },
  error: {
    backgroundColor: "#fff5f5",
    border: "1px solid #feb2b2",
    color: "#c53030",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#4a5568",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    marginTop: "8px",
    padding: "12px",
    backgroundColor: "#2b6cb0",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  link: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#718096",
  },
  linkText: {
    color: "#2b6cb0",
    textDecoration: "none",
    fontWeight: "500",
  },
};