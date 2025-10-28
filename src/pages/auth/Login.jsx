// src/pages/auth/Login.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/users/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../utils/constants";

export default function Login() {
  const { t, i18n } = useTranslation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ civilId: "", remember: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    document.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.civilId) {
      setError(t("auth.login.errors.civilIdRequired"));
      return;
    }

    if (!/^\d{12}$/.test(form.civilId)) {
      setError(t("auth.login.errors.civilIdInvalid"));
      return;
    }

    try {
      setLoading(true);
      const result = await login({ civilId: form.civilId });

      if (result.success) {
        navigate(ROUTES.DASHBOARD);
      } else {
        setError(result.error || t("auth.login.errors.loginFailed"));
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(t("auth.login.errors.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className={`absolute top-4 px-4 py-2 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors ${
          isRTL ? "left-4" : "right-4"
        }`}
      >
        {i18n.language === "ar" ? "🇬🇧 English" : "🇸🇦 العربية"}
      </button>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {t("auth.login.title")}
          </h2>
          <p className="text-gray-600">{t("auth.login.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Civil ID Field */}
          <div className="mb-4">
            <label
              htmlFor="civilId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth.login.civilId")} <span className="text-red-500">*</span>
            </label>
            <input
              id="civilId"
              type="text"
              maxLength="12"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={t("auth.login.civilIdPlaceholder")}
              value={form.civilId}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setForm({ ...form, civilId: value });
              }}
              disabled={loading}
            />
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
              disabled={loading}
            />
            {t("auth.login.rememberMe")}
          </label>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("auth.login.loading") : t("auth.login.submit")}
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            {t("auth.login.noAccount")}{" "}
            <Link
              to={ROUTES.REGISTER}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              {t("auth.login.createAccount")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
