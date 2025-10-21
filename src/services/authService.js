import axiosClient from "../api/axiosClient";

export const authService = {
  // تسجيل الدخول
  login: async (data) => {
    const response = await axiosClient.post("/Auth/login", data);
    return response;
  },

  // التسجيل
  register: async (data) => {
    const response = await axiosClient.post("/Auth/register", data);
    return response;
  },

  // الحصول على المستخدم الحالي
  getCurrentUser: async () => {
    const response = await axiosClient.get("/Auth/me");
    return response;
  },
};
