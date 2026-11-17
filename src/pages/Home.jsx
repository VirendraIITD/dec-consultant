import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button'; 

const categories = [
  { name: 'Engineering', icon: '⚙️', bg: 'bg-sky/10', border: 'border-sky' },
  { name: 'Law', icon: '⚖️', bg: 'bg-purple-500/10', border: 'border-purple-500' },
  { name: 'Management', icon: '📊', bg: 'bg-emerald/10', border: 'border-emerald' },
  { name: 'Others', icon: '📁', bg: 'bg-amber/10', border: 'border-amber' },
];

// Why: We store categories in an array instead of hardcoding 4 cards. This is called "data-driven rendering".
// Benefit: If you add a 5th category later, just add one line here. The UI updates automatically

function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* HERO SECTION - Added subtle gradient */}
      <section className="bg-gradient-to-br from-cream via-white to-sky/5 px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-navy mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
          Explore opportunities across Engineering, Law, Management, and more.
          DEC Consultant connects top talent with leading organizations.
        </p>
        <Button to="/jobs" rounded="rounded-full" className="px-8 text-base">
          Browse Jobs →
        </Button>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-6xl mx-auto px-4 pb-16 pt-8">
        <h2 className="text-2xl font-bold text-navy mb-6 text-center">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/jobs?category=${cat.name}`}
              /* FIXED: Added cat.bg and cat.border to make colors work */
              className={`${cat.bg} ${cat.border} p-6 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all text-center border-2`}
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-bold text-navy text-sm">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* TALENT POOL CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-amber/10 border-2 border-amber rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-charcoal mb-2">
            Didn't find a matching role?
          </h3>
          <p className="text-charcoal/70 mb-4">
            Join our Talent Pool — we'll contact you when a suitable job opens.
          </p>
          <Button to="/talent-pool" rounded="rounded-full" className="px-8 py-3">
            📩 Submit Resume
          </Button>
        </div>
      </section>

      {/* FOOTER */}

      <Footer />
    </div>
  );
}

export default Home;