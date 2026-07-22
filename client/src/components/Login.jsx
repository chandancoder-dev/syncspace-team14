import { useState } from "react";

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleLogin = () => {
        setEmailError("");
        setPasswordError("");

        let isValid = true;

        if (email.trim() === "") {
            setEmailError("Email is required");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Please enter a valid email address");
            isValid = false;
        }

        if (password.trim() === "") {
            setPasswordError("Password is required");
            isValid = false;
        }

        if (isValid) {
            alert("Login Successful! (Backend will be connected later)");
        }
    };
    const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
        backgroundColor: "#F0F7FF",
        padding: "20px",
    },

    card: {
        width: "100%",
        maxWidth: "430px",
        backgroundColor: "#FFFFFF",
        padding: "35px",
        borderRadius: "16px",
        border: "1px solid #DBEAFE",
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(30, 58, 138, 0.12)",
    },

    heading: {
        color: "#1E3A8A",
        fontSize: "2.2rem",
        fontWeight: "700",
        marginBottom: "10px",
        lineHeight: "1.1",
    },

    subtitle: {
        color: "#64748B",
        marginBottom: "25px",
        fontSize: "16px",
    },

    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        border: "1px solid #BFDBFE",
        borderRadius: "8px",
        backgroundColor: "#FFFFFF",
        color: "#475569",
        fontSize: "16px",
        outline: "none",
        boxSizing: "border-box",
    },

    error: {
        color: "#EF4444",
        fontSize: "14px",
        textAlign: "left",
        marginTop: "-8px",
        marginBottom: "10px",
    },

    showPassword: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "18px",
        color: "#475569",
        fontSize: "14px",
    },

    checkbox: {
        width: "auto",
        margin: 0,
        accentColor: "#2563EB",
    },

    forgotPassword: {
        textAlign: "right",
        marginBottom: "18px",
    },

    link: {
        color: "#2563EB",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: "500",
    },

    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#2563EB",
        color: "#FFFFFF",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "0.3s ease",
    },

    register: {
        marginTop: "20px",
        color: "#64748B",
        fontSize: "14px",
    },

    registerLink: {
        color: "#2563EB",
        textDecoration: "none",
        fontWeight: "600",
    },
};

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.heading}>Welcome Back</h1>

                <p style={styles.subtitle}>
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

                <div style={styles.showPassword}>
                    <input
                        style={styles.checkbox}
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />

                    <label htmlFor="showPassword">
                        Show Password
                    </label>
                </div>

                <div style={styles.forgotPassword}>
                    <a href="#" style={styles.link}>
                        Forgot Password?
                    </a>
                </div>

                <button onClick={handleLogin} style={styles.button}>
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