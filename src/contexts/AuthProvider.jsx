// src/contexts/AuthProvider.jsx
import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/authService";
import { useTranslation } from "react-i18next";

export default function AuthProvider({ children }) {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ مدة الجلسة (20 دقيقة)
  const SESSION_DURATION = 20 * 60 * 1000;

  // ✅ نحدد الاتجاه بناءً على اللغة
  const isRTL = i18n.language === "ar";

  // ✅ نحدّث اتجاه الصفحة ولغة الـ HTML
  useEffect(() => {
    document.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  // ✅ تهيئة المستخدم (Check login status)
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      const token = localStorage.getItem("accessToken");
      const savedUser = localStorage.getItem("userData");
      const loginTime = localStorage.getItem("loginTime");

      if (
        token &&
        savedUser &&
        savedUser !== "undefined" &&
        savedUser !== "null"
      ) {
        if (loginTime) {
          const currentTime = new Date().getTime();
          const elapsedTime = currentTime - parseInt(loginTime);
          if (elapsedTime > SESSION_DURATION) {
            localStorage.clear();
            setLoading(false);
            return;
          }
        }

        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  // ✅ تسجيل الدخول
  const login = useCallback(
    async (credentials) => {
      try {
        const result = await authService.login(credentials);

        if (result.success) {
          const responseData = result.data;
          const actualData =
            responseData.Data || responseData.data || responseData;

          const token =
            actualData.token ||
            actualData.accessToken ||
            actualData.Token ||
            actualData.access_token ||
            actualData.jwt ||
            responseData.token ||
            responseData.Token;

          const userData =
            actualData.user ||
            actualData.userData ||
            actualData.User ||
            actualData;

          if (!token) {
            return {
              success: false,
              error: t("auth.login.usernotregistered"), // ✅ ترجمة
            };
          }

          const loginTime = new Date().getTime().toString();
          localStorage.setItem("accessToken", token);
          localStorage.setItem("userData", JSON.stringify(userData));
          localStorage.setItem("loginTime", loginTime);

          setUser(userData);
          setIsAuthenticated(true);

          return { success: true, data: result.data };
        }

        return { success: false, error: result.error };
      } catch {
        return { success: false, error: t("auth.unexpected_error") }; // ✅ ترجمة
      }
    },
    [t]
  );

  // ✅ تسجيل جديد
  const register = useCallback(
    async (formData) => {
      try {
        const result = await authService.register(formData);

        if (result.success) {
          const actualData =
            result.data.Data || result.data.data || result.data;
          return { success: true, data: actualData };
        }

        return {
          success: false,
          error: result.error,
          field: result.field,
          statusCode: result.statusCode,
        };
      } catch {
        return { success: false, error: t("") };
      }
    },
    [t]
  );

  // ✅ تسجيل الخروج
  const logout = useCallback(async () => {
    await authService.logout();
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ✅ القيم اللي هتتبعت لكل الصفحات
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
