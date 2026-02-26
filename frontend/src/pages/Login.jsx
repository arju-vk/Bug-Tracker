import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-dark-800 rounded-xl shadow-2xl border border-dark-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-dark-100">
            Welcome Back
          </h2>
          <p className="mt-2 text-dark-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-accent-rose/20 border border-accent-rose text-accent-rose px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-transparent transition-colors"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-transparent transition-colors"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-violet hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-violet disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="font-medium text-accent-sky hover:text-sky-400 transition-colors"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
