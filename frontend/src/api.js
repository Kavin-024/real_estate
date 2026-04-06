import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  withCredentials: true,
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh when token expires
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "http://127.0.0.1:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );
        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("sellerData");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;