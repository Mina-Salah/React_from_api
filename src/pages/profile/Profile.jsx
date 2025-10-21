import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-xl text-gray-600">جاري التحميل...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <h2 className="text-3xl font-bold">👤 الملف الشخصي</h2>
            <p className="text-blue-100 mt-1">معلومات الحساب</p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div className="flex items-center border-b pb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.fullName?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="mr-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {user.fullName || user.FullName || "مستخدم"}
                </h3>
                <p className="text-gray-500">{user.email || user.Email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">
                  📧 البريد الإلكتروني:
                </span>
                <span className="text-gray-800">
                  {user.email || user.Email}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">
                  👤 الاسم الكامل:
                </span>
                <span className="text-gray-800">
                  {user.fullName || user.FullName || "غير محدد"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">
                  🔑 رقم المستخدم:
                </span>
                <span className="text-gray-800 text-sm font-mono">
                  {user.id?.substring(0, 8) || user.Id?.substring(0, 8)}...
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">🎭 الأدوار:</span>
                <div className="flex gap-2">
                  {(user.roles || user.Roles)?.map((role, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        role === "Admin"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {role}
                    </span>
                  )) || (
                    <span className="text-gray-500 text-sm">لا توجد أدوار</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
            >
              🏠 العودة للرئيسية
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition"
            >
              🚪 تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            ℹ️ معلومات إضافية
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>✅ حسابك مُفعّل ويمكنك الوصول لجميع المميزات</li>
            {(user.roles?.includes("Admin") ||
              user.Roles?.includes("Admin")) && (
              <li>🔐 لديك صلاحيات الأدمن - يمكنك إدارة النظام</li>
            )}
            <li>📅 تاريخ الانضمام: {new Date().toLocaleDateString("ar-EG")}</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
