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

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="relative bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#0f172a] border-b border-white/10 sticky top-0 z-50 shadow-lg">
      
      {/* Glowing Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky to-transparent opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative z-10">
        
        {/* Logo & New Brand Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/dec-logo.png"
            alt="Douglas Educational Consultants"
            className="h-10 w-auto group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col justify-center">
            <span className="text-[15px] md:text-[17px] font-bold text-white leading-tight tracking-wide">
              Douglas Educational
            </span>
            <span className="text-[9px] uppercase tracking-widest text-sky font-bold leading-tight">
              Consultants
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/" className={`text-sm transition-colors ${isActive('/') ? 'text-white font-bold' : 'text-gray-300 hover:text-white font-medium'}`}>Home</Link>
          <Link to="/jobs" className={`text-sm transition-colors ${isActive('/jobs') ? 'text-white font-bold' : 'text-gray-300 hover:text-white font-medium'}`}>Jobs</Link>
          <Link to="/talent-pool" className={`text-sm transition-colors ${isActive('/talent-pool') ? 'text-white font-bold' : 'text-gray-300 hover:text-white font-medium'}`}>Talent Pool</Link>

          {/* Admin Link */}
          {role === 'admin' && (
            <Link to="/admin" className={`text-sm transition-colors border-l border-white/20 pl-6 md:pl-8 ${location.pathname.startsWith('/admin') ? 'text-sky font-bold' : 'text-gray-300 hover:text-sky font-medium'}`}>
              👨‍💼 Admin
            </Link>
          )}

          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 hidden md:block">👤 {user.email.split('@')[0]}</span>
              <button onClick={handleLogout} className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-lg text-sm font-bold hover:bg-white hover:text-navy transition-colors shadow-sm">
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="relative group inline-flex overflow-hidden rounded-lg p-[1px] shadow-sm hover:shadow-md transition-shadow"
            >
              {/* The rotating gradient - NOW WITH BRIGHT WHITE LIGHT */}
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1e3a8a_0%,#1e3a8a_60%,#ffffff_80%,#3b9ee5_100%)]" />
              
              {/* The actual button face */}
              <span className="inline-flex h-full w-full items-center justify-center rounded-lg bg-navy px-4 py-1.5 text-xs font-bold text-white backdrop-blur-3xl transition-colors group-hover:bg-navy/95 tracking-wide">
                Login
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;