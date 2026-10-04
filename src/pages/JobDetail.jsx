import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';

function JobDetail() {
  const { id } = useParams();          // Get job ID from URL
  const navigate = useNavigate();       // For redirect after apply
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job details on load
  useEffect(() => {
    async function fetchJob() {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error:', error);
        setError('Job not found');
      } else {
        setJob(data);
      }
      setLoading(false);
    }
    fetchJob();
  }, [id]);

  // Handle Apply button
  async function handleApply() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      alert('Please login to apply for this job');
      navigate('/login');
      return;
    }
    navigate(`/apply/${id}`);
  }

  // Category color mapping
  const categoryColors = {
    Engineering: 'bg-sky',
    Law: 'bg-purple-500',
    Management: 'bg-emerald',
    Others: 'bg-amber',
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <p className="text-center py-20 text-gray-400">Loading job details...</p>
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-navy mb-2">Job Not Found</h2>
          <p className="text-gray-500 mb-6">This job may have been removed.</p>
          <Link to="/jobs" className="text-sky hover:underline">
            ← Back to all jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          to="/jobs"
          className="text-charcoal/60 hover:text-sky text-sm mb-4 inline-block"
        >
          ← Back to all jobs
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Job Details */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
            {/* Category Badge */}
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${
                categoryColors[job.category] || 'bg-gray-400'
              }`}
            >
              {job.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl font-bold text-navy mt-4 mb-3">
              {job.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-charcoal/60 mb-6">
              <span>📍 {job.location}</span>
              {job.sub_category && <span>🏷️ {job.sub_category}</span>}
              <span>
                📅 Deadline: {new Date(job.deadline).toLocaleDateString('en-IN')}
              </span>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-100" />

            {/* Description */}
            <h2 className="text-xl font-bold text-navy mb-3">
              Job Description
            </h2>
            <p className="text-charcoal/80 leading-relaxed mb-6">
              {job.description || 'No description provided.'}
            </p>

            {/* Requirements */}
            {job.requirements && (
              <>
                <h2 className="text-xl font-bold text-navy mb-3">
                  Requirements
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  {job.requirements}
                </p>
              </>
            )}
          </div>

          {/* RIGHT: Apply Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-navy mb-4">
                Interested in this role?
              </h3>

              <div className="space-y-3 text-sm text-charcoal/70 mb-6">
                <div className="flex justify-between">
                  <span>Position</span>
                  <span className="font-medium text-navy">Full-time</span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="font-medium text-navy">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="font-medium text-navy">{job.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deadline</span>
                  <span className="font-medium text-navy">
                    {new Date(job.deadline).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full bg-sky text-white py-3 rounded-xl font-medium hover:bg-navy transition shadow-md"
              >
                Apply Now →
              </button>

              <p className="text-xs text-center text-charcoal/50 mt-4">
                Login required to apply
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default JobDetail;