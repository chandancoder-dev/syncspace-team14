import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  console.log("LOGIN COMPONENT UPDATED");
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
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem("token", res.data.token);

    alert("Login Successful!");
    navigate("/create-room");
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
      padding: "12px",
      marginTop: "12px",
      borderRadius: "8px",
      border: "1px solid #DBEAFE",
      outline: "none",
      fontSize: "15px",
      boxSizing: "border-box",
    },

    error: {
      color: "red",
      fontSize: "13px",
      marginTop: "5px",
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
      padding: "13px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "bold",
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

        <p style={styles.subHeading}>
          Sign in to continue to SyncSpace
        </p>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {emailError && (
          <p style={styles.error}>{emailError}</p>
        )}

        <input
          style={styles.input}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {passwordError && (
          <p style={styles.error}>{passwordError}</p>
        )}
                <div style={styles.checkboxRow}>
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />

          <label htmlFor="showPassword">
            Show Password
          </label>
        </div>

        <div style={styles.forgot}>
          <a href="#" style={styles.forgotLink}>
            Forgot Password?
          </a>
        </div>

        <button
          style={styles.button}
          onClick={handleLogin}
        >
          Login
        </button>

        <p style={styles.register}>
          Don't have an account?{" "}
          <a href="#" style={styles.registerLink}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;