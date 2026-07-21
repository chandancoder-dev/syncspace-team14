import { Link } from "react-router-dom";

function NavBar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#1e293b",
      padding: "15px 30px",
    },
    navLinks: {
      display: "flex",
      gap: "20px",
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontSize: "16px",
      fontWeight: "500",
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    button: {
      padding: "8px 15px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      backgroundColor: "#2563eb",
      color: "white",
    },
    userName: {
      color: "white",
      fontWeight: "bold",
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/features" style={styles.link}>Features</Link>
      </div>

      <div style={styles.rightSection}>
        {user ? (
          <>
            <span style={styles.userName}>
              Hello, {user.name}
            </span>
            <button style={styles.button} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;