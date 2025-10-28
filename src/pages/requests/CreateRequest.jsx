// src/pages/requests/CreateRequest.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/users/useAuth";
import { requestService } from "../../services/requestService";
import { lookupService } from "../../services/lookupService";

export default function CreateRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    Hospital: "",
    Specialization: "",
    Diagnosis: "",
    Notes: "",
    PatientFullName: "",
    PatientCivilIdNum: "",
    PatientMobileNum: "",
    PatientEmailAddress: "",
    PatientGender: "",
    PatientRelationShip: "",
    Files: [],
  });

  const [lookups, setLookups] = useState({
    hospitals: [],
    specializations: [],
    genders: ["ذكر", "أنثى"],
    relationships: [
      "نفس المريض",
      "زوج/زوجة",
      "ابن/ابنة",
      "أب/أم",
      "أخ/أخت",
      "آخر",
    ],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadingFile, setUploadingFile] = useState(false);

  // جلب القوائم المساعدة وملء بيانات المستخدم
  useEffect(() => {
    fetchLookups();

    // ملء بيانات المستخدم تلقائياً
    if (user) {
      setForm((prev) => ({
        ...prev,
        PatientFullName: user.fullName || user.FullName || "",
        PatientCivilIdNum: user.civilId || user.CivilId || "",
        PatientMobileNum: user.phone || user.Phone || "",
        PatientEmailAddress: user.email || user.Email || "",
      }));
    }
  }, [user]);

  const fetchLookups = async () => {
    try {
      const data = await lookupService.getAllLookups();
      setLookups((prev) => ({
        ...prev,
        hospitals: data.hospitals || [],
        specializations: data.specializations || [],
      }));
    } catch (error) {
      console.error("Error fetching lookups:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // إزالة الخطأ عند التعديل
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setUploadingFile(true);

    files.forEach((file) => {
      // التحقق من حجم الملف (مثلاً: أقل من 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`الملف ${file.name} كبير جداً. الحد الأقصى 5MB`);
        setUploadingFile(false);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setForm((prev) => ({
          ...prev,
          Files: [
            ...prev.Files,
            {
              FileName: file.name,
              Base64Content: base64String,
            },
          ],
        }));
        setUploadingFile(false);
      };
      reader.onerror = () => {
        alert(`فشل في قراءة الملف: ${file.name}`);
        setUploadingFile(false);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setForm((prev) => ({
      ...prev,
      Files: prev.Files.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};

    // معلومات الطلب
    if (!form.Hospital?.trim()) newErrors.Hospital = "المستشفى مطلوب";
    if (!form.Specialization?.trim()) newErrors.Specialization = "التخصص مطلوب";
    if (!form.Diagnosis?.trim()) newErrors.Diagnosis = "التشخيص مطلوب";

    // بيانات المريض
    if (!form.PatientFullName?.trim()) {
      newErrors.PatientFullName = "اسم المريض مطلوب";
    }

    if (!form.PatientCivilIdNum?.trim()) {
      newErrors.PatientCivilIdNum = "الرقم المدني مطلوب";
    } else if (!/^\d{12}$/.test(form.PatientCivilIdNum)) {
      newErrors.PatientCivilIdNum = "الرقم المدني يجب أن يحتوي على 12 رقماً";
    }

    if (!form.PatientMobileNum?.trim()) {
      newErrors.PatientMobileNum = "رقم الهاتف مطلوب";
    } else if (!/^\d{8,15}$/.test(form.PatientMobileNum)) {
      newErrors.PatientMobileNum = "رقم هاتف غير صحيح (8-15 رقم)";
    }

    if (
      form.PatientEmailAddress &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.PatientEmailAddress)
    ) {
      newErrors.PatientEmailAddress = "البريد الإلكتروني غير صحيح";
    }

    if (!form.PatientGender) {
      newErrors.PatientGender = "النوع مطلوب";
    }

    if (!form.PatientRelationShip) {
      newErrors.PatientRelationShip = "صلة القرابة مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      // التمرير للأعلى لرؤية الأخطاء
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setLoading(true);

      const response = await requestService.createRequest(form);

      console.log("Response:", response);

      alert("✅ تم إنشاء الطلب بنجاح!");
      navigate("/requests");
    } catch (error) {
      console.error("Error creating request:", error);

      const errorMessage =
        error.response?.data?.Message ||
        error.response?.data?.message ||
        "فشل في إنشاء الطلب. يرجى المحاولة مرة أخرى.";

      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📋 إنشاء طلب علاج جديد
          </h1>
          <p className="text-gray-600">
            املأ البيانات التالية لإنشاء طلب علاج خارجي
          </p>
        </div>

        {/* Global Error */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 font-medium mb-2">
              ⚠️ يرجى تصحيح الأخطاء التالية:
            </p>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ═══════════════════════════════════════════════════════ */}
          {/* معلومات الطلب */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              🏥 معلومات الطلب
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* المستشفى */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المستشفى <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="Hospital"
                  value={form.Hospital}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.Hospital
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="اسم المستشفى"
                />
                {errors.Hospital && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.Hospital}
                  </p>
                )}
              </div>

              {/* التخصص */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التخصص الطبي <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="Specialization"
                  value={form.Specialization}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.Specialization
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="مثال: جراحة القلب"
                />
                {errors.Specialization && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.Specialization}
                  </p>
                )}
              </div>
            </div>

            {/* التشخيص */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التشخيص <span className="text-red-500">*</span>
              </label>
              <textarea
                name="Diagnosis"
                value={form.Diagnosis}
                onChange={handleChange}
                rows="4"
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.Diagnosis
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="اكتب التشخيص الطبي بالتفصيل..."
              />
              {errors.Diagnosis && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.Diagnosis}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                يُرجى كتابة التشخيص بشكل واضح ومفصل
              </p>
            </div>

            {/* الملاحظات */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملاحظات إضافية <span className="text-gray-400">(اختياري)</span>
              </label>
              <textarea
                name="Notes"
                value={form.Notes}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="أي ملاحظات أو معلومات إضافية..."
              />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* بيانات المريض */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              👤 بيانات المريض
            </h2>

            {/* الاسم الكامل */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="PatientFullName"
                value={form.PatientFullName}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.PatientFullName
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="الاسم الكامل للمريض"
              />
              {errors.PatientFullName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.PatientFullName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* الرقم المدني */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرقم المدني <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="PatientCivilIdNum"
                  value={form.PatientCivilIdNum}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, PatientCivilIdNum: value });
                    if (errors.PatientCivilIdNum) {
                      setErrors({ ...errors, PatientCivilIdNum: "" });
                    }
                  }}
                  maxLength="12"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.PatientCivilIdNum
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="123456789012"
                />
                {errors.PatientCivilIdNum && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.PatientCivilIdNum}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">12 رقماً</p>
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="PatientMobileNum"
                  value={form.PatientMobileNum}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, PatientMobileNum: value });
                    if (errors.PatientMobileNum) {
                      setErrors({ ...errors, PatientMobileNum: "" });
                    }
                  }}
                  maxLength="15"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.PatientMobileNum
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="12345678"
                />
                {errors.PatientMobileNum && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.PatientMobileNum}
                  </p>
                )}
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني{" "}
                  <span className="text-gray-400">(اختياري)</span>
                </label>
                <input
                  type="email"
                  name="PatientEmailAddress"
                  value={form.PatientEmailAddress}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.PatientEmailAddress
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="example@email.com"
                />
                {errors.PatientEmailAddress && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.PatientEmailAddress}
                  </p>
                )}
              </div>

              {/* النوع */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النوع <span className="text-red-500">*</span>
                </label>
                <select
                  name="PatientGender"
                  value={form.PatientGender}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.PatientGender
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">اختر النوع</option>
                  {lookups.genders.map((gender, index) => (
                    <option key={index} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
                {errors.PatientGender && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.PatientGender}
                  </p>
                )}
              </div>
            </div>

            {/* صلة القرابة */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صلة القرابة بالمريض <span className="text-red-500">*</span>
              </label>
              <select
                name="PatientRelationShip"
                value={form.PatientRelationShip}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.PatientRelationShip
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">اختر صلة القرابة</option>
                {lookups.relationships.map((rel, index) => (
                  <option key={index} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
              {errors.PatientRelationShip && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠️</span> {errors.PatientRelationShip}
                </p>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* رفع الملفات */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              📎 المستندات الطبية
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
              <input
                type="file"
                id="fileInput"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                disabled={uploadingFile}
              />
              <label htmlFor="fileInput" className="cursor-pointer block">
                {uploadingFile ? (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-700 font-medium">
                      جارٍ رفع الملفات...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-3">📁</div>
                    <p className="text-gray-700 font-medium mb-1">
                      اضغط لرفع المستندات الطبية
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, صور (JPG, PNG), أو مستندات Word
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      الحد الأقصى: 5MB لكل ملف
                    </p>
                  </>
                )}
              </label>
            </div>

            {/* قائمة الملفات المرفقة */}
            {form.Files.length > 0 && (
              <div className="mt-6">
                <p className="font-medium text-gray-700 mb-3">
                  📄 الملفات المرفقة ({form.Files.length}):
                </p>
                <div className="space-y-2">
                  {form.Files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {file.FileName.endsWith(".pdf")
                            ? "📕"
                            : file.FileName.match(/\.(jpg|jpeg|png)$/i)
                            ? "🖼️"
                            : "📄"}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {file.FileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(
                              (file.Base64Content.length * 0.75) /
                              1024
                            ).toFixed(2)}{" "}
                            KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full p-2 transition"
                        title="حذف الملف"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* أزرار الإجراءات */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/requests")}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading || uploadingFile}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  جارٍ الإرسال...
                </span>
              ) : (
                "✓ إرسال الطلب"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
