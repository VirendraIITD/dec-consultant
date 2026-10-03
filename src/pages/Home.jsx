import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const categories = [
  { name: 'Engineering', icon: '⚙️' },
  { name: 'Law', icon: '⚖️' },
  { name: 'Management', icon: '📊' },
  { name: 'Others', icon: '📁' },
];

// Why: We store categories in an array instead of hardcoding 4 cards. This is called "data-driven rendering".
// Benefit: If you add a 5th category later, just add one line here. The UI updates automatically

function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-navy mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
          Explore opportunities across Engineering, Law, Management, and more.
          DEC Consultant connects top talent with leading organizations.
        </p>
        <Link
          to="/jobs"
          className="inline-block bg-sky text-white px-8 py-3 rounded-full font-medium hover:bg-navy transition shadow-lg"
        >
          Browse Jobs →
        </Link>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-navy mb-6 text-center">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/jobs?category=${cat.name}`}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center border border-gray-100"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-navy text-sm">{cat.name}</h3>
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
          <Link
            to="/talent-pool"
            className="inline-block bg-amber text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition"
          >
            📩 Submit Your Resume
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 text-sm text-charcoal/60 border-t">
        © 2026 DEC Consultant • PHAZE AI PVT LIMITED
      </footer>
    </div>
  );
}

export default Home;