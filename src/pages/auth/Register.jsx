// src/pages/auth/Register.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/users/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../utils/constants";

export default function Register() {
  const { t, i18n } = useTranslation();
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    civilId: "",
    dateOfBirth: "",
    userFirstName: "",
    userMiddleName: "",
    userLastName: "",
    emailAddress: "",
    phoneNumber: "",
    gender: 1,
    password: "",
    confirmPassword: "",
    maritalStatus: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    document.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = {};

    if (!form.civilId) {
      newErrors.civilId = t("auth.register.errors.civilIdRequired");
    } else if (!/^\d{12}$/.test(form.civilId)) {
      newErrors.civilId = t("auth.register.errors.civilIdInvalid");
    }

    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = t("auth.register.errors.dateOfBirthRequired");
    }

    if (!form.userFirstName) {
      newErrors.userFirstName = t("auth.register.errors.firstNameRequired");
    }

    if (!form.userMiddleName) {
      newErrors.userMiddleName = t("auth.register.errors.middleNameRequired");
    }

    if (!form.userLastName) {
      newErrors.userLastName = t("auth.register.errors.lastNameRequired");
    }

    if (!form.emailAddress) {
      newErrors.emailAddress = t("auth.register.errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(form.emailAddress)) {
      newErrors.emailAddress = t("auth.register.errors.emailInvalid");
    }

    if (!form.phoneNumber) {
      newErrors.phoneNumber = t("auth.register.errors.phoneRequired");
    } else if (!/^\d{8,15}$/.test(form.phoneNumber)) {
      newErrors.phoneNumber = t("auth.register.errors.phoneInvalid");
    }

    if (!form.password) {
      newErrors.password = t("auth.register.errors.passwordRequired");
    } else if (form.password.length < 6) {
      newErrors.password = t("auth.register.errors.passwordTooShort");
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = t(
        "auth.register.errors.confirmPasswordRequired"
      );
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = t("auth.register.errors.passwordMismatch");
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const result = await register(form);

      if (result.success) {
        setSuccess(t("auth.register.success"));
        setTimeout(() => navigate(ROUTES.LOGIN), 2000);
      } else {
        if (result.field === "civilId") {
          setErrors({ civilId: result.error });
        } else {
          setErrors({ global: result.error });
        }
      }
    } catch {
      setErrors({ global: t("auth.register.errors.unexpectedError") });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    if ((id === "civilId" || id === "phoneNumber") && !/^\d*$/.test(value)) {
      return;
    }

    setForm({ ...form, [id]: value });

    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className={`absolute top-4 px-4 py-2 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors text-sm ${
          isRTL ? "right-4" : "left-4"
        }`}
      >
        {i18n.language === "ar" ? "🇬🇧 English" : "🇸🇦 العربية"}
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="http://213.199.50.15:8081/assets/img/logoediit.png"
            alt="Logo"
            className="h-24 w-24 object-contain"
          />
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {t("auth.register.title")}
          </h2>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-center font-medium">
                {success}
              </p>
            </div>
          )}

          {/* Global Error */}
          {errors.global && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center">{errors.global}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: الأسماء الثلاثة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("auth.register.firstName")}
                </label>
                <input
                  id="userFirstName"
                  type="text"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isRTL ? "text-right" : "text-left"
                  } ${
                    errors.userFirstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("auth.register.firstNamePlaceholder")}
                  value={form.userFirstName}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.userFirstName && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.userFirstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("auth.register.middleName")}
                </label>
                <input
                  id="userMiddleName"
                  type="text"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isRTL ? "text-right" : "text-left"
                  } ${
                    errors.userMiddleName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("auth.register.middleNamePlaceholder")}
                  value={form.userMiddleName}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.userMiddleName && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.userMiddleName}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("auth.register.lastName")}
                </label>
                <input
                  id="userLastName"
                  type="text"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isRTL ? "text-right" : "text-left"
                  } ${
                    errors.userLastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("auth.register.lastNamePlaceholder")}
                  value={form.userLastName}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.userLastName && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.userLastName}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: الرقم المدني + تاريخ الميلاد */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("auth.register.civilId")}
                </label>
                <input
                  id="civilId"
                  type="text"
                  maxLength="12"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isRTL ? "text-right" : "text-left"
                  } ${errors.civilId ? "border-red-500" : "border-gray-300"}`}
                  placeholder={t("auth.register.civilIdPlaceholder")}
                  value={form.civilId}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.civilId && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.civilId}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("auth.register.dateOfBirth")}
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isRTL ? "text-right" : "text-left"
                  } ${
                    errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.dateOfBirth && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: البريد + الهاتف */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("auth.register.email")}
                </label>
                <input
                  id="emailAddress"
                  type="email"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isRTL ? "text-right" : "text-left"
                  } ${
                    errors.emailAddress ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("auth.register.emailPlaceholder")}
                  value={form.emailAddress}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.emailAddress && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.emailAddress}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("auth.register.phoneNumber")}
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  maxLength="15"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isRTL ? "text-right" : "text-left"
                  } ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t("auth.register.phoneNumberPlaceholder")}
                  value={form.phoneNumber}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.phoneNumber && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Row 4: الجنس + الحالة الاجتماعية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("auth.register.gender")}
                </label>
                <select
                  id="gender"
                  className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  value={form.gender}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">
                    {t("auth.register.genderPlaceholder")}
                  </option>
                  <option value={1}>{t("auth.register.male")}</option>
                  <option value={2}>{t("auth.register.female")}</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("auth.register.maritalStatus")}
                </label>
                <select
                  id="maritalStatus"
                  className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  value={form.maritalStatus}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">
                    {t("auth.register.maritalStatusPlaceholder")}
                  </option>
                  <option value="single">{t("auth.register.single")}</option>
                  <option value="married">{t("auth.register.married")}</option>
                  <option value="divorced">
                    {t("auth.register.divorced")}
                  </option>
                  <option value="widowed">{t("auth.register.widowed")}</option>
                </select>
              </div>
            </div>

            {/* Row 5: كلمة المرور */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("auth.register.password")}
                </label>
                <input
                  id="password"
                  type="password"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isRTL ? "text-right" : "text-left"
                  } ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  placeholder={t("auth.register.passwordPlaceholder")}
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.password && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("auth.register.confirmPassword")}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isRTL ? "text-right" : "text-left"
                  } ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder={t("auth.register.confirmPasswordPlaceholder")}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p
                    className={`text-red-500 text-sm mt-1 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? t("auth.register.loading") : t("auth.register.submit")}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              {t("auth.register.hasAccount")}{" "}
              <Link
                to={ROUTES.LOGIN}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                {t("auth.register.loginLink")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
