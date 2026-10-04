import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';

function EditJob() {
  const { id } = useParams();
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

  // Load job + verify admin
  useEffect(() => {
    async function init() {
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
        setLoading(false);
        return;
      }

      // Fetch job
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (jobError || !job) {
        setError('Job not found');
        setLoading(false);
        return;
      }

      setFormData({
        title: job.title || '',
        category: job.category || '',
        sub_category: job.sub_category || '',
        location: job.location || '',
        deadline: job.deadline || '',
        description: job.description || '',
        requirements: job.requirements || '',
        status: job.status || 'active',
      });
      setLoading(false);
    }
    init();
  }, [id, navigate]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Validate deadline
      const today = new Date().toISOString().split('T')[0];
      if (formData.deadline < today && formData.status === 'active') {
        setError('Active jobs must have a future deadline');
        setSubmitting(false);
        return;
      }

      // Update job
      const { error: updateError } = await supabase
        .from('jobs')
        .update({
          title: formData.title,
          category: formData.category,
          sub_category: formData.sub_category || null,
          location: formData.location,
          deadline: formData.deadline,
          description: formData.description,
          requirements: formData.requirements || null,
          status: formData.status,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      alert('Job updated successfully!');
      navigate(`/jobs/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update job. Please try again.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <p className="text-center py-20 text-gray-400">Loading job...</p>
      </div>
    );
  }

  if (error === 'Admin access required' || error === 'Job not found') {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-500 mb-2">{error}</h2>
          <Link to="/admin/manage-jobs" className="text-sky hover:underline">
            ← Back to Manage Jobs
          </Link>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          to="/admin/manage-jobs"
          className="text-charcoal/60 hover:text-sky text-sm mb-4 inline-block"
        >
          ← Back to Manage Jobs
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Edit Job</h1>
          <p className="text-charcoal/70">
            Update the details below. Changes appear instantly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-sm space-y-6"
        >
          {/* Section 1 */}
          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">
              📋 Job Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                />
              </div>

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
                />
              </div>

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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky"
                />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">
              📝 Job Details
            </h3>

            <div className="space-y-5">
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
                />
              </div>

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
                />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">
              ⚙️ Status
            </h3>

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
              {submitting ? 'Saving...' : '💾 Save Changes'}
            </button>
            <Link
              to="/admin/manage-jobs"
              className="px-6 py-3 bg-white text-navy border border-gray-200 rounded-lg font-medium hover:border-sky transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditJob;