import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Footer from '../components/Footer'; // ⬅ ADDED

function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id, email: email, full_name: fullName, role: 'candidate',
      });
      if (profileError) console.error('Profile error:', profileError);
    }

    setLoading(false);
    alert('Account created! Please login.');
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      
      {/* ⬅ Main content with flex-grow to center the signup box */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
          <div className="text-center mb-6">
            <Link to="/" className="inline-block mb-4">
              <img src="/dec-logo.png" alt="DEC" className="h-12 mx-auto" />
            </Link>
            <h1 className="text-3xl font-bold text-navy mb-2">Create Account</h1>
            <p className="text-charcoal/60 text-sm">Join DEC Consultant Portal</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="Your full name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="At least 6 characters" />
            </div>

            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-navy text-white py-2 rounded-lg font-medium hover:bg-sky transition disabled:opacity-50 shadow-md">
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-charcoal/60 mt-6">
            Already have an account? <Link to="/login" className="text-sky font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>

      <Footer /> {/* ⬅ ADDED FOOTER */}
    </div>
  );
}

export default Signup;