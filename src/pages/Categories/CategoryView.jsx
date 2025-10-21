import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { categoriesApi } from "../../api/categoriesApi";

export default function CategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await categoriesApi.getById(id);
        setCategory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("هل أنت متأكد من الحذف؟")) {
      try {
        await categoriesApi.delete(id);
        alert("تم الحذف بنجاح");
        navigate("/categories");
      } catch (err) {
        alert("حدث خطأ: " + err.message);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-xl text-gray-600 mt-10">
          ⏳ جاري التحميل...
        </div>
      </Layout>
    );
  }

  if (error || !category) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          ⚠️ {error || "لم يتم العثور على الفئة"}
        </div>
        <Link
          to="/categories"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          ← العودة للقائمة
        </Link>
      </Layout>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">👁️ عرض الفئة</h1>
        <Link
          to="/categories"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
        >
          ← العودة للقائمة
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-gray-500 text-sm mb-1">رقم الفئة</label>
          <div className="text-2xl font-bold text-gray-800">{category.id}</div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-500 text-sm mb-1">اسم الفئة</label>
          <div className="text-xl text-gray-800">{category.name}</div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-500 text-sm mb-1">الوصف</label>
          <div className="text-gray-700">
            {category.description || "لا يوجد وصف"}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Link
            to={`/categories/edit/${category.id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow"
          >
            ✏️ تعديل
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow"
          >
            🗑️ حذف
          </button>
        </div>
      </div>
    </div>
  );
}
