import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { useCategories } from "../../hooks/useCategories";

export default function CategoriesList() {
  const { categories, loading, error, deleteCategory } = useCategories();

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من الحذف؟")) {
      try {
        await deleteCategory(id);
        alert("تم الحذف بنجاح");
      } catch (err) {
        alert("حدث خطأ: " + err.message);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📁 قائمة الفئات</h1>
        <Link
          to="/categories/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          ➕ إضافة فئة جديدة
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="text-xl text-gray-600">⏳ جاري التحميل...</div>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-500">
          📭 لا توجد فئات. قم بإنشاء أول فئة!
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  الرقم
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  الاسم
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  الوصف
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {category.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {category.description || "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/categories/view/${category.id}`}
                      className="text-green-600 hover:text-green-800 mx-2 text-lg"
                      title="عرض"
                    >
                      👁️
                    </Link>
                    <Link
                      to={`/categories/edit/${category.id}`}
                      className="text-blue-600 hover:text-blue-800 mx-2 text-lg"
                      title="تعديل"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-800 mx-2 text-lg"
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
