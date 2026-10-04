import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';

function CreateJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    sub_category: '',
    location: '',
    deadline: '',
    description: '',
    requirements: '',
    status: 'active',
  });

  // Verify admin on load
  useEffect(() => {
    async function checkAdmin() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userData.user.id)
        .single();

      if (profile?.role !== 'admin') {
        setError('Admin access required');
      }
      setLoading(false);
    }
    checkAdmin();
  }, [navigate]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // Calculate minimum deadline (today)
  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Validate deadline is in the future
      if (new Date(formData.deadline) <= new Date()) {
        setError('Deadline must be in the future');
        setSubmitting(false);
        return;
      }

      // Insert job into database
      const { data, error: insertError } = await supabase
        .from('jobs')
        .insert({
          title: formData.title,
          category: formData.category,
          sub_category: formData.sub_category || null,
          location: formData.location,
          deadline: formData.deadline,
          description: formData.description,
          requirements: formData.requirements || null,
          status: formData.status,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Success → redirect to the new job's detail page
      alert('Job posted successfully!');
      navigate(`/jobs/${data.id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create job. Please try again.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <p className="text-center py-20 text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error && error === 'Admin access required') {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-500 mb-2">{error}</h2>
          <Link to="/" className="text-sky hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          to="/admin"
          className="text-charcoal/60 hover:text-sky text-sm mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Create New Job</h1>
          <p className="text-charcoal/70">
            Post a new position that will appear on the public job listings.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-sm space-y-6"
        >
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">
              📋 Job Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-sky"
                >
                  <option value="">Select Category</option>
                  <option value="Engineering">⚙️ Engineering</option>
                  <option value="Law">⚖️ Law</option>
                  <option value="Management">📊 Management</option>
                  <option value="Others">📁 Others</option>
                </select>
              </div>

              {/* Sub-Category */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Sub-Category
                </label>
                <input
                  type="text"
                  name="sub_category"
                  value={formData.sub_category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky"
                  placeholder="e.g., Computer Science"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky"
                  placeholder="e.g., Bangalore"
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  min={today}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Description */}
          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">
              📝 Job Details
            </h3>

            <div className="space-y-5">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky resize-none"
                  placeholder="Describe the role, responsibilities, and what the candidate will do..."
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky resize-none"
                  placeholder="Qualifications, skills, experience needed..."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Status */}
          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">
              ⚙️ Publishing Options
            </h3>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Job Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-sky"
              >
                <option value="active">✅ Active (visible to candidates)</option>
                <option value="draft">📝 Draft (save for later)</option>
                <option value="closed">🔒 Closed (no new applications)</option>
              </select>
              <p className="text-xs text-charcoal/50 mt-1">
                Active jobs appear on the public job listings
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-sky text-white py-3 rounded-lg font-medium hover:bg-navy transition disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : '🚀 Publish Job'}
            </button>
            <Link
              to="/admin"
              className="px-6 py-3 bg-white text-navy border border-gray-200 rounded-lg font-medium hover:border-sky transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Preview */}
        {formData.title && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-navy mb-3">
              👁️ Preview (How it will look)
            </h3>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${
                  formData.category === 'Engineering'
                    ? 'bg-sky'
                    : formData.category === 'Law'
                    ? 'bg-purple-500'
                    : formData.category === 'Management'
                    ? 'bg-emerald'
                    : 'bg-amber'
                }`}
              >
                {formData.category || 'Category'}
              </span>
              <h4 className="text-xl font-semibold text-navy mt-3 mb-1">
                {formData.title}
              </h4>
              <p className="text-sm text-charcoal/60">
                📍 {formData.location || 'Location'} •{' '}
                {formData.sub_category || 'Sub-category'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateJob;