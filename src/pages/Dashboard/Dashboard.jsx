import Layout from "../../components/Layout";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <>
      {" "}
      <h1 className="text-2xl font-semibold mb-6">
        {t("welcome", { name: user?.name || t("user") })}
      </h1>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">📊 {t("stats")}</h3>
          <p className="text-gray-500">{t("statsDesc")}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">📦 {t("recentOrders")}</h3>
          <p className="text-gray-500">{t("recentOrdersDesc")}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">💬 {t("messages")}</h3>
          <p className="text-gray-500">{t("messagesDesc")}</p>
        </div>
      </section>
    </>
  );
}
