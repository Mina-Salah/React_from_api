import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://213.199.50.15:86/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ تعديل هنا — ما نعملش logout فوري لأي 401 بشكل عام
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // نتأكد إن الخطأ مش من صفحة الـ Login
    if (
      error.response?.status === 401 &&
      !originalRequest?.url?.includes("/Login")
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
