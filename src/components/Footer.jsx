import { Link } from 'react-router-dom';

function Footer() {
  return (
    // 🎨 GRADIENT FOOTER (Matches Header)
    <footer className="relative bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#0f172a] text-white mt-auto border-t border-white/10">
      
      {/* Glowing Top Line (Matches Header Bottom Line) */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky to-transparent opacity-70"></div>

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        
        {/* Top Section: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/dec-logo.png"
                alt="DEC Consultant"
                className="h-10 w-auto bg-white rounded-full p-1 shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight">DEC Consultant</span>
                <span className="text-[10px] uppercase tracking-wider text-sky font-bold leading-tight">Building Careers</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm mt-4 leading-relaxed">
              Connecting top talent with leading organizations across Engineering, Law, Management, and Support Staff.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-sky transition">Home</Link></li>
              <li><Link to="/jobs" className="hover:text-sky transition">Browse Jobs</Link></li>
              <li><Link to="/talent-pool" className="hover:text-sky transition">Talent Pool</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="mailto:hr@decconsultant.com" className="hover:text-sky transition">hr@decconsultant.com</a></li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/jyoti-mathur-2b042732" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-sky transition"
                >
                  LinkedIn
                </a>
              </li>
              <li><a href="#" className="hover:text-sky transition">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 DEC Consultant. All rights reserved.</p>
          <p>Built by PHAZE AI PVT LIMITED</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;