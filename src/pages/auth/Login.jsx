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

  const [isCommitteeMember, setIsCommitteeMember] = useState(false);

  const [form, setForm] = useState({
    civilId: "",
    password: "",
    memberName: "",
    remember: false,
  });
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

    if (isCommitteeMember) {
      if (!form.memberName) {
        setError(t("auth.login.errors.memberNameRequired"));
        return;
      }

      if (!form.password) {
        setError(t("auth.login.errors.passwordRequired"));
        return;
      }

      try {
        setLoading(true);
        const result = await login({
          memberName: form.memberName,
          password: form.password,
          isCommitteeMember: true,
        });

        if (result.success) {
          navigate(ROUTES.DASHBOARD);
        } else {
          setError(result.error || t("auth.login.errors.loginFailed"));
        }
      } catch (err) {
        console.error("Login error:", err);
        setError(t("auth.login.errors.errorOccurred"));
      } finally {
        setLoading(false);
      }
    } else {
      if (!form.civilId) {
        setError(t("auth.login.errors.civilIdRequired"));
        return;
      }

      if (!/^\d{12}$/.test(form.civilId)) {
        setError(t("auth.login.errors.civilIdInvalid"));
        return;
      }

      if (!form.password) {
        setError(t("auth.login.errors.passwordRequired"));
        return;
      }

      try {
        setLoading(true);
        const result = await login({
          civilId: form.civilId,
          password: form.password,
        });

        if (result.success) {
          navigate(ROUTES.DASHBOARD);
        } else {
          setError(result.error || t("auth.login.errors.loginFailed"));
        }
      } catch (err) {
        console.error("Login error:", err);
        setError(t("auth.login.errors.errorOccurred"));
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const toggleMemberType = () => {
    setIsCommitteeMember(!isCommitteeMember);
    setError("");
    setForm({
      civilId: "",
      password: "",
      memberName: "",
      remember: false,
    });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" dir={isRTL ? "rtl" : "ltr"}>
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className={`absolute top-6 text-sm text-blue-600 hover:text-blue-700 font-medium ${
            isRTL ? "left-6" : "right-6"
          }`}
        >
          {i18n.language === "ar" ? "English 🇬🇧" : "العربية 🇸🇦"}
        </button>

        <div className="w-full max-w-md">
          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t("auth.login.welcome")}
            </h1>
            <h2 className="text-xl font-semibold text-gray-700">
              {isCommitteeMember
                ? t("auth.login.committeeSubtitle")
                : t("auth.login.subtitle")}
            </h2>
          </div>

          {/* Toggle Committee Member / Patient */}
          <div className="text-center mb-4">
            <button
              onClick={toggleMemberType}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <span className={isRTL ? "ml-2" : "mr-2"}>👤</span>
              {isCommitteeMember
                ? t("auth.login.switchToPatient")
                : t("auth.login.committeeMember")}
            </button>
          </div>

          {/* Divider */}
          <div className="text-center text-gray-400 text-sm mb-6">
            {t("auth.login.orLogin")}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isCommitteeMember ? (
              <>
                {/* Member Name */}
                <div>
                  <label
                    htmlFor="memberName"
                    className={`block text-sm font-medium text-gray-700 mb-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("auth.login.memberName")}
                  </label>
                  <input
                    id="memberName"
                    type="text"
                    className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    placeholder={t("auth.login.memberNamePlaceholder")}
                    value={form.memberName}
                    onChange={(e) =>
                      setForm({ ...form, memberName: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium text-gray-700 mb-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("auth.login.password")}
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    placeholder={t("auth.login.passwordPlaceholder")}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
              </>
            ) : (
              <>
                {/* Civil ID */}
                <div>
                  <label
                    htmlFor="civilId"
                    className={`block text-sm font-medium text-gray-700 mb-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("auth.login.civilId")}
                  </label>
                  <input
                    id="civilId"
                    type="text"
                    maxLength="12"
                    className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    placeholder={t("auth.login.civilIdPlaceholder")}
                    value={form.civilId}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setForm({ ...form, civilId: value });
                    }}
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium text-gray-700 mb-2 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("auth.login.password")}
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    placeholder={t("auth.login.passwordPlaceholder")}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {/* Remember Me - Only for patients */}
            {!isCommitteeMember && (
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={form.remember}
                  onChange={(e) =>
                    setForm({ ...form, remember: e.target.checked })
                  }
                  disabled={loading}
                />
                <label
                  htmlFor="remember"
                  className={`text-sm text-gray-700 cursor-pointer ${
                    isRTL ? "mr-2" : "ml-2"
                  }`}
                >
                  {t("auth.login.rememberMe")}
                </label>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-6"
            >
              {loading ? t("auth.login.loading") : t("auth.login.submit")}
            </button>
          </form>

          {/* Register Link - Only for patients */}
          {!isCommitteeMember && (
            <div className="mt-6 text-center">
              <Link
                to={ROUTES.REGISTER}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {t("auth.login.createAccount")}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Image & Content */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-700/80"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-white p-12 text-center w-full">
          {/* ✅ Logo Circle - Top Right */}
          <div className={`absolute top-8 ${isRTL ? "left-8" : "right-8"}`}>
            <div className="bg-white rounded-full p-4 shadow-2xl">
              <img
                src="http://213.199.50.15:8081/assets/img/logoediit.png"
                alt="Ministry Logo"
                className="h-20 w-20 object-contain"
              />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            {t("auth.login.departmentTitle")}
          </h1>

          <p className="text-lg leading-relaxed max-w-2xl">
            {t("auth.login.departmentDescription")}
          </p>

          <div className="mt-12 w-full max-w-md">
            <div className="h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
