import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/users/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";
import { ROUTES } from "../../utils/constants";

export default function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}
