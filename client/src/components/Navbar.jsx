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
        return (
          parsed.name ||
          parsed.username ||
          parsed.email?.split("@")[0] ||
          "User"
        );
      } catch {
        return "User";
      }
    }

    return "User";
  };

  const getInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  const isLoginActive = location.pathname === "/login";
  const isRegisterActive = location.pathname === "/register";

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
          boxSizing: "border-box",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src="/SyncSpace.png"
            alt="SyncSpace"
            style={{
              width: 34,
              height: 34,
              objectFit: "contain",
            }}
          />

          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#2563EB",
            }}
          >
            SyncSpace
          </span>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: isActive ? "#EFF6FF" : "transparent",
                  color: isActive ? "#2563EB" : "#475569",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "#EFF6FF";
                    e.currentTarget.style.color = "#2563EB";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#475569";
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 28,
              background: "#DBEAFE",
              margin: "0 8px",
            }}
          />

          {user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* User */}
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

                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1E293B",
                  }}
                >
                  {getUserName()}
                </span>
              </div>

              {/* Dashboard */}
              <button
                onClick={() => navigate("/dashboard")}
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
              >
                Dashboard
              </button>

              {/* Logout */}
              <button
                onClick={() => setShowConfirm(true)}
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
              >
                Logout
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* LOGIN */}
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "8px 16px",
                  background: isLoginActive ? "#EFF6FF" : "transparent",
                  color: isLoginActive ? "#2563EB" : "#475569",
                  border: isLoginActive
                    ? "1px solid #BFDBFE"
                    : "1px solid transparent",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isLoginActive
                    ? "0 0 0 2px rgba(191, 219, 254, 0.35)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#EFF6FF";
                  e.currentTarget.style.color = "#2563EB";
                  e.currentTarget.style.borderColor = "#BFDBFE";
                }}
                onMouseLeave={(e) => {
                  if (!isLoginActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#475569";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                Login
              </button>

              {/* REGISTER */}
              <button
                onClick={() => navigate("/register")}
                style={{
                  padding: "8px 16px",
                  background: isRegisterActive
                    ? "#1D4ED8"
                    : "#2563EB",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1D4ED8";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isRegisterActive
                    ? "#1D4ED8"
                    : "#2563EB";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation */}
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
              ↪
            </div>

            <h2
              style={{
                color: "#2563EB",
                fontSize: 20,
                fontWeight: 700,
                margin: "0 0 8px",
              }}
            >
              Log out of SyncSpace?
            </h2>

            <p
              style={{
                color: "#64748B",
                fontSize: 14,
                margin: "0 0 24px",
                lineHeight: 1.6,
              }}
            >
              You'll need to sign in again to access your rooms and workspaces.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
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
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
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