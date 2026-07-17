import { NavLink } from "react-router-dom";
import "/src/styles/navbar.css";

function NavBar() {
   return (
      <div className="navbar-wrap">
         <nav className="navbar" aria-label="Primary">
            <NavLink to="/" end className="navbar-brand">
               SyncSpace
            </NavLink>

            <div className="navbar-links">
               <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
               >
                  Home
               </NavLink>
               <NavLink
                  to="/about"
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
               >
                  About
               </NavLink>
               <NavLink
                  to="/features"
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
               >
                  Features
               </NavLink>
               <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
               >
                  Dashboard
               </NavLink>
            </div>
         </nav>
      </div>
   );
}

export default NavBar;