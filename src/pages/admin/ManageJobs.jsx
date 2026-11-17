import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, jobsAPI } from '../../lib/api'; // ⬅ NEW API IMPORTS
import Navbar from '../../components/Navbar';

const STATUS_FILTERS = [
  { id: 'all', label: 'All', icon: '📋' }, { id: 'active', label: 'Active', icon: '✅' },
  { id: 'closed', label: 'Closed', icon: '🔒' }, { id: 'draft', label: 'Draft', icon: '📝' },
];

function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const user = await authAPI.getCurrentUser();
        if (!user) { navigate('/login'); return; }
        const profile = await authAPI.getProfile(user.id);
        if (profile?.role !== 'admin') { setError('Admin access required'); setLoading(false); return; }

        const data = await jobsAPI.getAllWithAppCount();
        setJobs(data || []);
        setFiltered(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [navigate]);

  function applyFilters(filter, query) {
    let result = [...jobs];
    if (filter !== 'all') result = result.filter((j) => j.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((j) => j.title?.toLowerCase().includes(q) || j.category?.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q));
    }
    setFiltered(result);
  }

  function handleFilter(filter) { setActiveFilter(filter); applyFilters(filter, searchQuery); }
  function handleSearch(query) { setSearchQuery(query); applyFilters(activeFilter, query); }

  async function handleDelete(jobId) {
    try {
      await jobsAPI.delete(jobId); // ⬅ API CALL
      const updated = jobs.filter((j) => j.id !== jobId);
      setJobs(updated); applyFilters(activeFilter, searchQuery); setDeleteConfirm(null);
      alert('Job deleted successfully');
    } catch (err) { alert('Delete failed: ' + err.message); }
  }

  const statusColors = { active: 'bg-emerald', closed: 'bg-red-500', draft: 'bg-gray-400' };
  const categoryColors = { Engineering: 'bg-sky', Management: 'bg-emerald', 'Legal Studies': 'bg-purple-500', Architecture: 'bg-orange-500', Agriculture: 'bg-lime-500', Nursing: 'bg-rose-500', 'Allied Science': 'bg-teal-500', Hospitality: 'bg-yellow-500', 'Computer Application': 'bg-indigo-500', 'Media & Mass Communication': 'bg-pink-500', Design: 'bg-fuchsia-500', 'Liberal Arts': 'bg-cyan-500', Education: 'bg-blue-500', 'Forensic Sciences': 'bg-slate-500', Others: 'bg-amber' };

  if (loading) return <div className="min-h-screen bg-cream"><Navbar /><p className="text-center py-20 text-gray-400">Loading...</p></div>;
  if (error) return <div className="min-h-screen bg-cream"><Navbar /><div className="text-center py-20"><h2 className="text-2xl font-bold text-red-500 mb-2">{error}</h2><Link to="/admin" className="text-sky hover:underline">← Back</Link></div></div>;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Link to="/admin" className="text-charcoal/60 hover:text-sky text-sm mb-4 inline-block">← Back to Dashboard</Link>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div><h1 className="text-3xl font-bold text-navy">Manage Jobs</h1><p className="text-charcoal/60 mt-1">{jobs.length} total jobs posted</p></div>
          <div className="flex gap-3 flex-wrap"><input type="text" placeholder="🔍 Search jobs..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky bg-white" /><Link to="/admin/create-job" className="bg-sky text-white px-5 py-2 rounded-lg font-medium hover:bg-navy transition">➕ Create Job</Link></div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {STATUS_FILTERS.map((f) => {
            const count = f.id === 'all' ? jobs.length : jobs.filter((j) => j.status === f.id).length;
            return <button key={f.id} onClick={() => handleFilter(f.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeFilter === f.id ? 'bg-navy text-white shadow-sm' : 'bg-white text-navy border border-gray-200 hover:border-navy'}`}>{f.icon} {f.label} ({count})</button>;
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center"><div className="text-5xl mb-3">📭</div><p className="text-charcoal/60">No jobs found</p></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="text-left text-charcoal/60 border-b border-gray-100 bg-cream"><th className="px-6 py-4 font-medium">Job Title</th><th className="px-6 py-4 font-medium">Category</th><th className="px-6 py-4 font-medium">Location</th><th className="px-6 py-4 font-medium">Apps</th><th className="px-6 py-4 font-medium">Deadline</th><th className="px-6 py-4 font-medium">Status</th><th className="px-6 py-4 font-medium">Actions</th></tr></thead>
            <tbody>
              {filtered.map((job) => (
                <tr key={job.id} className="border-b border-gray-50 hover:bg-cream/50 transition">
                  <td className="px-6 py-4"><div className="font-medium text-navy">{job.title}</div><div className="text-xs text-charcoal/50">{job.sub_category || 'N/A'}</div></td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${categoryColors[job.category] || 'bg-gray-400'}`}>{job.category}</span></td>
                  <td className="px-6 py-4 text-charcoal/70">{job.location}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-cream rounded-full text-xs font-medium text-navy">{job.application_count} 📋</span></td>
                  <td className="px-6 py-4 text-charcoal/60 text-xs">{new Date(job.deadline).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[job.status] || 'bg-gray-400'}`}>{job.status}</span></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-1"><Link to={`/jobs/${job.id}`} className="p-2 hover:bg-sky/10 rounded-lg transition text-lg" title="View">👁️</Link><Link to={`/admin/edit-job/${job.id}`} className="p-2 hover:bg-amber/10 rounded-lg transition text-lg" title="Edit">✏️</Link><button onClick={() => setDeleteConfirm(job)} className="p-2 hover:bg-red-50 rounded-lg transition text-lg" title="Delete">🗑️</button></div></td>
                </tr>
              ))}
            </tbody>
          </table></div></div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-navy mb-2">Delete this job?</h3>
              <p className="text-charcoal/70 text-sm mb-2"><strong>{deleteConfirm.title}</strong></p>
              <p className="text-red-500 text-xs mb-6">This will also delete all {deleteConfirm.application_count} applications associated with this job. This cannot be undone.</p>
              <div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-white text-navy border border-gray-200 py-2 rounded-lg font-medium hover:border-navy transition">Cancel</button><button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition">🗑️ Delete Job</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageJobs;