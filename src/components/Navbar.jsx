import { Link } from 'react-router-dom';

function Navbar() {
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
            <span className="text-lg font-bold text-navy leading-tight">DEC</span>
            <span className="text-xs text-charcoal/70 leading-tight">Consultant</span>
          </div>
        </Link>

        {/* Navigation Links */}
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
          <Link
            to="/login"
            className="bg-sky text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;