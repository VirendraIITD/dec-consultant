import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Footer from '../components/Footer'; // ⬅ ADDED

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

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    setLoading(false);

    if (profile?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/jobs');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      
      {/* ⬅ Main content with flex-grow to center the login box */}
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

      <Footer /> {/* ⬅ ADDED FOOTER */}
    </div>
  );
}

export default Login;