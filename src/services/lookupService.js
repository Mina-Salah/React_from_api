// src/services/lookupService.js
import axiosClient from "../api/axios.config";
import { ENDPOINTS } from "../api/endpoints";

export const lookupService = {
  /**
   * جلب جميع القوائم المساعدة
   */
  getAllLookups: async () => {
    try {
      const response = await axiosClient.get(ENDPOINTS.REQUEST_LOOKUPS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error("Error fetching lookups:", error);
      throw error;
    }
  },

  /**
   * جلب الحالة العائلية للمستخدم
   */
  getFamilyStatus: async () => {
    try {
      const response = await axiosClient.get(
        ENDPOINTS.USER_LOOKUPS.GET_FAMILY_STATUS
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching family status:", error);
      throw error;
    }
  },

  /**
   * جلب قائمة الجنس
   */
  getGenders: async () => {
    try {
      const response = await axiosClient.get(
        ENDPOINTS.USER_LOOKUPS.GET_GENDERS
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching genders:", error);
      throw error;
    }
  },

  /**
   * جلب قائمة الجنسيات
   */
  getNationalities: async () => {
    try {
      const response = await axiosClient.get(
        ENDPOINTS.USER_LOOKUPS.GET_NATIONALITIES
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching nationalities:", error);
      throw error;
    }
  },
};
