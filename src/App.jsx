import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { useAutoLogout } from "./hooks/users/useAutoLogout"; // ✅ أضف هذا

// الصفحات
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
// Request Pages - ✅ أضف هذه الاستيرادات
import RequestsList from "./pages/requests/RequestsList";
import CreateRequest from "./pages/requests/CreateRequest";
import RequestDetails from "./pages/requests/RequestDetails";

export default function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  // ✅ تفعيل Auto Logout
  useAutoLogout();
  // ✅ انتظر حتى يكتمل تحميل حالة المصادقة
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      }
    >
      <Routes>
        {/* صفحات غير محمية */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* صفحات محمية */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        {/* Requests Routes */}
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Layout>
                <RequestsList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests/create"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateRequest />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <RequestDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* أي رابط غير معروف */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
