import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Field from "../../components/Field";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    // إذا اللغة عربية، اجعل الاتجاه rtl، وإلا ltr
    document.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // التعامل مع إرسال الفورم
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError(t("fillAllFields"));
      return;
    }

    try {
      setLoading(true);
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 relative">
      {/* زر تغيير اللغة */}
      <button
        onClick={() =>
          i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar")
        }
        className={`absolute top-4 px-3 py-1 rounded shadow-sm bg-gray-200 ${
          i18n.language === "ar" ? "left-4" : "right-4"
        }`}
      >
        {i18n.language === "ar" ? "English" : "العربية"}
      </button>

      <div className="w-80 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {t("login")}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* البريد الإلكتروني */}
          <Field label={t("email")} id="email">
            <input
              id="email"
              type="email"
              className="w-full border rounded px-3 py-2"
              placeholder="example@mail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>

          {/* كلمة المرور */}
          <Field label={t("password")} id="password">
            <div className="relative">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                className="w-full border rounded px-3 py-2 pr-10"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>

          {/* تذكرني ونسيت كلمة المرور */}
          <div className="flex justify-between text-sm">
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) =>
                  setForm({ ...form, remember: e.target.checked })
                }
              />
              {t("rememberMe")}
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              {t("forgotPassword")}
            </a>
          </div>

          {/* عرض الأخطاء */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* زر تسجيل الدخول */}
          <button
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded mt-2 disabled:opacity-60"
          >
            {loading ? t("loading") : t("submit")}
          </button>

          {/* رابط إنشاء حساب */}
          <p className="text-sm text-center mt-2">
            {t("noAccount")}{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              {t("register")}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
