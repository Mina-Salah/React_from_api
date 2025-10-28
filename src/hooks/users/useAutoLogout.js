// src/hooks/useAutoLogout.js
import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";

export function useAutoLogout() {
  const { logout, isAuthenticated } = useAuth();
  const timeoutRef = useRef(null);

  const TIMEOUT_DURATION = 20 * 60 * 1000; // 20 دقيقة بالميلي ثانية

  const resetTimer = useCallback(() => {
    // إلغاء المؤقت السابق
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // إنشاء مؤقت جديد
    timeoutRef.current = setTimeout(() => {
      console.log("⏰ انتهت المدة - تسجيل خروج تلقائي");
      logout();
    }, TIMEOUT_DURATION);
  }, [logout, TIMEOUT_DURATION]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // الأحداث التي تدل على نشاط المستخدم
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // إعادة تعيين المؤقت عند أي نشاط
    const handleActivity = () => {
      resetTimer();
    };

    // بدء المؤقت
    resetTimer();

    // إضافة مستمعي الأحداث
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // التنظيف عند إلغاء التثبيت
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, resetTimer]);
}
