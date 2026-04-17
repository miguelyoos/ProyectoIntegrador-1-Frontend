import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isLocalMode = localStorage.getItem("localMode") === "true";

  if (!token && !isLocalMode) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;