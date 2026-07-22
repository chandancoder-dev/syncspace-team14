import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/features">Features</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default NavBar;