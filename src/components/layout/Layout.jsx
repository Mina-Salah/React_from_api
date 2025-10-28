// src/components/layout/Layout.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/users/useAuth";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../utils/constants";

export default function Layout({ children }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // ✅ الآن سيُستخدم

  const isRTL = i18n.language === "ar";

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-100"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={ROUTES.DASHBOARD}
              className="flex items-center gap-2 hover:bg-blue-100 rounded px-3 py-2 transition-colors"
            >
              🏠 {t("layout.home")}
            </Link>

            <Link
              to={ROUTES.PROFILE}
              className="flex items-center gap-2 hover:bg-blue-100 rounded px-3 py-2 transition-colors"
            >
              👤 {t("layout.profile")}
            </Link>

            <Link
              to="/requests"
              className="flex items-center gap-2 hover:bg-blue-100 rounded px-3 py-2 transition-colors"
            >
              📋 <span>الطلبات</span>
            </Link>
            {/* ✅ إضافة القائمة المنسدلة */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-blue-100 rounded px-3 py-2 transition-colors"
              >
                ⚙️ {t("layout.settings")}
                <span
                  className={`transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpen(false)}
                  ></div>

                  <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded z-20 border border-gray-200">
                    <li>
                      <Link
                        to="/categories"
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        📁 {t("layout.categories")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products"
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        📦 {t("layout.products")}
                      </Link>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded transition-colors text-sm"
            >
              {isRTL ? "🇬🇧 English" : "🇸🇦 العربية"}
            </button>

            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  {user.fullName || user.FullName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                >
                  🚪 {t("layout.logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 p-6">{children}</main>

      <footer className="bg-white shadow-md p-4 text-center text-gray-500">
        © 2025 My App
      </footer>
    </div>
  );
}
