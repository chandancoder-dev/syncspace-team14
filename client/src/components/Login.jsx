import "../styles/login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Sign in to continue to SyncSpace</p>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        
        <div className="show-password">
        <input type="checkbox" id="showPassword" />
        <label htmlFor="showPassword">Show Password</label>
        </div>

        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>

        <button>Login</button>

        <p className="register-text">
          Don't have an account? <a href="#">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;