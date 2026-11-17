import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authAPI, jobsAPI } from '../../lib/api'; // ⬅ NEW API IMPORTS
import Navbar from '../../components/Navbar';

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '', category: '', sub_category: '', location: '', deadline: '', description: '', requirements: '', status: 'active',
  });

  useEffect(() => {
    async function init() {
      try {
        const user = await authAPI.getCurrentUser();
        if (!user) { navigate('/login'); return; }
        const profile = await authAPI.getProfile(user.id);
        if (profile?.role !== 'admin') { setError('Admin access required'); setLoading(false); return; }

        const job = await jobsAPI.getById(id);
        setFormData({
          title: job.title || '', category: job.category || '', sub_category: job.sub_category || '',
          location: job.location || '', deadline: job.deadline || '', description: job.description || '',
          requirements: job.requirements || '', status: job.status || 'active',
        });
      } catch (err) {
        setError('Job not found');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id, navigate]);

  function handleChange(e) { setFormData({ ...formData, [e.target.name]: e.target.value }); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      if (formData.deadline < today && formData.status === 'active') {
        setError('Active jobs must have a future deadline'); setSubmitting(false); return;
      }

      await jobsAPI.update(id, { // ⬅ API CALL
        title: formData.title, category: formData.category, sub_category: formData.sub_category || null,
        location: formData.location, deadline: formData.deadline, description: formData.description,
        requirements: formData.requirements || null, status: formData.status,
      });

      alert('Job updated successfully!');
      navigate(`/jobs/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update job.');
      setSubmitting(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-cream"><Navbar /><p className="text-center py-20 text-gray-400">Loading...</p></div>;
  if (error === 'Admin access required' || error === 'Job not found') return <div className="min-h-screen bg-cream"><Navbar /><div className="text-center py-20"><h2 className="text-2xl font-bold text-red-500 mb-2">{error}</h2><Link to="/admin/manage-jobs" className="text-sky hover:underline">← Back</Link></div></div>;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link to="/admin/manage-jobs" className="text-charcoal/60 hover:text-sky text-sm mb-4 inline-block">← Back to Manage Jobs</Link>
        <div className="mb-8"><h1 className="text-3xl font-bold text-navy mb-2">Edit Job</h1><p className="text-charcoal/70">Update the details below.</p></div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">📋 Job Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2"><label className="block text-sm font-medium text-charcoal mb-1">Job Title *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" /></div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-sky">
                  <option value="">Select Category</option>
                  <option value="Engineering">⚙️ Engineering</option>
                  <option value="Management">📊 Management</option>
                  <option value="Legal Studies">⚖️ Legal Studies</option>
                  <option value="Architecture">📐 Architecture</option>
                  <option value="Agriculture">🌾 Agriculture</option>
                  <option value="Nursing">🩺 Nursing</option>
                  <option value="Allied Science">🔬 Allied Science</option>
                  <option value="Hospitality">🏨 Hospitality</option>
                  <option value="Computer Application">💻 Computer Application</option>
                  <option value="Media & Mass Communication">📺 Media & Mass Communication</option>
                  <option value="Design">🎨 Design</option>
                  <option value="Liberal Arts">📖 Liberal Arts</option>
                  <option value="Education">🎓 Education</option>
                  <option value="Forensic Sciences">🔎 Forensic Sciences</option>
                  <option value="Others">📁 Others</option>
                </select>
              </div>
              <div><label className="block text-sm font-medium text-charcoal mb-1">Sub-Category</label><input type="text" name="sub_category" value={formData.sub_category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" /></div>
              <div><label className="block text-sm font-medium text-charcoal mb-1">Location *</label><input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" /></div>
              <div><label className="block text-sm font-medium text-charcoal mb-1">Deadline *</label><input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required min={today} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" /></div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">📝 Job Details</h3>
            <div className="space-y-5">
              <div><label className="block text-sm font-medium text-charcoal mb-1">Description *</label><textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky resize-none" /></div>
              <div><label className="block text-sm font-medium text-charcoal mb-1">Requirements</label><textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky resize-none" /></div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">⚙️ Status</h3>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-sky">
              <option value="active">✅ Active</option>
              <option value="draft">📝 Draft</option>
              <option value="closed">🔒 Closed</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="flex-1 bg-sky text-white py-3 rounded-lg font-medium hover:bg-navy transition disabled:opacity-50">{submitting ? 'Saving...' : '💾 Save Changes'}</button>
            <Link to="/admin/manage-jobs" className="px-6 py-3 bg-white text-navy border border-gray-200 rounded-lg font-medium hover:border-sky transition text-center">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditJob;