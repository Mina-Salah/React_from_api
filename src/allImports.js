// =======================
// React Router
// =======================
export { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// =======================
// Context
// =======================
export { AuthProvider } from "./context/AuthProvider";

// =======================
// Components
// =======================
export { default as Layout } from "./components/Layout";
export { default as ProtectedRoute } from "./components/ProtectedRoute";

// =======================
// Auth Pages
// =======================
export { default as Login } from "./pages/auth/Login";
export { default as Register } from "./pages/auth/Register";

// =======================
// Dashboard
// =======================
export { default as Dashboard } from "./pages/Dashboard/Dashboard";

// =======================
// Profile
// =======================
export { default as Profile } from "./pages/Profile/Profile";

// =======================
// Categories
// =======================
export { default as CategoriesList } from "./pages/Categories/CategoriesList";
export { default as CategoryView } from "./pages/Categories/CategoryView";
export { default as CategoryCreate } from "./pages/Categories/CategoryCreate";
export { default as CategoryEdit } from "./pages/Categories/CategoryEdit";
