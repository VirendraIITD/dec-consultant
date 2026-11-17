import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, dashboardAPI } from '../../lib/api'; // ⬅ NEW API IMPORTS
import Navbar from '../../components/Navbar';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ jobs: 0, applications: 0, talentPool: 0, pending: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkAdminAndLoad() {
      try {
        // 1. Check if user is admin via API
        const user = await authAPI.getCurrentUser();
        if (!user) { navigate('/login'); return; }

        const profile = await authAPI.getProfile(user.id);
        if (profile?.role !== 'admin') {
          setError('You do not have admin access');
          setLoading(false);
          return;
        }

        // 2. Fetch stats via API
        const statsData = await dashboardAPI.getStats();
        setStats(statsData);

        // 3. Fetch recent applications via API
        const recent = await dashboardAPI.getRecentApplications();
        setRecentApplications(recent || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    checkAdminAndLoad();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-cream"><Navbar /><p className="text-center py-20 text-gray-400">Loading dashboard...</p></div>;
  if (error) return <div className="min-h-screen bg-cream"><Navbar /><div className="text-center py-20"><h2 className="text-2xl font-bold text-red-500 mb-2">{error}</h2><Link to="/" className="text-sky hover:underline">← Back to home</Link></div></div>;

  const statusColors = { pending: 'bg-amber', shortlisted: 'bg-sky', hired: 'bg-emerald', rejected: 'bg-red-500' };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">Admin Dashboard</h1>
            <p className="text-charcoal/60 mt-1">Manage recruitment & hiring pipeline</p>
          </div>
          <Button to="/admin/create-job" rounded="rounded-lg" className="px-5 py-2">
            ➕ Create New Job
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="💼" label="Active Jobs" value={stats.jobs} color="bg-navy" />
          <StatCard icon="📋" label="Total Applications" value={stats.applications} color="bg-sky" />
          <StatCard icon="🎯" label="Talent Pool" value={stats.talentPool} color="bg-amber" />
          <StatCard icon="⏳" label="Pending Review" value={stats.pending} color="bg-emerald" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickAction to="/admin/create-job" icon="➕" title="Create Job" description="Post a new job opening" />
          <QuickAction to="/admin/manage-jobs" icon="📋" title="Manage Jobs" description="Edit or delete job posts" />
          <QuickAction to="/admin/applications" icon="📄" title="View Applications" description="Review candidate applications" />
          <QuickAction to="/admin/talent-pool" icon="🎯" title="Talent Pool" description="Browse general resumes" />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-navy">Recent Applications</h2>
            <Link to="/admin/applications" className="text-sm text-sky hover:underline">View all →</Link>
          </div>
          {recentApplications.length === 0 ? (
            <p className="text-center text-charcoal/50 py-8">No applications yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-charcoal/60 border-b border-gray-100">
                    <th className="pb-3 font-medium">Candidate</th>
                    <th className="pb-3 font-medium">Job</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="border-b border-gray-50 hover:bg-cream/50">
                      <td className="py-3"><div className="font-medium text-navy">{app.full_name}</div><div className="text-xs text-charcoal/50">{app.email}</div></td>
                      <td className="py-3 text-charcoal/70">{app.jobs?.title || 'N/A'}</td>
                      <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[app.status] || 'bg-gray-400'}`}>{app.status}</span></td>
                      <td className="py-3 text-charcoal/60 text-xs">{new Date(app.applied_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-3"><span className="text-3xl">{icon}</span><span className={`w-2 h-2 rounded-full ${color}`} /></div>
      <div className="text-3xl font-bold text-navy">{value}</div><div className="text-sm text-charcoal/60">{label}</div>
    </div>
  );
}

function QuickAction({ to, icon, title, description }) {
  return (
    <Link to={to} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 block">
      <div className="text-3xl mb-2">{icon}</div><div className="font-semibold text-navy">{title}</div><div className="text-sm text-charcoal/60">{description}</div>
    </Link>
  );
}

export default Dashboard;