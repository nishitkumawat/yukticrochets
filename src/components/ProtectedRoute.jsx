import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { account } from "../services/appwrite";

export default function ProtectedRoute({ children }) {
  // Allow bypassing auth in development via env flag if desired.
  if (import.meta.env.VITE_BYPASS_AUTH === "true") {
    return children;
  }

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    account
      .get()
      .then(() => {
        if (!mounted) return;
        setAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setAuthenticated(false);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-brown/70">
        Loading…
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
