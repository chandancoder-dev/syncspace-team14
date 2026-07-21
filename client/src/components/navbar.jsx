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
<<<<<<< HEAD
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
=======
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
>>>>>>> 1580fe9 (Convert Login page to React inline styles)
    },
  };

  return (
    <nav style={styles.navbar}>
<<<<<<< HEAD
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

=======
      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/features" style={styles.link}>Features</Link>
      </div>

      <div style={styles.rightSection}>
>>>>>>> 1580fe9 (Convert Login page to React inline styles)
        {user ? (
          <>
            <span style={styles.userName}>
              Hello, {user.name}
            </span>
<<<<<<< HEAD

            <button
              style={styles.button}
              onClick={handleLogout}
            >
=======
            <button style={styles.button} onClick={handleLogout}>
>>>>>>> 1580fe9 (Convert Login page to React inline styles)
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