import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./ar/translation.json";
import en from "./en/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: "ar", // اللغة الافتراضية
  fallbackLng: "en", // لغة احتياطية عند عدم توفر ترجمة
  interpolation: { escapeValue: false },
});

export default i18n;
