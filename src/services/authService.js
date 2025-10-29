// src/services/authService.js
import axiosClient from "../api/axios.config";
import { ENDPOINTS } from "../api/endpoints";

export const authService = {
  async register(formData) {
    try {
      console.log("📤 إرسال بيانات التسجيل:", formData);

      const response = await axiosClient.post(
        `${ENDPOINTS.AUTH.REGISTER}?Patient=true`,
        formData
      );

      // ✅ التحقق من رسالة "المستخدم موجود مسبقاً" حتى لو Success = true
      const message = response.data?.Message || response.data?.message || "";
      if (
        message.toLowerCase().includes("allready exist") ||
        message.toLowerCase().includes("already exists")
      ) {
        return {
          success: false,
          error: "الرقم المدني مسجل مسبقاً",
          field: "civilId",
          statusCode: 409,
        };
      }

      console.log("✅ نجح التسجيل:", response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ خطأ في التسجيل - التفاصيل:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      const status = error.response?.status;
      const errorData = error.response?.data;

      let errorMessage = "فشل التسجيل";
      let errorField = null;

      // معالجة خطأ الرقم المدني المكرر
      if (status === 409) {
        errorMessage = "الرقم المدني مسجل مسبقاً";
        errorField = "civilId";
      }
      // معالجة خطأ البيانات
      else if (status === 400) {
        const msg =
          errorData?.message || errorData?.Message || errorData?.title || "";

        if (
          msg.includes("موجود") ||
          msg.includes("مسجل") ||
          msg.includes("مكرر") ||
          msg.toLowerCase().includes("duplicate") ||
          msg.toLowerCase().includes("exists") ||
          msg.toLowerCase().includes("already")
        ) {
          errorMessage = "الرقم المدني مسجل مسبقاً";
          errorField = "civilId";
        } else {
          errorMessage = msg || "البيانات المدخلة غير صحيحة";
        }

        // معالجة أخطاء الحقول من ASP.NET
        if (errorData?.errors) {
          console.log("🔍 أخطاء الحقول:", errorData.errors);
          const firstError = Object.values(errorData.errors)[0];
          if (firstError && firstError[0]) {
            errorMessage = firstError[0];
          }
        }
      }
      // خطأ السيرفر
      else if (status === 500) {
        errorMessage = "خطأ في السيرفر، يرجى المحاولة لاحقاً";
      }
      // محاولة استخراج أي رسالة متاحة
      else if (errorData) {
        errorMessage =
          errorData.message ||
          errorData.Message ||
          errorData.title ||
          (typeof errorData === "string" ? errorData : errorMessage);
      }

      console.log("📝 رسالة الخطأ النهائية:", errorMessage);

      return {
        success: false,
        error: errorMessage,
        field: errorField,
        statusCode: status,
      };
    }
  },

  async login(credentials) {
    try {
      console.log("🔐 محاولة تسجيل الدخول...");
      const response = await axiosClient.post(
        `${ENDPOINTS.AUTH.LOGIN}?Patient=true`,
        credentials
      );

      console.log("✅ نجح تسجيل الدخول:", response.data);

      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ خطأ في تسجيل الدخول:", error);

      const status = error.response?.status;
      const errorData = error.response?.data;

      let errorMessage = "فشل تسجيل الدخول";

      // ✅ معالجة حالة المستخدم غير موجود (404 أو 401)
      if (status === 404) {
        errorMessage = "الرقم المدني غير مسجل. يرجى التسجيل أولاً";
      }
      // ✅ معالجة كلمة مرور خاطئة أو بيانات خاطئة
      else if (status === 401) {
        const msg = errorData?.message || errorData?.Message || "";

        // التحقق إذا كانت الرسالة تشير لعدم وجود المستخدم
        if (
          msg.toLowerCase().includes("not found") ||
          msg.toLowerCase().includes("not exist") ||
          msg.includes("غير موجود") ||
          msg.includes("لا يوجد")
        ) {
          errorMessage = "الرقم المدني غير مسجل. يرجى التسجيل أولاً";
        } else {
          errorMessage = "كلمة المرور غير صحيحة";
        }
      }
      // معالجة خطأ البيانات
      else if (status === 400) {
        const msg = errorData?.message || errorData?.Message || "";

        if (
          msg.toLowerCase().includes("not found") ||
          msg.toLowerCase().includes("not exist") ||
          msg.includes("غير موجود")
        ) {
          errorMessage = "الرقم المدني غير مسجل. يرجى التسجيل أولاً";
        } else {
          errorMessage = msg || "البيانات المدخلة غير صحيحة";
        }
      }
      // خطأ السيرفر
      else if (status === 500) {
        errorMessage = "خطأ في السيرفر، يرجى المحاولة لاحقاً";
      }
      // محاولة استخراج أي رسالة من الخادم
      else if (errorData) {
        const msg =
          errorData.message || errorData.Message || errorData.title || "";

        if (typeof msg === "string" && msg) {
          errorMessage = msg;
        }
      }

      console.log("📝 رسالة خطأ تسجيل الدخول:", errorMessage);

      return {
        success: false,
        error: errorMessage,
        statusCode: status,
      };
    }
  },

  async logout() {
    try {
      await axiosClient.post(ENDPOINTS.AUTH.LOGOUT);
      localStorage.clear();
      console.log("✅ تم تسجيل الخروج");
      return { success: true };
    } catch (error) {
      console.error("❌ خطأ في تسجيل الخروج:", error);
      localStorage.clear();
      return { success: false };
    }
  },

  async validateToken() {
    try {
      const response = await axiosClient.get(ENDPOINTS.AUTH.VALIDATE);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Token غير صالح",
      };
    }
  },

  async getFamilyStatus() {
    try {
      const response = await axiosClient.get(ENDPOINTS.FAMILY.GET_STATUS);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "فشل جلب حالة العائلة",
      };
    }
  },
};

export default authService;
