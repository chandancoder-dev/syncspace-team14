import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "About", path: "/about" },
    { label: "Features", path: "/features" },
  ];

  const confirmLogout = () => {
    logout();
    setShowConfirm(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "26px", height: "26px" }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 2.1l4 4-4 4" />
            <path d="M3 12.1v-2a4 4 0 0 1 4-4h14" />
            <path d="M7 21.9l-4-4 4-4" />
            <path d="M21 11.9v2a4 4 0 0 1-4 4H3" />
          </svg>
          <span className="text-xl font-bold text-blue-600">SyncSpace</span>
        </div>

        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              className={`text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {item.label}
            </a>
          ))}

          {user ? (
            <div className="flex items-center gap-3 ml-4">
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  minWidth: "36px",
                  minHeight: "36px",
                  flexShrink: 0,
                  borderRadius: "50%",
                }}
                className="bg-indigo-500 text-white flex items-center justify-center font-semibold text-sm shadow-sm"
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {user.id}
              </span>
              <button
                onClick={() => setShowConfirm(true)}
                style={{
                  backgroundColor: "#dc2626",
                  padding: "6px 12px",
                  fontSize: "12px",
                }}
                className="flex items-center gap-1 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
              >
                Logout
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "12px", height: "12px" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{ padding: "6px 12px", fontSize: "12px" }}
              className="text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 transition-colors ml-2"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#1f2937",
              borderRadius: "14px",
              padding: "28px",
              width: "340px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              border: "1px solid #334155",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "rgba(220, 38, 38, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "24px", height: "24px" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="#dc2626"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>

            <h3
              style={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: "8px",
              }}
            >
              Log out of SyncSpace?
            </h3>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              You'll need to sign in again to access your rooms.
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#374151",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "14px",
                  border: "none",
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