// src/pages/dashboard/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/users/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [familyStatus, setFamilyStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchFamilyStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://213.199.50.15:86/getFamilyStatus", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("فشل في جلب البيانات");
        const data = await res.json();
        setFamilyStatus(data);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل الحالة العائلية.");
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyStatus();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          مرحباً، {user?.fullName || user?.FullName || "مستخدم"}! 👋
        </h1>
        <p className="text-gray-600">نتمنى لك يوماً سعيداً</p>
      </div>

      {/* Family Status Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          📋 الحالة العائلية
        </h2>

        {Array.isArray(familyStatus) && familyStatus.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    البيانات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {familyStatus.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <pre className="whitespace-pre-wrap font-sans">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-4 text-gray-600">لا توجد بيانات لعرضها</p>
          </div>
        )}
      </div>
    </div>
  );
}
