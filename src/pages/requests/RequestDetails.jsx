// src/pages/requests/RequestDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { requestService } from "../../services/requestService";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequestDetails();
    fetchTickets();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const data = await requestService.getRequestById(id);
      setRequest(data);
    } catch (err) {
      console.error("Error:", err);
      setError("فشل في جلب تفاصيل الطلب");
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const data = await requestService.getAllTickets(id);
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error || "الطلب غير موجود"}</p>
          <button
            onClick={() => navigate("/requests")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            العودة للطلبات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/requests")}
          className="text-blue-600 hover:text-blue-700 mb-4"
        >
          ← العودة للطلبات
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {request.requestNumber || `طلب #${request.id}`}
        </h1>
      </div>

      {/* Request Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📋 معلومات الطلب</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">التخصص</p>
            <p className="font-medium">
              {request.Specialization || "غير محدد"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">تاريخ الطلب</p>
            <p className="font-medium">{request.requestDate || "غير محدد"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">الطبيب</p>
            <p className="font-medium">{request.doctor || "غير محدد"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">الحالة</p>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
              {request.status || "قيد المراجعة"}
            </span>
          </div>
        </div>

        {request.Diagnosis && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">التشخيص</p>
            <p className="mt-1">{request.Diagnosis}</p>
          </div>
        )}

        {request.treatment_plan && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">خطة العلاج</p>
            <p className="mt-1">{request.treatment_plan}</p>
          </div>
        )}
      </div>

      {/* Patient Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">👤 بيانات المريض</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">الاسم</p>
            <p className="font-medium">
              {request.Patient_FirstName} {request.Patient_LastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">الرقم المدني</p>
            <p className="font-medium">{request.Patient_CivilId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">رقم الهاتف</p>
            <p className="font-medium">{request.Patient_phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">البريد الإلكتروني</p>
            <p className="font-medium">{request.Patient_emailAddress}</p>
          </div>
        </div>
      </div>

      {/* Tickets */}
      {tickets.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">🎫 التذاكر</h2>

          <div className="space-y-3">
            {tickets.map((ticket, index) => (
              <div key={index} className="border rounded p-4">
                <p className="font-medium">{ticket.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {ticket.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
