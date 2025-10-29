import axios from "axios";

// Create an Axios instance with default configuration
// إنشاء نسخة من Axios مع الإعدادات الافتراضية
const axiosClient = axios.create({
  baseURL: "http://213.199.50.15:86/", // Base URL for all requests
  timeout: 20000, // 10 seconds timeout for requests
  headers: {
    "Content-Type": "application/json", // Sending JSON in request body
    Accept: "application/json", // Expect JSON in response
  },
});

// ✅ Request interceptor: automatically add Authorization header if token exists
// الفنكشن ده بيتنفذ قبل إرسال أي request ويضيف التوكن لو موجود
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config; // Return modified config
  },
  (error) => Promise.reject(error) // Reject promise if request setup fails
);

// ✅ Response interceptor: handle 401 Unauthorized globally (except login page)
// الفنكشن ده بيتنفذ بعد ما ييجي الرد من السيرفر
axiosClient.interceptors.response.use(
  (response) => response, // Return response directly if successful
  async (error) => {
    const originalRequest = error.config; // Save original request config

    // Check if status is 401 and the request is NOT for /Login endpoint
    // نتأكد إن الخطأ 401 ومش من صفحة تسجيل الدخول
    if (
      error.response?.status === 401 &&
      !originalRequest?.url?.includes("/Login")
    ) {
      // Remove token and user data from localStorage
      // نمسح التوكن وبيانات المستخدم
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");

      // Redirect user to login page
      // نوجه المستخدم لصفحة تسجيل الدخول
      window.location.href = "/login";
    }

    return Promise.reject(error); // Reject error to let caller handle it as well
  }
);

export default axiosClient;
