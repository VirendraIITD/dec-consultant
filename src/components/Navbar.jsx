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
    // 🎨 GRADIENT HEADER
    <nav className="relative bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#0f172a] border-b border-white/10 sticky top-0 z-50 shadow-lg">
      
      {/* Glowing Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky to-transparent opacity-70"></div>

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between relative z-10">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/dec-logo.png"
            alt="DEC Consultant"
            className="h-9 w-auto bg-white rounded-full p-1 group-hover:scale-105 transition-transform shadow-sm"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white leading-tight tracking-wide">DEC</span>
            <span className="text-[10px] uppercase tracking-wider text-sky font-bold leading-tight">Consultant</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className={`text-sm transition-colors ${isActive('/') ? 'text-white font-bold' : 'text-gray-300 hover:text-white font-medium'}`}>Home</Link>
          <Link to="/jobs" className={`text-sm transition-colors ${isActive('/jobs') ? 'text-white font-bold' : 'text-gray-300 hover:text-white font-medium'}`}>Jobs</Link>
          <Link to="/talent-pool" className={`text-sm transition-colors ${isActive('/talent-pool') ? 'text-white font-bold' : 'text-gray-300 hover:text-white font-medium'}`}>Talent Pool</Link>

          {/* Admin Link */}
          {role === 'admin' && (
            <Link to="/admin" className={`text-sm transition-colors border-l border-white/20 pl-8 ${location.pathname.startsWith('/admin') ? 'text-sky font-bold' : 'text-gray-300 hover:text-sky font-medium'}`}>
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
            <Link to="/login" className="bg-sky text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-white hover:text-navy transition-colors shadow-[0_0_15px_rgba(59,158,229,0.4)]">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;