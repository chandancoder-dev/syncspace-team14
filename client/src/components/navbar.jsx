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
      backgroundColor: "#1e293b",
      color: "#ffffff",
      padding: "20px 60px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    navContainer: {
      display: "flex",
      alignItems: "center",
      gap: "35px",
    },

    link: {
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "16px",
      fontWeight: "500",
      transition: "0.3s",
    },

    userName: {
      color: "#ffffff",
      fontWeight: "600",
      fontSize: "16px",
    },

    button: {
      backgroundColor: "#2563eb",
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      padding: "8px 16px",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: "500",
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <Link to="/" style={styles.link}>
          Home
        </Link>

        <Link to="/about" style={styles.link}>
          About
        </Link>

        <Link to="/features" style={styles.link}>
          Features
        </Link>

        {user ? (
          <>
            <span style={styles.userName}>
              Hello, {user.name}
            </span>

            <button
              style={styles.button}
              onClick={handleLogout}
            >
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