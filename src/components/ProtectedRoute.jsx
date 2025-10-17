import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  // Allow bypassing auth in development via env flag
  if (import.meta.env.VITE_BYPASS_AUTH === "true") {
    return children;
  }

  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-brown/70">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/adminlogin" replace />;
  }

  return children;
}
