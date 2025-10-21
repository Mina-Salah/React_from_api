import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { categoriesApi } from "../../api/categoriesApi";

export default function CategoryCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await categoriesApi.create(formData);
      alert("تم الإضافة بنجاح ✅");
      navigate("/categories");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">➕ إضافة فئة جديدة</h1>
        <Link
          to="/categories"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
        >
          ← العودة للقائمة
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              اسم الفئة *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل اسم الفئة"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل وصف الفئة"
              rows="4"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow disabled:opacity-50"
            >
              {loading ? "⏳ جاري الحفظ..." : "💾 حفظ"}
            </button>
            <Link
              to="/categories"
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded shadow inline-block"
            >
              ❌ إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
