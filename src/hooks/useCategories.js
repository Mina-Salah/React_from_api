import { useState, useEffect } from "react";
import { categoriesApi } from "../api/categoriesApi";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (category) => {
    setLoading(true);
    try {
      const newCategory = await categoriesApi.create(category);
      setCategories([...categories, newCategory]);
      setError(null);
      return newCategory;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, category) => {
    setLoading(true);
    try {
      await categoriesApi.update(id, category);
      setCategories(
        categories.map((cat) => (cat.id === id ? { ...cat, ...category } : cat))
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      await categoriesApi.delete(id);
      setCategories(categories.filter((cat) => cat.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
