import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function Navbar() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const location = useLocation();
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

  // Helper for active link styling
  const isActive = (path) => location.pathname === path;

  return (
    // Frosted glass Apple-style header
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/dec-logo.png"
            alt="DEC Consultant"
            className="h-10 w-auto"
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

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`font-medium text-sm transition ${isActive('/') ? 'text-navy font-bold' : 'text-charcoal/70 hover:text-sky'}`}
          >
            Home
          </Link>
          <Link 
            to="/jobs" 
            className={`font-medium text-sm transition ${isActive('/jobs') ? 'text-navy font-bold' : 'text-charcoal/70 hover:text-sky'}`}
          >
            Jobs
          </Link>
          <Link 
            to="/talent-pool" 
            className={`font-medium text-sm transition ${isActive('/talent-pool') ? 'text-navy font-bold' : 'text-charcoal/70 hover:text-sky'}`}
          >
            Talent Pool
          </Link>

          {/* Admin Link (Only visible to admins) */}
          {role === 'admin' && (
            <Link
              to="/admin"
              className={`font-semibold text-sm transition border-l border-gray-200 pl-6 ${
                location.pathname.startsWith('/admin') ? 'text-navy' : 'text-charcoal/70 hover:text-sky'
              }`}
            >
              👨‍💼 Admin
            </Link>
          )}

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-charcoal/60 hidden md:block">
                {user.email.split('@')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky transition shadow-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-navy text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-sky transition shadow-sm"
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