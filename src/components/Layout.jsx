import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { HubConnectionBuilder } from "@microsoft/signalr";

export default function Layout({ children }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const isRTL = i18n.language === "ar";

  // SignalR Connection
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7119/notificationHub")
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    connection.start().catch((err) => console.error("SignalR Error:", err));

    // Load existing notifications
    fetchNotifications();

    return () => {
      connection.stop();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "https://localhost:7119/api/Notification/GetNotifications"
      );
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `https://localhost:7119/api/Notification/MarkAsRead?id=${notificationId}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-gray-100 ${
        isRTL ? "rtl" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Links */}
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 hover:bg-blue-100 rounded p-2"
            >
              <i className="fas fa-home"></i>
              <span>{t("home")}</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 hover:bg-blue-100 rounded p-2"
            >
              <i className="fas fa-user"></i>
              <span>{t("profile")}</span>
            </Link>

            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-blue-100 rounded p-2"
              >
                <i className="fas fa-cog"></i>
                <span>{t("settings")}</span>
                <i
                  className={`fas fa-chevron-down transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                ></i>
              </button>

              {isOpen && (
                <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded z-50">
                  <li>
                    <Link
                      to="/categories"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <i className="fas fa-folder"></i> Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <i className="fas fa-box"></i> Products
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Right Side: Notifications, Language, User */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded"
              >
                <i className="fas fa-bell text-xl"></i>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b font-semibold">
                    {t("notifications")} ({unreadCount})
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {t("noNotifications")}
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                          !notification.isRead ? "bg-blue-50" : ""
                        }`}
                        onClick={() => {
                          markAsRead(notification.id);
                          if (notification.link) navigate(notification.link);
                        }}
                      >
                        <div className="font-semibold">
                          {notification.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {notification.timeAgo}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => i18n.changeLanguage(isRTL ? "en" : "ar")}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
            >
              {isRTL ? "🇬🇧 English" : "🇸🇦 العربية"}
            </button>

            {/* User Info & Logout */}
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm">{user.fullName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  <i className="fas fa-sign-out-alt"></i> {t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-white shadow-md p-4 text-center text-gray-500">
        © 2025 My App - All Rights Reserved
      </footer>
    </div>
  );
}
