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

    return (
        <div className="login-container">
            <div className="login-card">

                <h1>Welcome Back</h1>
                <p>Sign in to continue to SyncSpace</p>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {emailError && (
                    <p className="error-message">{emailError}</p>
                )}

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {passwordError && (
                    <p className="error-message">{passwordError}</p>
                )}

                <div className="show-password">
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

                <div className="forgot-password">
                    <a href="#">Forgot Password?</a>
                </div>

                <button onClick={handleLogin}>
                    Login
                </button>

                <p className="register-text">
                    Don't have an account?{" "}
                    <a href="#">Register</a>
                </p>

            </div>
        </div>
    );
}

export default Login;