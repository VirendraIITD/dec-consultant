import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Top Section: Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/dec-logo.png"
                alt="DEC Consultant"
                className="h-10 w-auto bg-white rounded-full p-1"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight">
                  DEC Consultant
                </span>
                <span className="text-xs text-white/60 leading-tight">
                  Building Careers
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/60 max-w-sm mt-4 leading-relaxed">
              Connecting top talent with leading organizations across Engineering, Law, Management, and Support Staff.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link to="/" className="hover:text-sky transition">Home</Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-sky transition">Browse Jobs</Link>
              </li>
              <li>
                <Link to="/talent-pool" className="hover:text-sky transition">Talent Pool</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="mailto:hr@decconsultant.com" className="hover:text-sky transition">
                  hr@decconsultant.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky transition">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sky transition">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© 2026 DEC Consultant. All rights reserved.</p>
          <p>Built by PHAZE AI PVT LIMITED</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;