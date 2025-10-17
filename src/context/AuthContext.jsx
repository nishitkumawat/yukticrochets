import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded single admin credentials
  const ADMIN_EMAIL = "a@e.com";
  const ADMIN_PASSWORD = "admin123";

  // Load persisted session (if any)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("__admin_user__");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // Simple hardcoded check; replace values above to change credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        $id: "hardcoded-admin",
        name: "Admin",
        email: ADMIN_EMAIL,
        // keep shape roughly similar to Appwrite's account.get()
        roles: ["admin"],
      };
      setUser(adminUser);
      localStorage.setItem("__admin_user__", JSON.stringify(adminUser));
      return;
    }
    throw new Error("Invalid credentials");
  };

  const logout = async () => {
    try {
      localStorage.removeItem("__admin_user__");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
