import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
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
      await register(formData.name, formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-dark-800 rounded-xl shadow-2xl border border-dark-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-dark-100">
            Create Account
          </h2>
          <p className="mt-2 text-dark-400">Get started with Bug Tracker</p>
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
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-transparent transition-colors"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
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
                minLength={6}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-transparent transition-colors"
                placeholder="Password (min 6 characters)"
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
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-accent-sky hover:text-sky-400 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
