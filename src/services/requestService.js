// src/services/requestService.js
import axiosClient from "../api/axios.config";
import { ENDPOINTS } from "../api/endpoints";

export const requestService = {
  /**
   * جلب جميع الطلبات
   */
  getAllRequests: async () => {
    try {
      const response = await axiosClient.get(ENDPOINTS.REQUEST.GET_ALL);
      return response.data;
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
  },

  /**
   * جلب طلب محدد بالـ ID
   * @param {number} id - رقم الطلب
   */
  getRequestById: async (id) => {
    try {
      const response = await axiosClient.get(ENDPOINTS.REQUEST.GET_BY_ID, {
        params: { id },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching request:", error);
      throw error;
    }
  },

  /**
   * إنشاء طلب جديد
   * @param {Object} requestData - بيانات الطلب
   */
  createRequest: async (requestData) => {
    try {
      const response = await axiosClient.post(
        ENDPOINTS.REQUEST.CREATE,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  },

  /**
   * إنشاء طلب بدون تسجيل دخول
   * @param {Object} requestData - بيانات الطلب
   */
  createRequestWithoutLogin: async (requestData) => {
    try {
      const response = await axiosClient.post(
        ENDPOINTS.REQUEST.CREATE_WITHOUT_LOGIN,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating request without login:", error);
      throw error;
    }
  },

  /**
   * إضافة رسالة جديدة للطلب
   * @param {Object} messageData - بيانات الرسالة
   */
  addMessage: async (messageData) => {
    try {
      const response = await axiosClient.post(
        ENDPOINTS.REQUEST.ADD_MESSAGE,
        messageData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  },

  /**
   * إضافة مرافق جديد
   * @param {Object} escortData - بيانات المرافق
   */
  addEscort: async (escortData) => {
    try {
      const response = await axiosClient.post(
        ENDPOINTS.REQUEST.ADD_ESCORT,
        escortData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding escort:", error);
      throw error;
    }
  },

  /**
   * حذف مرافق
   * @param {number} escortId - رقم المرافق
   */
  removeEscort: async (escortId) => {
    try {
      const response = await axiosClient.get(ENDPOINTS.REQUEST.REMOVE_ESCORT, {
        params: { id: escortId },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing escort:", error);
      throw error;
    }
  },

  /**
   * جلب جميع التذاكر لطلب معين
   * @param {number} requestId - رقم الطلب
   */
  getAllTickets: async (requestId) => {
    try {
      const response = await axiosClient.get(
        ENDPOINTS.REQUEST.GET_ALL_TICKETS,
        {
          params: { requestId },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
  },
};
