// src/api/endpoints.js
export const ENDPOINTS = {
  /* Authentication & Authorization Endpoints*/
  AUTH: {
    // Login endpoint for patients
    LOGIN: "/Login",

    // @type {string} Registration endpoint (uses same endpoint as login)
    REGISTER: "/Login",

    // Refresh token endpoint
    REFRESH: "/auth/refresh",

    // Logout endpoint
    LOGOUT: "/auth/logout",
  },

  // Family Related Endpoints
  FAMILY: {
    // Get family status for logged-in user
    GET_STATUS: "/getFamilyStatus",
  },

  // ═══════════════════════════════════════════════════════
  // 📋 Request - إدارة الطلبات
  // ═══════════════════════════════════════════════════════
  REQUEST: {
    GET_ALL: "/api/Request/GetAllRequests", // جلب جميع الطلبات
    GET_BY_ID: "/GetRequestById", // جلب طلب بالـ ID
    CREATE: "/CreateNewRequest", // إنشاء طلب جديد
    CREATE_WITHOUT_LOGIN: "/CreateNewRequestWithNoLogin", // إنشاء طلب بدون تسجيل
    ADD_MESSAGE: "/AddNewMessage", // إضافة رسالة
    ADD_ESCORT: "/AddNewEscort", // إضافة مرافق
    REMOVE_ESCORT: "/RemoveEscortByHisId", // حذف مرافق
    GET_ALL_TICKETS: "/GetAllTicketsByRequestId", // جلب التذاكر
  },

  // ═══════════════════════════════════════════════════════
  // 📚 RequestLookUps - القوائم المساعدة للطلبات
  // ═══════════════════════════════════════════════════════
  REQUEST_LOOKUPS: {
    GET_ALL: "/getAllLookups", // جلب جميع القوائم
  },

  // Notifications Management Endpoints
  NOTIFICATIONS: {
    // Get all notifications for current user
    GET_ALL: "/api/Notification/GetNotifications",

    // Mark a notification as read
    MARK_READ: (id) => `/api/Notification/MarkAsRead?id=${id}`,
  },
};

// Freeze the object to prevent modifications
Object.freeze(ENDPOINTS);
