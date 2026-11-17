import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log("1. Login button clicked. Attempting to login...");

    try {
      // 1. Login via API
      const data = await authAPI.login(email, password);
      console.log("2. Login successful! User ID:", data.user.id);

      // 2. Fetch profile
      const profile = await authAPI.getProfile(data.user.id);
      console.log("3. Profile fetched:", profile);

      setLoading(false);

      // 3. Redirect
      if (profile?.role === 'admin') {
        console.log("4. Role is ADMIN. Redirecting to /admin...");
        navigate('/admin');
      } else {
        console.log("4. Role is NOT ADMIN. Redirecting to /jobs...");
        navigate('/jobs');
      }
    } catch (err) {
      console.error("❌ ERROR:", err);
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
          <div className="text-center mb-6">
            <Link to="/" className="inline-block mb-4">
              <img src="/dec-logo.png" alt="DEC" className="h-12 mx-auto" />
            </Link>
            <h1 className="text-3xl font-bold text-navy mb-2">Welcome Back</h1>
            <p className="text-charcoal/60 text-sm">Login to DEC Consultant Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="••••••••" />
            </div>

            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-navy text-white py-2 rounded-lg font-medium hover:bg-sky transition disabled:opacity-50 shadow-md">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-charcoal/60 mt-6">
            Don't have an account? <Link to="/signup" className="text-sky font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;