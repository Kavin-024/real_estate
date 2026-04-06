import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  withCredentials: true, // sends cookie with every request
});

export const AuthProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const register = async (formData) => {
    const res = await API.post("/auth/register", formData);
    return res.data;
  };

  const login = async (formData) => {
    const res = await API.post("/auth/login", formData);
    setSeller(res.data.seller);
    setAccessToken(res.data.accessToken);
    localStorage.setItem("accessToken", res.data.accessToken);
    return res.data;
  };

  const logout = async () => {
    await API.post("/auth/logout");
    setSeller(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ seller, accessToken, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);