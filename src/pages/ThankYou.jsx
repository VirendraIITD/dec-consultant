import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function ThankYou() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🎉</div>

        <h1 className="text-4xl font-bold text-navy mb-4">
          Application Submitted!
        </h1>

        <p className="text-lg text-charcoal/70 mb-8">
          Thank you for applying. Your profile and resume have been sent to our
          HR panel for review.
        </p>

        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 text-left">
          <h3 className="font-semibold text-navy mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-charcoal/70">
            <li>✅ Our HR team will review your application</li>
            <li>📧 You'll receive an email if shortlisted</li>
            <li>⏱️ Reviews typically take 5-7 business days</li>
          </ul>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/jobs"
            className="bg-sky text-white px-6 py-2 rounded-lg font-medium hover:bg-navy transition"
          >
            Browse More Jobs
          </Link>
          <Link
            to="/"
            className="bg-white text-navy border border-gray-200 px-6 py-2 rounded-lg font-medium hover:border-sky transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;