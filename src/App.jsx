import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JobListings from './pages/JobListings';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ApplyForm from './pages/ApplyForm';
import ThankYou from './pages/ThankYou';
import TalentPool from './pages/TalentPool';
import Dashboard from './pages/admin/Dashboard';
import ViewApplications from './pages/admin/ViewApplications';   // ⬅ NEW

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<JobListings />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/apply/:id" element={<ApplyForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/talent-pool" element={<TalentPool />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/applications" element={<ViewApplications />} />   {/* ⬅ NEW */}
    </Routes>
  );
}

export default App;