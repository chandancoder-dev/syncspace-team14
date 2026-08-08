import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/SyncSpace.png" alt="SyncSpace Logo" />
            <h2>SyncSpace</h2>
          </div>

          <p>
            Real-Time Collaborative Coding Platform that enables developers,
            students, and teams to code, brainstorm, and communicate seamlessly
            in one shared workspace.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/features">Features</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>

          <p>support@syncspace.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 SyncSpace. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
