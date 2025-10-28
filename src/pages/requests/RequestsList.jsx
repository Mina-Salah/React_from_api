// src/pages/requests/RequestsList.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestService } from "../../services/requestService";

export default function RequestsList() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔍 بدء جلب الطلبات...");
      const response = await requestService.getAllRequests();

      // 📦 طباعة كاملة للاستجابة
      console.log("📦 Response Type:", typeof response);
      console.log("📦 Response:", response);
      console.log("📦 Is Array?", Array.isArray(response));

      // ✅ معالجة أنواع مختلفة من الاستجابات
      let requestsData = [];

      if (Array.isArray(response)) {
        // الاستجابة array مباشرة
        console.log("✅ Response is Array directly");
        requestsData = response;
      } else if (response && typeof response === "object") {
        // الاستجابة object - نبحث عن الـ array
        console.log("🔍 Response is Object, searching for array...");

        // جرب مفاتيح مختلفة
        const possibleKeys = [
          "Data",
          "data",
          "requests",
          "Requests",
          "items",
          "Items",
          "result",
          "Result",
        ];

        for (const key of possibleKeys) {
          if (Array.isArray(response[key])) {
            console.log(`✅ Found array at response.${key}`);
            requestsData = response[key];
            break;
          }
        }

        // إذا لم نجد array، اطبع كل المفاتيح
        if (requestsData.length === 0) {
          console.log("📋 Available keys in response:", Object.keys(response));
          console.log("⚠️ No array found in response");
        }
      } else {
        console.warn("⚠️ Response is neither Array nor Object:", response);
      }

      console.log("✅ Final requests data:", requestsData);
      console.log("✅ عدد الطلبات:", requestsData.length);

      setRequests(requestsData);
    } catch (err) {
      console.error("❌ Error fetching requests:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error message:", err.message);
      setError(
        err.response?.data?.Message || err.message || "فشل في جلب الطلبات"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-center mb-4">
            <div className="text-5xl mb-3">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">حدث خطأ</h3>
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={fetchRequests}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
          >
            🔄 إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📋 طلباتي</h1>
          <p className="text-gray-600 mt-1">
            جميع الطلبات المقدمة ({requests.length})
          </p>
        </div>
        <Link
          to="/requests/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
        >
          <span className="text-xl">+</span>
          طلب جديد
        </Link>
      </div>

      {/* Empty State */}
      {!Array.isArray(requests) || requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            لا توجد طلبات
          </h3>
          <p className="text-gray-600 mb-6">ابدأ بإنشاء طلبك الأول</p>
          <Link
            to="/requests/create"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            إنشاء طلب جديد
          </Link>
        </div>
      ) : (
        /* Requests Grid */
        <div className="grid gap-4">
          {requests.map((request, index) => {
            // طباعة كل request للتأكد من البنية
            if (index === 0) {
              console.log("📋 First request structure:", request);
              console.log("📋 Request keys:", Object.keys(request));
            }

            return (
              <div
                key={request.id || request.Id || index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  navigate(`/requests/${request.id || request.Id || index}`)
                }
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {request.requestNumber ||
                        request.RequestNumber ||
                        request.request_number ||
                        `طلب #${request.id || request.Id || index + 1}`}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {request.Specialization ||
                        request.specialization ||
                        request.Hospital ||
                        request.hospital ||
                        "غير محدد"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      request.status === "Approved" ||
                      request.Status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : request.status === "Pending" ||
                          request.Status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : request.status === "Rejected" ||
                          request.Status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {request.status || request.Status || "قيد المراجعة"}
                  </span>
                </div>

                {(request.Diagnosis || request.diagnosis) && (
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {request.Diagnosis || request.diagnosis}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
                  <span>
                    📅{" "}
                    {request.requestDate ||
                      request.RequestDate ||
                      request.created_at ||
                      request.createdAt ||
                      "غير محدد"}
                  </span>
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    عرض التفاصيل →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
