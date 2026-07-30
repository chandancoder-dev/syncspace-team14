import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <img src="/SyncSpace.png" alt="SyncSpace" style={{ width: 50, height: 50 }} />
            <h2 style={{ margin: 0 }}>SyncSpace</h2>
          </div>

          <p>
            Real-Time Collaborative Coding Platform that enables developers,
            students, and teams to code, brainstorm, and communicate seamlessly.
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

          <p>Email: support@syncspace.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 SyncSpace. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
