import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true); // ← ADD

  // Restore session on page refresh
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedSeller = localStorage.getItem("sellerData");
    if (token && savedSeller) {
        const parsed = JSON.parse(savedSeller);
        if (parsed.isAdmin) {
        // Admin must always login fresh — clear and don't restore
        localStorage.removeItem("accessToken");
        localStorage.removeItem("sellerData");
        } else {
        // Normal sellers get their session restored
        setAccessToken(token);
        setSeller(parsed);
        }
    }
    setLoading(false);
    }, []);

  const register = async (formData) => {
    const res = await API.post("/auth/register", formData);
    return res.data;
  };

  const login = async (formData) => {
    const res = await API.post("/auth/login", formData);
    setSeller(res.data.seller);
    setAccessToken(res.data.accessToken);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("sellerData", JSON.stringify(res.data.seller)); // ← ADD
    return res.data;
  };

  const logout = async () => {
    await API.post("/auth/logout");
    setSeller(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("sellerData"); // ← ADD
  };

  return (
    <AuthContext.Provider value={{ seller, accessToken, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);