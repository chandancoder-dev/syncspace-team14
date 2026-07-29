import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
          S
        </div>
        <span className="text-xl font-bold text-blue-600">
          SyncSpace
        </span>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50"
        >
          About
        </Link>
        <Link
          to="/features"
          className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50"
        >
          Features
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;