import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Field from "../../components/Field";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const passwordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.password2) {
      setError("يرجى ملء جميع الحقول.");
      return;
    }
    if (form.password !== form.password2) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }
    if (passwordStrength(form.password) < 2) {
      setError("كلمة المرور ضعيفة، استخدم رموز وأحرف كبيرة.");
      return;
    }

    try {
      setLoading(true);
      await register(form);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء التسجيل.");
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(form.password);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div className="w-80 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">إنشاء حساب</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="الاسم الكامل" id="name">
            <input
              id="name"
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="اسمك الكامل"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>

          <Field label="البريد الإلكتروني" id="email">
            <input
              id="email"
              type="email"
              className="w-full border rounded px-3 py-2"
              placeholder="example@mail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>

          <Field label="كلمة المرور" id="password">
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
            <div className="h-1 bg-slate-200 mt-2 rounded">
              <div
                className={`h-full rounded transition-all`}
                style={{
                  width: `${(strength / 4) * 100}%`,
                  background:
                    strength >= 3
                      ? "#059669"
                      : strength === 2
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              ></div>
            </div>
          </Field>

          <Field label="تأكيد كلمة المرور" id="password2">
            <input
              id="password2"
              type={showPass ? "text" : "password"}
              className="w-full border rounded px-3 py-2"
              placeholder="أعد كتابة كلمة المرور"
              value={form.password2}
              onChange={(e) => setForm({ ...form, password2: e.target.value })}
            />
          </Field>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded mt-2 disabled:opacity-60"
          >
            {loading ? "جارٍ..." : "إنشاء حساب"}
          </button>

          <p className="text-sm text-center mt-2">
            لديك حساب؟{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              تسجيل الدخول
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
