import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

/*
 * Wrap your app in <AuthProvider> once, at the top level.
 * No user is logged in until they register or log in.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("syncspace_user");
    return saved ? JSON.parse(saved) : null;
  });

  function login(userData) {
    // userData = { name, email }
    localStorage.setItem("syncspace_user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("syncspace_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}