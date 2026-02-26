import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-dark-800 border-b border-dark-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-dark-100 hover:text-accent-violet transition-colors"
            >
              🐛 Bug Tracker
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:bg-dark-700 px-3 py-2 rounded-md text-dark-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-accent-violet rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-dark-300">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-dark-700 hover:bg-dark-600 px-3 py-2 rounded-md text-sm text-dark-300 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:bg-dark-700 px-3 py-2 rounded-md text-dark-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-accent-violet hover:bg-violet-600 text-white px-3 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
