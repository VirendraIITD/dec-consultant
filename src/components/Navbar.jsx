import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function Navbar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        setRole(profile?.role);
      }
    }
    loadUser();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          setRole(profile?.role);
        } else {
          setRole(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/dec-logo.png"
            alt="DEC Consultant"
            className="h-12 w-auto"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-navy leading-tight">
              DEC
            </span>
            <span className="text-xs text-charcoal/70 leading-tight">
              Consultant
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-charcoal hover:text-sky font-medium text-sm">
            Home
          </Link>
          <Link to="/jobs" className="text-charcoal hover:text-sky font-medium text-sm">
            Jobs
          </Link>
          <Link to="/talent-pool" className="text-charcoal hover:text-sky font-medium text-sm">
            Talent Pool
          </Link>

          {role === 'admin' && (
            <Link
              to="/admin"
              className="text-navy hover:text-sky font-semibold text-sm border-l border-gray-200 pl-6"
            >
              👨‍💼 Admin
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-charcoal/70 hidden md:block">
                👤 {user.email.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-sky text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;