import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { isAuthenticated, login, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        🎬 CineVault
      </NavLink>

      <div className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/browse"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          🎬 Browse
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          ➕ Add Movie
        </NavLink>

        <NavLink
          to="/saved"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          ❤️ Saved
        </NavLink>

        <button
          type="button"
          className="theme-button"
          onClick={toggleTheme}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {isAuthenticated ? (
          <button
            type="button"
            className="auth-button logout-button"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <button
            type="button"
            className="auth-button"
            onClick={() => login()}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;