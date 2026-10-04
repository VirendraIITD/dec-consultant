import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';

const STATUS_FILTERS = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'pending', label: 'Pending', icon: '⏳' },
  { id: 'shortlisted', label: 'Shortlisted', icon: '⭐' },
  { id: 'hired', label: 'Hired', icon: '✅' },
  { id: 'rejected', label: 'Rejected', icon: '❌' },
];

function ViewApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null); // For modal

  // Load applications
  useEffect(() => {
    async function loadApplications() {
      // Verify admin
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

      // Fetch applications with job info
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (title, category, location)
        `)
        .order('applied_at', { ascending: false });

      if (fetchError) {
        console.error(fetchError);
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setApplications(data || []);
      setFiltered(data || []);
      setLoading(false);
    }
    loadApplications();
  }, [navigate]);

  // Handle filter change
  function handleFilter(filter) {
    setActiveFilter(filter);
    applyFilters(filter, searchQuery);
  }

  // Handle search
  function handleSearch(query) {
    setSearchQuery(query);
    applyFilters(activeFilter, query);
  }

  // Apply both filter + search
  function applyFilters(filter, query) {
    let result = [...applications];

    // Filter by status
    if (filter !== 'all') {
      result = result.filter((app) => app.status === filter);
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (app) =>
          app.full_name?.toLowerCase().includes(q) ||
          app.email?.toLowerCase().includes(q) ||
          app.jobs?.title?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }

  // Update application status
  async function updateStatus(appId, newStatus) {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', appId);

    if (error) {
      alert('Error: ' + error.message);
      return;
    }

    // Update local state
    const updated = applications.map((app) =>
      app.id === appId ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    applyFilters(activeFilter, searchQuery);

    // Update selected app if open
    if (selectedApp?.id === appId) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  }

  const statusColors = {
    pending: 'bg-amber',
    shortlisted: 'bg-sky',
    hired: 'bg-emerald',
    rejected: 'bg-red-500',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <p className="text-center py-20 text-gray-400">Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-500 mb-2">{error}</h2>
          <Link to="/admin" className="text-sky hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <Link
          to="/admin"
          className="text-charcoal/60 hover:text-sky text-sm mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">Applications</h1>
            <p className="text-charcoal/60 mt-1">
              {applications.length} total applications
            </p>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search by name, email, or job..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky bg-white"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {STATUS_FILTERS.map((f) => {
            const count =
              f.id === 'all'
                ? applications.length
                : applications.filter((a) => a.status === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => handleFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeFilter === f.id
                    ? 'bg-navy text-white shadow-sm'
                    : 'bg-white text-navy border border-gray-200 hover:border-navy'
                }`}
              >
                {f.icon} {f.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Applications Table */}
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-charcoal/60">No applications found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-charcoal/60 border-b border-gray-100 bg-cream">
                    <th className="px-6 py-4 font-medium">Candidate</th>
                    <th className="px-6 py-4 font-medium">Job</th>
                    <th className="px-6 py-4 font-medium">Experience</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-gray-50 hover:bg-cream/50 transition"
                    >
                      {/* Candidate */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-navy">
                          {app.full_name}
                        </div>
                        <div className="text-xs text-charcoal/50">
                          {app.email}
                        </div>
                        <div className="text-xs text-charcoal/50">
                          📱 {app.mobile}
                        </div>
                      </td>

                      {/* Job */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-charcoal">
                          {app.jobs?.title || 'N/A'}
                        </div>
                        <div className="text-xs text-charcoal/50">
                          {app.jobs?.location}
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="px-6 py-4">
                        <div className="text-charcoal">{app.experience}</div>
                        {app.is_fresher && (
                          <span className="inline-block px-2 py-0.5 bg-emerald/10 text-emerald-700 text-xs rounded-full mt-1">
                            Fresher
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                            statusColors[app.status] || 'bg-gray-400'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 hover:bg-sky/10 rounded-lg transition text-lg"
                            title="View details"
                          >
                            👁️
                          </button>

                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() =>
                                  updateStatus(app.id, 'shortlisted')
                                }
                                className="p-2 hover:bg-emerald/10 rounded-lg transition text-lg"
                                title="Shortlist"
                              >
                                ⭐
                              </button>
                              <button
                                onClick={() => updateStatus(app.id, 'rejected')}
                                className="p-2 hover:bg-red-50 rounded-lg transition text-lg"
                                title="Reject"
                              >
                                ❌
                              </button>
                            </>
                          )}

                          {app.status === 'shortlisted' && (
                            <button
                              onClick={() => updateStatus(app.id, 'hired')}
                              className="p-2 hover:bg-emerald/10 rounded-lg transition text-lg"
                              title="Hire"
                            >
                              ✅
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <ApplicationModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
}

// ============ APPLICATION DETAIL MODAL ============
function ApplicationModal({ app, onClose, onUpdateStatus }) {
  const statusColors = {
    pending: 'bg-amber',
    shortlisted: 'bg-sky',
    hired: 'bg-emerald',
    rejected: 'bg-red-500',
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy">{app.full_name}</h2>
            <p className="text-sm text-charcoal/60">{app.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-charcoal/40 hover:text-charcoal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status + Actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-sm text-charcoal/60">Current Status:</span>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-xs font-medium text-white ${
                  statusColors[app.status]
                }`}
              >
                {app.status}
              </span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {app.status !== 'shortlisted' && app.status !== 'hired' && (
                <button
                  onClick={() => onUpdateStatus(app.id, 'shortlisted')}
                  className="bg-sky text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-navy transition"
                >
                  ⭐ Shortlist
                </button>
              )}
              {app.status !== 'hired' && (
                <button
                  onClick={() => onUpdateStatus(app.id, 'hired')}
                  className="bg-emerald text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                  ✅ Hire
                </button>
              )}
              {app.status !== 'rejected' && (
                <button
                  onClick={() => onUpdateStatus(app.id, 'rejected')}
                  className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                >
                  ❌ Reject
                </button>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <Section title="👤 Basic Information">
            <DetailRow label="Email" value={app.email} />
            <DetailRow label="Mobile" value={app.mobile} />
            <DetailRow label="Gender" value={app.gender || 'N/A'} />
            <DetailRow
              label="Date of Birth"
              value={
                app.date_of_birth
                  ? new Date(app.date_of_birth).toLocaleDateString('en-IN')
                  : 'N/A'
              }
            />
            <DetailRow label="Current City" value={app.current_city || 'N/A'} />
            <DetailRow
              label="Preferred Location"
              value={app.preferred_job_location || 'N/A'}
            />
          </Section>

          {/* Education */}
          <Section title="🎓 Education & Experience">
            <DetailRow label="Qualification" value={app.qualification} />
            <DetailRow label="Specialization" value={app.specialization} />
            {app.is_fresher ? (
              <DetailRow
                label="Last Degree Org"
                value={app.last_degree_organization}
              />
            ) : (
              <>
                <DetailRow label="Experience" value={app.experience} />
                <DetailRow label="Previous Org" value={app.previous_org || 'N/A'} />
                <DetailRow label="Current CTC" value={app.current_ctc || 'N/A'} />
                <DetailRow
                  label="Notice Period"
                  value={app.notice_period || 'N/A'}
                />
              </>
            )}
            <DetailRow label="Skills" value={app.skills} />
          </Section>

          {/* Online Presence */}
          {(app.linkedin_url || app.portfolio_url) && (
            <Section title="🔗 Online Presence">
              {app.linkedin_url && (
                <DetailRow
                  label="LinkedIn"
                  value={
                    <a
                      href={app.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky hover:underline"
                    >
                      {app.linkedin_url}
                    </a>
                  }
                />
              )}
              {app.portfolio_url && (
                <DetailRow
                  label="Portfolio"
                  value={
                    <a
                      href={app.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky hover:underline"
                    >
                      {app.portfolio_url}
                    </a>
                  }
                />
              )}
            </Section>
          )}

          {/* Job Applied */}
          <Section title="💼 Job Applied">
            <DetailRow label="Job Title" value={app.jobs?.title} />
            <DetailRow label="Category" value={app.jobs?.category} />
            <DetailRow label="Location" value={app.jobs?.location} />
            <DetailRow
              label="Applied On"
              value={new Date(app.applied_at).toLocaleDateString('en-IN')}
            />
          </Section>

          {/* Resume */}
          <div>
            <h3 className="font-bold text-navy mb-3">📎 Resume</h3>
            <a
              href={app.resume_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky transition"
            >
              📄 View Resume PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable sub-components
function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-bold text-navy mb-3 pb-2 border-b border-gray-100">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex gap-4 text-sm">
      <span className="text-charcoal/60 w-40 flex-shrink-0">{label}:</span>
      <span className="text-charcoal font-medium">{value || 'N/A'}</span>
    </div>
  );
}

export default ViewApplications;