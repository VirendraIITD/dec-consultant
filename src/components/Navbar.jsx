import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Button from './Button'; 

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

  // 🎯 Helper for the glowing line effect
  const getLineClass = (path) => 
    `absolute left-0 bottom-0 w-full h-[2px] bg-white transition-all duration-300 ${
      isActive(path) ? 'opacity-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'opacity-0'
    }`;

  return (
    <nav className="relative bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#0f172a] border-b border-white/10 sticky top-0 z-50 shadow-lg">
      
      {/* Glowing Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky to-transparent opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative z-10">
        
        {/* Logo & Brand Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/dec-logo.png"
            alt="Douglas Educational Consultants"
            className="h-14 w-auto group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col justify-center">
            <span className="text-[15px] md:text-[17px] font-bold text-white leading-tight tracking-wide">
              Douglas Educational Consultants
            </span>
            <span className="text-[9px] md:text-[11px] tracking-widest text-sky font-bold leading-tight">
              Recruitment and Staffing Solutions
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 md:gap-8">
          
          {/* 🎯 Added relative & pb-1, plus the span for the line */}
          <Link to="/" className={`relative pb-1 text-sm transition-colors ${isActive('/') ? 'text-white font-bold' : 'text-gray-300 hover:text-white font-medium'}`}>
            Home
            <span className={getLineClass('/')}></span>
          </Link>
          
          <Link to="/jobs" className={`relative pb-1 text-sm transition-colors ${isActive('/jobs') ? 'text-white font-bold' : 'text-gray-300 hover:text-white font-medium'}`}>
            Jobs
            <span className={getLineClass('/jobs')}></span>
          </Link>
          
          <Link to="/talent-pool" className={`relative pb-1 text-sm transition-colors ${isActive('/talent-pool') ? 'text-white font-bold' : 'text-gray-300 hover:text-white font-medium'}`}>
            Talent Pool
            <span className={getLineClass('/talent-pool')}></span>
          </Link>

          {/* Admin Link */}
          {role === 'admin' && (
            <Link to="/admin" className={`relative pb-1 text-sm transition-colors border-l border-white/20 pl-6 md:pl-8 ${location.pathname.startsWith('/admin') ? 'text-sky font-bold' : 'text-gray-300 hover:text-sky font-medium'}`}>
              👨‍💼 Admin
              <span className={`absolute left-6 md:left-8 bottom-0 w-[calc(100%-1.5rem)] md:w-[calc(100%-2rem)] h-[2px] bg-sky transition-all duration-300 ${location.pathname.startsWith('/admin') ? 'opacity-100 shadow-[0_0_8px_rgba(59,158,229,0.8)]' : 'opacity-0'}`}></span>
            </Link>
          )}

          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 hidden md:block">👤 {user.email.split('@')[0]}</span>
              
              <Button onClick={handleLogout} isSmall={true}>
                Logout
              </Button>
            </div>
          ) : (
            <Button to="/login" isSmall={true}>
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;