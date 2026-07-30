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

  // If already logged in, redirect away from login page
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
        `${import.meta.env.VITE_SERVER_URL || "http://localhost:8000"}/api/auth/login`,
        {
          email,
          password,
        },
      );

      localStorage.setItem("token", res.data.token);
      login(res.data.user);

      navigate(nextParam || "/dashboard");
    } catch (e) {
      console.log(e);
      alert(e.response?.data?.message || "Login failed");
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F0F7FF",
      fontFamily: "Arial, sans-serif",
      padding: "20px",
    },
    card: {
      width: "100%",
      maxWidth: "420px",
      backgroundColor: "#FFFFFF",
      border: "1px solid #DBEAFE",
      borderRadius: "16px",
      padding: "40px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    },
    heading: {
      textAlign: "center",
      color: "#1E3A8A",
      marginBottom: "10px",
      fontSize: "32px",
      fontWeight: "bold",
    },
    subHeading: {
      textAlign: "center",
      color: "#64748B",
      marginBottom: "30px",
      fontSize: "15px",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      marginTop: "12px",
      borderRadius: "8px",
      border: "1px solid #DBEAFE",
      outline: "none",
      fontSize: "16px",
      boxSizing: "border-box",
    },
    error: {
      color: "#DC2626",
      fontSize: "13px",
      marginTop: "5px",
      marginBottom: "8px",
    },
    checkboxRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "15px",
    },
    forgot: {
      textAlign: "right",
      marginTop: "15px",
    },
    forgotLink: {
      color: "#2563EB",
      textDecoration: "none",
      fontSize: "14px",
    },
    button: {
      width: "100%",
      backgroundColor: "#2563EB",
      color: "#fff",
      border: "none",
      padding: "15px",
      borderRadius: "8px",
      fontSize: "17px",
      fontWeight: "600",
      marginTop: "25px",
      cursor: "pointer",
    },
    register: {
      textAlign: "center",
      marginTop: "20px",
      color: "#475569",
    },
    registerLink: {
      color: "#2563EB",
      textDecoration: "none",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Welcome Back</h1>
        <p style={styles.subHeading}>Sign in to continue to SyncSpace</p>

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
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p style={styles.error}>{emailError}</p>}

        <input
          style={styles.input}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p style={styles.error}>{passwordError}</p>}

        <div style={styles.checkboxRow}>
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword">Show Password</label>
        </div>

        <div style={styles.forgot}>
          <Link to="/forget-password" style={styles.forgotLink}>
            Forgot Password?
          </Link>
        </div>

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
        <p style={styles.register}>
          Don't have an account?{" "}
          <Link to={registerLinkTo} style={styles.registerLink}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
