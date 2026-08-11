import { useState } from "react";
import { useNavigate, Link, useSearchParams, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const nextParam = searchParams.get("next");

  const registerLinkTo = nextParam
    ? `/register?next=${encodeURIComponent(nextParam)}`
    : "/register";

  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [focusedField, setFocusedField] = useState("");

  if (user) {
    return <Navigate to={nextParam || "/dashboard"} replace />;
  }

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    if (email.trim() === "") {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      isValid = false;
    }

    if (!isValid) return;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      login(res.data.user);

      navigate(nextParam || "/dashboard");
    } catch (e) {
      console.log(e);
      alert(e.response?.data?.message || "Login failed");
    }
  };

  const getInputStyle = (field) => ({
    width: "100%",
    padding: "14px 16px",
    marginTop: "12px",
    borderRadius: "8px",
    border:
      focusedField === field
        ? "1.5px solid #2563EB"
        : "1px solid #DBEAFE",
    outline: "none",
    fontSize: "16px",
    boxSizing: "border-box",
    backgroundColor: "#FFFFFF",
    color: "#1E293B",
    boxShadow:
      focusedField === field
        ? "0 0 0 3px rgba(37, 99, 235, 0.12)"
        : "none",
    transition: "all 0.2s ease",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F0F7FF",
        fontFamily: "Arial, sans-serif",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #DBEAFE",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1E3A8A",
            marginBottom: "10px",
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          Welcome Back
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748B",
            marginBottom: "30px",
            fontSize: "15px",
          }}
        >
          Sign in to continue to SyncSpace
        </p>

        {nextParam && (
          <div
            style={{
              padding: "10px 12px",
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: 8,
              color: "#1E3A8A",
              fontSize: 13,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Sign in to continue to your shared room.
          </div>
        )}

        <input
          style={getInputStyle("email")}
          type="email"
          placeholder="Email"
          value={email}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField("")}
          onChange={(e) => setEmail(e.target.value)}
        />

        {emailError && (
          <p
            style={{
              color: "#DC2626",
              fontSize: "13px",
              marginTop: "5px",
              marginBottom: "8px",
            }}
          >
            {emailError}
          </p>
        )}

        <input
          style={getInputStyle("password")}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField("")}
          onChange={(e) => setPassword(e.target.value)}
        />

        {passwordError && (
          <p
            style={{
              color: "#DC2626",
              fontSize: "13px",
              marginTop: "5px",
              marginBottom: "8px",
            }}
          >
            {passwordError}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "15px",
          }}
        >
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />

          <label
            htmlFor="showPassword"
            style={{
              color: "#475569",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Show Password
          </label>
        </div>

        <div
          style={{
            textAlign: "right",
            marginTop: "15px",
          }}
        >
          <Link
            to="/forget-password"
            style={{
              color: "#2563EB",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <button
          style={{
            width: "100%",
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            border: "none",
            padding: "17px",
            borderRadius: "8px",
            fontSize: "17px",
            fontWeight: "600",
            marginTop: "25px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(37, 99, 235, 0.20)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1D4ED8";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 6px 14px rgba(37, 99, 235, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2563EB";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 10px rgba(37, 99, 235, 0.20)";
          }}
          onClick={handleLogin}
        >
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#475569",
          }}
        >
          Don't have an account?{" "}
          <Link
            to={registerLinkTo}
            style={{
              color: "#2563EB",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}