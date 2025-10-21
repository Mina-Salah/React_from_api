import axiosClient from "./axiosClient";

export const categoriesApi = {
  getAll: async () => {
    const response = await axiosClient.get("/Categories");
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/Categories/${id}`);
    return response.data;
  },

  create: async (category) => {
    const response = await axiosClient.post("/Categories", category);
    return response.data;
  },

  update: async (id, category) => {
    // ✅ أضف الـ id للـ body
    const payload = {
      id: parseInt(id),
      name: category.name,
      description: category.description,
    };

    const response = await axiosClient.put(`/Categories/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/Categories/${id}`);
    return response.data;
  },
};
