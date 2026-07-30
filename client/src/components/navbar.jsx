import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function NavBar() {
  const token = localStorage.getItem("token");

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/features">Features</Link>
      {token ? (
        <Link to="/dashboard">Dashboard</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}

export default NavBar;
