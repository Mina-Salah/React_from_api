// src/contexts/AuthProvider.jsx
import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/authService";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ وقت انتهاء الجلسة (20 دقيقة)
  const SESSION_DURATION = 20 * 60 * 1000;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      console.log("🔄 بدء تحميل المصادقة...");

      const token = localStorage.getItem("accessToken");
      const savedUser = localStorage.getItem("userData");
      const loginTime = localStorage.getItem("loginTime");

      console.log("🔍 Token:", token ? "موجود" : "غير موجود");
      console.log("🔍 User Data:", savedUser ? "موجود" : "غير موجود");

      if (
        token &&
        savedUser &&
        savedUser !== "undefined" &&
        savedUser !== "null"
      ) {
        // ✅ التحقق من انتهاء صلاحية الجلسة
        if (loginTime) {
          const currentTime = new Date().getTime();
          const elapsedTime = currentTime - parseInt(loginTime);

          if (elapsedTime > SESSION_DURATION) {
            console.log("⏰ انتهت صلاحية الجلسة");
            localStorage.clear();
            setLoading(false);
            return;
          }
        }

        console.log("✅ البيانات موجودة - جاري parse...");
        const userData = JSON.parse(savedUser);

        console.log("👤 User data بعد parse:", userData);

        setUser(userData);
        setIsAuthenticated(true);
        console.log("✅ المستخدم مسجل دخوله");
      } else {
        console.log("❌ لا يوجد بيانات مستخدم صالحة");
      }
    } catch (error) {
      console.error("❌ فشل التحميل:", error);
      localStorage.clear();
    } finally {
      setLoading(false);
      console.log("✅ اكتمل التحميل");
    }
  };

  const login = useCallback(async (credentials) => {
    try {
      console.log("🔐 محاولة تسجيل الدخول...");
      const result = await authService.login(credentials);

      if (result.success) {
        console.log("✅ نجح تسجيل الدخول");
        console.log(
          "📦 البيانات الكاملة:",
          JSON.stringify(result.data, null, 2)
        );

        const responseData = result.data;
        const actualData =
          responseData.Data || responseData.data || responseData;

        console.log("📦 Actual Data:", actualData);

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

        console.log("📝 Token:", token ? "موجود ✅" : "غير موجود ❌");
        console.log("📝 Token Value:", token);
        console.log("📝 User Data:", userData);

        if (!token) {
          console.error("❌ بيانات غير كاملة من الـ API");
          console.error("📋 جميع المفاتيح:", Object.keys(actualData));
          console.error(
            "📄 Actual Data الكامل:",
            JSON.stringify(actualData, null, 2)
          );

          return {
            success: false,
            error: "لم يتم استلام التوكين من الخادم",
          };
        }

        console.log("💾 جاري حفظ البيانات في localStorage...");

        // ✅ حفظ وقت تسجيل الدخول
        const loginTime = new Date().getTime().toString();

        localStorage.setItem("accessToken", token);
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("loginTime", loginTime);

        const savedToken = localStorage.getItem("accessToken");
        const savedUserData = localStorage.getItem("userData");
        console.log("✅ Token saved?", !!savedToken);
        console.log("✅ User data saved?", !!savedUserData);

        setUser(userData);
        setIsAuthenticated(true);
        console.log("✅ تم تحديث State - isAuthenticated: true");

        return { success: true, data: result.data };
      }

      return { success: false, error: result.error };
    } catch (error) {
      console.error("❌ خطأ في تسجيل الدخول:", error);
      return {
        success: false,
        error: "حدث خطأ غير متوقع",
      };
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      console.log("📝 محاولة التسجيل...", formData);
      const result = await authService.register(formData);

      if (result.success) {
        console.log("✅ نجح التسجيل");
        console.log("📦 Register Response:", result.data);

        const actualData = result.data.Data || result.data.data || result.data;
        console.log("📦 Actual Data:", actualData);

        return { success: true, data: actualData };
      }

      // ✅ تمرير كل بيانات الخطأ بما فيها field
      console.error("❌ فشل التسجيل:", {
        error: result.error,
        field: result.field,
        statusCode: result.statusCode,
      });

      return {
        success: false,
        error: result.error,
        field: result.field, // ✅ مهم جداً لعرض الخطأ في الحقل الصحيح
        statusCode: result.statusCode,
      };
    } catch (error) {
      console.error("❌ خطأ استثنائي في التسجيل:", error);
      return {
        success: false,
        error: "حدث خطأ غير متوقع",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    console.log("🚪 تسجيل الخروج...");
    await authService.logout();
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    console.log("✅ تم تسجيل الخروج");
  }, []);

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
