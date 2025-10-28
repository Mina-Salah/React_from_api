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
    userLastName: "",
    emailAddress: "",
    phoneNumber: "",
    gender: 1,
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
      console.log("📝 إرسال بيانات التسجيل:", form);

      const result = await register(form);

      console.log("📦 نتيجة التسجيل:", result);

      if (result.success) {
        setSuccess(t("auth.register.success"));
        console.log("✅ نجح التسجيل - سيتم التحويل للـ login");
        setTimeout(() => navigate(ROUTES.LOGIN), 2000);
      } else {
        console.error("❌ فشل التسجيل:", result);

        // ✅ إذا كان الخطأ في حقل الرقم المدني
        if (result.field === "civilId") {
          console.log("🔴 عرض الخطأ تحت حقل الرقم المدني");
          setErrors({
            civilId: result.error, // "الرقم المدني مسجل مسبقاً"
          });
        } else {
          // خطأ عام
          setErrors({
            global: result.error,
          });
        }
      }
    } catch (err) {
      console.error("❌ خطأ استثنائي:", err);
      setErrors({ global: "حدث خطأ غير متوقع" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    // منع الحروف في الرقم المدني ورقم الهاتف
    if ((id === "civilId" || id === "phoneNumber") && !/^\d*$/.test(value)) {
      return;
    }

    setForm({ ...form, [id]: value });

    // إزالة الخطأ عند التعديل
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

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

      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {t("auth.register.title")}
          </h2>
          <p className="text-gray-600">{t("auth.register.subtitle")}</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-center font-medium">{success}</p>
          </div>
        )}

        {/* Global Error */}
        {errors.global && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center">{errors.global}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Civil ID */}
          <div>
            <label
              htmlFor="civilId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth.register.civilId")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="civilId"
              type="text"
              maxLength="12"
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.civilId ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="123456789012"
              value={form.civilId}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.civilId && (
              <p className="text-red-500 text-sm mt-1">{errors.civilId}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth.register.dateOfBirth")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="dateOfBirth"
              type="date"
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.dateOfBirth ? "border-red-500" : "border-gray-300"
              }`}
              value={form.dateOfBirth}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="userFirstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("auth.register.firstName")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="userFirstName"
                type="text"
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.userFirstName ? "border-red-500" : "border-gray-300"
                }`}
                value={form.userFirstName}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.userFirstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.userFirstName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="userLastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("auth.register.lastName")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id="userLastName"
                type="text"
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.userLastName ? "border-red-500" : "border-gray-300"
                }`}
                value={form.userLastName}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.userLastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.userLastName}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="emailAddress"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth.register.email")} <span className="text-red-500">*</span>
            </label>
            <input
              id="emailAddress"
              type="email"
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.emailAddress ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="example@email.com"
              value={form.emailAddress}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.emailAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth.register.phoneNumber")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              type="text"
              maxLength="15"
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="12345678"
              value={form.phoneNumber}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("auth.register.gender")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={form.gender}
              onChange={handleChange}
              disabled={loading}
            >
              <option value={1}>{t("auth.register.male")}</option>{" "}
              {/* ✅ تغيير من 0 إلى 1 */}
              <option value={2}>{t("auth.register.female")}</option>{" "}
              {/* ✅ تغيير من 1 إلى 2 */}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
  );
}
