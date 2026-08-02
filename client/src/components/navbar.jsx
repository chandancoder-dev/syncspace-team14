import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Features", path: "/features" },
  ];

  const confirmLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("syncspace_user");
    setShowConfirm(false);
    window.location.href = "/";
  };

  const getUserName = () => {
    if (user?.name) return user.name;
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.name || parsed.username || parsed.email?.split("@")[0] || "User";
      } catch { return "User"; }
    }
    return "User";
  };

  const getInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <nav
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 60px",
          background: "#FFFFFF",
          borderBottom: "1px solid #DBEAFE",
          boxShadow: "0 1px 3px rgba(30, 58, 138, 0.05)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo + Brand */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img src="/SyncSpace.png" alt="SyncSpace" style={{ width: 34, height: 34 }} />
          <span style={{ fontSize: 20, fontWeight: 700, color: "#2563EB" }}>SyncSpace</span>
        </div>

        {/* Nav Links + Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = "#EFF6FF";
                  e.currentTarget.style.color = "#2563EB";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#475569";
                }
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: location.pathname === item.path ? "#EFF6FF" : "transparent",
                color: location.pathname === item.path ? "#2563EB" : "#475569",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {item.label}
            </button>
          ))}

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: "#DBEAFE", margin: "0 8px" }} />

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* User profile badge (non-clickable) */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 12px 5px 5px",
                  background: "#F8FAFC",
                  border: "1px solid #DBEAFE",
                  borderRadius: 999,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#2563EB",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {getInitial()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>
                  {getUserName()}
                </span>
              </div>

              {/* Dashboard button — outlined, light */}
              <button
                onClick={() => navigate("/dashboard")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF";
                  e.currentTarget.style.borderColor = "#2563EB";
                  e.currentTarget.style.color = "#2563EB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#BFDBFE";
                  e.currentTarget.style.color = "#475569";
                }}
                style={{
                  padding: "7px 16px",
                  background: "transparent",
                  color: "#475569",
                  border: "1.5px solid #BFDBFE",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Dashboard
              </button>

              {/* Logout button */}
              <button
                onClick={() => setShowConfirm(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FEF2F2";
                  e.currentTarget.style.borderColor = "#FCA5A5";
                  e.currentTarget.style.color = "#DC2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#BFDBFE";
                  e.currentTarget.style.color = "#64748B";
                }}
                style={{
                  padding: "7px 12px",
                  background: "transparent",
                  color: "#64748B",
                  border: "1.5px solid #BFDBFE",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => navigate("/login")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF";
                  e.currentTarget.style.color = "#2563EB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#475569";
                }}
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  color: "#475569",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1D4ED8";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#2563EB";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                style={{
                  padding: "8px 16px",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)",
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #DBEAFE",
              borderRadius: 14,
              padding: "32px 36px",
              width: 380,
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(30, 58, 138, 0.18)",
            }}
          >
            {/* Red icon */}
            <div
              style={{
                width: 52,
                height: 52,
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "#FEF2F2",
                color: "#DC2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>

            <h2 style={{ color: "#2563EB", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
              Log out of SyncSpace?
            </h2>
            <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
              You'll need to sign in again to access your rooms and workspaces.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  background: "#FFFFFF",
                  border: "1px solid #BFDBFE",
                  borderRadius: 8,
                  color: "#475569",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#B91C1C")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#DC2626")}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  background: "#DC2626",
                  border: "none",
                  borderRadius: 8,
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

