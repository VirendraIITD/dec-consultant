import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, talentPoolAPI } from '../../lib/api'; // ⬅ NEW API IMPORTS
import Navbar from '../../components/Navbar';

const STATUS_FILTERS = [
  { id: 'all', label: 'All', icon: '📋' }, { id: 'new', label: 'New', icon: '🆕' },
  { id: 'contacted', label: 'Contacted', icon: '📞' }, { id: 'hired', label: 'Hired', icon: '✅' }, { id: 'archived', label: 'Archived', icon: '📦' },
];

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Categories' }, { id: 'Engineering', label: '⚙️ Engineering' },
  { id: 'Management', label: '📊 Management' }, { id: 'Legal Studies', label: '⚖️ Legal Studies' },
  { id: 'Architecture', label: '📐 Architecture' }, { id: 'Agriculture', label: '🌾 Agriculture' },
  { id: 'Nursing', label: '🩺 Nursing' }, { id: 'Allied Science', label: '🔬 Allied Science' },
  { id: 'Hospitality', label: '🏨 Hospitality' }, { id: 'Computer Application', label: '💻 Computer Application' },
  { id: 'Media & Mass Communication', label: '📺 Media & Mass Comm.' }, { id: 'Design', label: '🎨 Design' },
  { id: 'Liberal Arts', label: '📖 Liberal Arts' }, { id: 'Education', label: '🎓 Education' },
  { id: 'Forensic Sciences', label: '🔎 Forensic Sciences' }, { id: 'Others', label: '📁 Others' },
];

function ViewTalentPool() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    async function loadCandidates() {
      try {
        const user = await authAPI.getCurrentUser();
        if (!user) { navigate('/login'); return; }
        const profile = await authAPI.getProfile(user.id);
        if (profile?.role !== 'admin') { setError('Admin access required'); setLoading(false); return; }

        const data = await talentPoolAPI.getAll();
        setCandidates(data || []);
        setFiltered(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, [navigate]);

  function applyFilters(status, category, query) {
    let result = [...candidates];
    if (status !== 'all') result = result.filter((c) => c.status === status);
    if (category !== 'all') result = result.filter((c) => c.preferred_category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((c) => c.full_name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.preferred_role?.toLowerCase().includes(q) || c.skills?.toLowerCase().includes(q));
    }
    setFiltered(result);
  }

  function handleStatusFilter(status) { setActiveStatus(status); applyFilters(status, activeCategory, searchQuery); }
  function handleCategoryFilter(category) { setActiveCategory(category); applyFilters(activeStatus, category, searchQuery); }
  function handleSearch(query) { setSearchQuery(query); applyFilters(activeStatus, activeCategory, query); }

  async function updateStatus(candidateId, newStatus) {
    try {
      await talentPoolAPI.updateStatus(candidateId, newStatus); // ⬅ API CALL
      const updated = candidates.map((c) => c.id === candidateId ? { ...c, status: newStatus } : c);
      setCandidates(updated); applyFilters(activeStatus, activeCategory, searchQuery);
      if (selectedCandidate?.id === candidateId) setSelectedCandidate({ ...selectedCandidate, status: newStatus });
    } catch (err) { alert('Error: ' + err.message); }
  }

  const statusColors = { new: 'bg-sky', contacted: 'bg-amber', hired: 'bg-emerald', archived: 'bg-gray-400' };

  if (loading) return <div className="min-h-screen bg-cream"><Navbar /><p className="text-center py-20 text-gray-400">Loading...</p></div>;
  if (error) return <div className="min-h-screen bg-cream"><Navbar /><div className="text-center py-20"><h2 className="text-2xl font-bold text-red-500 mb-2">{error}</h2><Link to="/admin" className="text-sky hover:underline">← Back</Link></div></div>;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Link to="/admin" className="text-charcoal/60 hover:text-sky text-sm mb-4 inline-block">← Back to Dashboard</Link>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div><h1 className="text-3xl font-bold text-navy">Talent Pool</h1><p className="text-charcoal/60 mt-1">{candidates.length} general resumes submitted</p></div>
          <input type="text" placeholder="🔍 Search by name, role, or skill..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="w-full md:w-80 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky bg-white" />
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {STATUS_FILTERS.map((f) => {
            const count = f.id === 'all' ? candidates.length : candidates.filter((c) => c.status === f.id).length;
            return <button key={f.id} onClick={() => handleStatusFilter(f.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeStatus === f.id ? 'bg-navy text-white shadow-sm' : 'bg-white text-navy border border-gray-200 hover:border-navy'}`}>{f.icon} {f.label} ({count})</button>;
          })}
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORY_FILTERS.map((c) => (
            <button key={c.id} onClick={() => handleCategoryFilter(c.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${activeCategory === c.id ? 'bg-sky text-white' : 'bg-white text-charcoal/70 border border-gray-200 hover:border-sky'}`}>{c.label}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center"><div className="text-5xl mb-3">🎯</div><p className="text-charcoal/60">No candidates found</p></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="text-left text-charcoal/60 border-b border-gray-100 bg-cream"><th className="px-6 py-4 font-medium">Candidate</th><th className="px-6 py-4 font-medium">Preferred Role</th><th className="px-6 py-4 font-medium">Category</th><th className="px-6 py-4 font-medium">Experience</th><th className="px-6 py-4 font-medium">Status</th><th className="px-6 py-4 font-medium">Actions</th></tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-cream/50 transition">
                  <td className="px-6 py-4"><div className="font-medium text-navy">{c.full_name}</div><div className="text-xs text-charcoal/50">{c.email}</div><div className="text-xs text-charcoal/50">📱 {c.mobile}</div></td>
                  <td className="px-6 py-4"><div className="text-charcoal">{c.preferred_role || 'N/A'}</div><div className="text-xs text-charcoal/50">📍 {c.preferred_location || 'Any'}</div></td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1 px-2 py-1 bg-cream rounded-full text-xs">{c.preferred_category}</span></td>
                  <td className="px-6 py-4"><div className="text-charcoal">{c.experience}</div>{c.is_fresher && <span className="inline-block px-2 py-0.5 bg-emerald/10 text-emerald-700 text-xs rounded-full mt-1">Fresher</span>}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[c.status] || 'bg-gray-400'}`}>{c.status}</span></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2"><button onClick={() => setSelectedCandidate(c)} className="p-2 hover:bg-sky/10 rounded-lg transition text-lg" title="View details">👁️</button>{c.status === 'new' && <button onClick={() => updateStatus(c.id, 'contacted')} className="p-2 hover:bg-amber/10 rounded-lg transition text-lg" title="Mark as Contacted">📞</button>}{c.status === 'contacted' && <button onClick={() => updateStatus(c.id, 'hired')} className="p-2 hover:bg-emerald/10 rounded-lg transition text-lg" title="Mark as Hired">✅</button>}</div></td>
                </tr>
              ))}
            </tbody>
          </table></div></div>
        )}
      </div>
      {selectedCandidate && <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} onUpdateStatus={updateStatus} />}
    </div>
  );
}

function CandidateModal({ candidate: c, onClose, onUpdateStatus }) {
  const statusColors = { new: 'bg-sky', contacted: 'bg-amber', hired: 'bg-emerald', archived: 'bg-gray-400' };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between"><div><h2 className="text-2xl font-bold text-navy">{c.full_name}</h2><p className="text-sm text-charcoal/60">{c.email}</p></div><button onClick={onClose} className="text-2xl text-charcoal/40 hover:text-charcoal">✕</button></div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div><span className="text-sm text-charcoal/60">Status:</span><span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[c.status]}`}>{c.status}</span></div>
            <div className="flex gap-2 flex-wrap">
              {c.status === 'new' && <button onClick={() => onUpdateStatus(c.id, 'contacted')} className="bg-amber text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition">📞 Mark Contacted</button>}
              {c.status !== 'hired' && <button onClick={() => onUpdateStatus(c.id, 'hired')} className="bg-emerald text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition">✅ Mark Hired</button>}
              {c.status !== 'archived' && <button onClick={() => onUpdateStatus(c.id, 'archived')} className="bg-gray-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-600 transition">📦 Archive</button>}
            </div>
          </div>
          <Section title="👤 Basic Information"><DetailRow label="Email" value={c.email} /><DetailRow label="Mobile" value={c.mobile} /><DetailRow label="Gender" value={c.gender || 'N/A'} /><DetailRow label="Date of Birth" value={c.date_of_birth ? new Date(c.date_of_birth).toLocaleDateString('en-IN') : 'N/A'} /><DetailRow label="Current City" value={c.current_city || 'N/A'} /></Section>
          <Section title="🎯 Job Preferences"><DetailRow label="Preferred Category" value={c.preferred_category} /><DetailRow label="Preferred Role" value={c.preferred_role} /><DetailRow label="Preferred Location" value={c.preferred_location} /></Section>
          <Section title="🎓 Education & Experience"><DetailRow label="Qualification" value={c.qualification} /><DetailRow label="Specialization" value={c.specialization} />{c.is_fresher ? <DetailRow label="Last Degree Org" value={c.last_degree_organization} /> : <><DetailRow label="Experience" value={c.experience} /><DetailRow label="Previous Org" value={c.previous_org || 'N/A'} /><DetailRow label="Current CTC" value={c.current_ctc || 'N/A'} /><DetailRow label="Notice Period" value={c.notice_period || 'N/A'} /></>}<DetailRow label="Skills" value={c.skills} /></Section>
          {(c.linkedin_url || c.portfolio_url) && <Section title="🔗 Online Presence">{c.linkedin_url && <DetailRow label="LinkedIn" value={<a href={c.linkedin_url} target="_blank" rel="noreferrer" className="text-sky hover:underline">{c.linkedin_url}</a>} />}{c.portfolio_url && <DetailRow label="Portfolio" value={<a href={c.portfolio_url} target="_blank" rel="noreferrer" className="text-sky hover:underline">{c.portfolio_url}</a>} />}</Section>}
          <Section title="📅 Submission"><DetailRow label="Submitted On" value={new Date(c.submitted_at).toLocaleDateString('en-IN')} /></Section>
          <div><h3 className="font-bold text-navy mb-3">📎 Resume</h3><a href={c.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky transition">📄 View Resume PDF</a></div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) { return <div><h3 className="font-bold text-navy mb-3 pb-2 border-b border-gray-100">{title}</h3><div className="space-y-2">{children}</div></div>; }
function DetailRow({ label, value }) { return <div className="flex gap-4 text-sm"><span className="text-charcoal/60 w-40 flex-shrink-0">{label}:</span><span className="text-charcoal font-medium">{value || 'N/A'}</span></div>; }

export default ViewTalentPool;