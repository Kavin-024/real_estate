import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
        const data = await login(formData);
        if (data.seller.isAdmin) {
        navigate("/admin");
        } else {
        navigate("/dashboard");
        }
    } catch (err) {
        setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
        setLoading(false);
    }
    };

  return (
    <div style={styles.page}>
      <div 
  style={styles.card}
  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
>
        <h2 style={styles.title}>Seller Login</h2>
        <p style={styles.subtitle}>Access your property listings</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
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
  onFocus={(e) => e.target.style.border = "1px solid #667eea"}
  onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
/>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="you@email.com"
  required
  style={styles.input}
  onFocus={(e) => e.target.style.border = "1px solid #667eea"}
  onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
/>
          </div>

          
          <button
  type="submit" 
  disabled={loading} 
  style={styles.button}
  onMouseOver={(e) => e.target.style.backgroundColor = "#2c5282"}
  onMouseOut={(e) => e.target.style.backgroundColor = "#2b6cb0"}
  onMouseDown={(e) => e.target.style.transform = "scale(0.95)"}
  onMouseUp={(e) => e.target.style.transform = "scale(1)"}
>
  {loading ? "Logging in..." : "Login"}
</button>
        </form>

        <p style={styles.link}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.linkText}>
            Register here
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
    background: "linear-gradient(to right, #667eea, #764ba2)",
      fontFamily: "Arial, sans-serif",
  },
  card: {
  backgroundColor: "#fff",
  padding: "40px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  width: "100%",
  maxWidth: "420px",
  transition: "0.3s",
},
  title: {
  margin: "0 0 6px",
  fontSize: "26px",
  fontWeight: "700",
  color: "#1a202c",
  textAlign: "center",
},
  subtitle: {
  margin: "0 0 24px",
  fontSize: "14px",
  color: "#b1b4b7",
  textAlign: "center",
},
  error: {
    backgroundColor: "#fff5f5",
    border: "1px solid #feb2b2",
    color: "#c53030",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
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
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  outline: "none",
  transition: "0.3s",
  backgroundColor: "#f9fafb",
},
  button: {
  marginTop: "10px",
  padding: "14px",
  background: "linear-gradient(to right, #4facfe, #00f2fe)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.3s",
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