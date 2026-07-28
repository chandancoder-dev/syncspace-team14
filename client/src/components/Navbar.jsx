import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "About", path: "/about" },
    { label: "Help", path: "/help" },
  ];

  const isActive = (path) => location.pathname === path;

  function handleLogout() {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    logout();
    navigate("/home");
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoGroup} onClick={() => navigate("/home")}>
        <div style={styles.logoMark}>S</div>
        <span style={styles.logoText}>SyncSpace</span>
      </div>

      <div style={styles.rightSideWrap}>
        <div style={styles.navLinks}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navLink,
                ...(isActive(item.path) ? styles.navLinkActive : {}),
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {user ? (
          <div style={styles.rightGroup}>
            <div style={styles.profilePill}>
              <div style={styles.avatarCircle}>{getInitials(user.name)}</div>
              <span style={styles.userName}>{user.name}</span>
            </div>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button style={styles.loginButton} onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  logoGroup: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  logoMark: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#2563eb", color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 },
  logoText: { fontWeight: 700, fontSize: 18, color: "#1e293b" },
  rightSideWrap: { display: "flex", alignItems: "center", gap: 24 },
  navLinks: { display: "flex", gap: 8 },
  navLink: { border: "none", background: "transparent", padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#475569", cursor: "pointer" },
  navLinkActive: { backgroundColor: "#eff6ff", color: "#2563eb", fontWeight: 600 },
  rightGroup: { display: "flex", alignItems: "center", gap: 12 },
  profilePill: { display: "flex", alignItems: "center", gap: 8 },
  avatarCircle: { width: 28, height: 28, borderRadius: "50%", backgroundColor: "#2563eb", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  userName: { fontSize: 14, color: "#475569" },
  logoutButton: { border: "none", backgroundColor: "#ef4444", color: "#fff", fontWeight: 600, fontSize: 14, padding: "8px 16px", borderRadius: 8, cursor: "pointer" },
  loginButton: { border: "none", backgroundColor: "#2563eb", color: "#fff", fontWeight: 600, fontSize: 14, padding: "8px 20px", borderRadius: 8, cursor: "pointer" },
};