import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // ⬅ ADDED

function ApplyForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '', email: '', mobile: '', gender: '', date_of_birth: '',
    current_city: '', preferred_job_location: '', qualification: '', specialization: '',
    experience: '', previous_org: '', current_ctc: '', notice_period: '', skills: '',
    is_fresher: false, last_degree_organization: '', linkedin_url: '', portfolio_url: '',
  });

  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    async function init() {
      const { data: jobData, error: jobError } = await supabase.from('jobs').select('*').eq('id', id).single();
      if (jobError || !jobData) {
        setError('Job not found');
        setLoading(false);
        return;
      }
      setJob(jobData);

      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        setFormData((prev) => ({ ...prev, email: userData.user.email || '' }));
      }
      setLoading(false);
    }
    init();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') { setError('Please upload a PDF file only'); return; }
      if (file.size > 5 * 1024 * 1024) { setError('File must be less than 5 MB'); return; }
      setResumeFile(file);
      setError('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { navigate('/login'); return; }
      if (!resumeFile) { setError('Please upload your resume'); setSubmitting(false); return; }

      const fileName = `${userData.user.id}/${Date.now()}_${resumeFile.name}`;
      const { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, resumeFile);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(fileName);

      const { error: insertError } = await supabase.from('applications').insert({
          job_id: id, candidate_id: userData.user.id, full_name: formData.full_name,
          email: formData.email, mobile: formData.mobile, gender: formData.gender,
          date_of_birth: formData.date_of_birth || null, current_city: formData.current_city,
          preferred_job_location: formData.preferred_job_location, qualification: formData.qualification,
          specialization: formData.specialization, experience: formData.is_fresher ? 'Fresher' : formData.experience,
          previous_org: formData.is_fresher ? null : formData.previous_org,
          current_ctc: formData.is_fresher ? null : formData.current_ctc,
          notice_period: formData.is_fresher ? null : formData.notice_period, skills: formData.skills,
          is_fresher: formData.is_fresher, last_degree_organization: formData.is_fresher ? formData.last_degree_organization : null,
          linkedin_url: formData.linkedin_url || null, portfolio_url: formData.portfolio_url || null,
          resume_url: urlData.publicUrl, status: 'pending',
        });

      if (insertError) throw insertError;
      navigate('/thank-you');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <div className="flex-grow flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>
        <Footer />
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-navy mb-2">{error}</h2>
          <Link to="/jobs" className="text-sky hover:underline">← Back to jobs</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      
      {/* ⬅ Main content with flex-grow */}
      <div className="flex-grow w-full max-w-3xl mx-auto px-4 py-10">
        <Link to={`/jobs/${id}`} className="text-charcoal/60 hover:text-sky text-sm mb-4 inline-block">← Back to job details</Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Apply for Position</h1>
          <p className="text-charcoal/70"><span className="font-medium text-navy">{job.title}</span> • {job.location}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
          {/* Note: Form fields are exactly the same as your previous code */}
          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">👤 Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium text-charcoal mb-1">Full Name *</label><input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="Dr. Ananya Sharma" /></div>
              <div><label className="block text-sm font-medium text-charcoal mb-1">Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-sky" /></div>
              <div><label className="block text-sm font-medium text-charcoal mb-1">Mobile Number *</label><input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required pattern="[0-9]{10}" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="9876543210" /></div>
              <div><label className="block text-sm font-medium text-charcoal mb-1">Gender *</label><select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-sky"><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option><option value="Prefer not to say">Prefer not to say</option></select></div>
              <div><label className="block text-sm font-medium text-charcoal mb-1">Date of Birth *</label><input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" /></div>
              <div><label className="block text-sm font-medium text-charcoal mb-1">Current City *</label><input type="text" name="current_city" value={formData.current_city} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="Delhi" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-charcoal mb-1">Preferred Job Location *</label><input type="text" name="preferred_job_location" value={formData.preferred_job_location} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="Bangalore, Mumbai, or Remote" /></div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">🎓 Education & Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium text-charcoal mb-1">Highest Qualification *</label><input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="Ph.D. in Computer Science" /></div>
              <div><label className="block text-sm font-medium text-charcoal mb-1">Specialization *</label><input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="AI / Machine Learning" /></div>
              <div className="md:col-span-2"><label className="flex items-center gap-3 cursor-pointer p-3 bg-cream rounded-lg border border-gray-100"><input type="checkbox" name="is_fresher" checked={formData.is_fresher} onChange={handleChange} className="w-4 h-4 text-sky focus:ring-sky rounded" /><div><span className="font-medium text-charcoal text-sm">I am a Fresher</span><p className="text-xs text-charcoal/60">Check if you have no prior work experience</p></div></label></div>
              {formData.is_fresher ? (
                <div className="md:col-span-2"><label className="block text-sm font-medium text-charcoal mb-1">Last Degree Organization *</label><input type="text" name="last_degree_organization" value={formData.last_degree_organization} onChange={handleChange} required={formData.is_fresher} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="IIT Delhi" /></div>
              ) : (
                <>
                  <div><label className="block text-sm font-medium text-charcoal mb-1">Experience (Years) *</label><input type="text" name="experience" value={formData.experience} onChange={handleChange} required={!formData.is_fresher} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="6 Years" /></div>
                  <div><label className="block text-sm font-medium text-charcoal mb-1">Previous Organization</label><input type="text" name="previous_org" value={formData.previous_org} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="Tech University" /></div>
                  <div><label className="block text-sm font-medium text-charcoal mb-1">Current CTC</label><input type="text" name="current_ctc" value={formData.current_ctc} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="₹8 LPA" /></div>
                  <div><label className="block text-sm font-medium text-charcoal mb-1">Notice Period</label><select name="notice_period" value={formData.notice_period} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-sky"><option value="">Select Notice Period</option><option value="Immediate">Immediate</option><option value="15 days">15 days</option><option value="30 days">30 days</option><option value="60 days">60 days</option><option value="90 days">90 days</option></select></div>
                </>
              )}
              <div className="md:col-span-2"><label className="block text-sm font-medium text-charcoal mb-1">Key Skills *</label><textarea name="skills" value={formData.skills} onChange={handleChange} required rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky resize-none" placeholder="e.g., JavaScript, React, Node.js, Python" /><p className="text-xs text-charcoal/50 mt-1">Separate skills with commas</p></div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">🔗 Online Presence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className="block text-sm font-medium text-charcoal mb-1">LinkedIn Profile</label><input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="https://linkedin.com/in/yourname" /></div>
              <div><label className="block text-sm font-medium text-charcoal mb-1">Portfolio / GitHub</label><input type="url" name="portfolio_url" value={formData.portfolio_url} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-sky" placeholder="https://github.com/yourname" /></div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-100">📎 Resume</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-sky transition">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="resume-upload" />
              <label htmlFor="resume-upload" className="cursor-pointer block">
                {resumeFile ? (
                  <div><p className="text-4xl mb-2">📄</p><p className="font-medium text-navy">{resumeFile.name}</p><p className="text-xs text-charcoal/60 mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p><p className="text-xs text-sky mt-2">Click to change file</p></div>
                ) : (
                  <div><p className="text-4xl mb-2">📎</p><p className="font-medium text-charcoal">Click to upload resume</p><p className="text-xs text-charcoal/60 mt-1">PDF only, max 5 MB</p></div>
                )}
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full bg-sky text-white py-3 rounded-lg font-medium hover:bg-navy transition disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
          <p className="text-xs text-center text-charcoal/50">By submitting, you agree to our terms</p>
        </form>
      </div>

      <Footer /> {/* ⬅ ADDED FOOTER */}
    </div>
  );
}

export default ApplyForm;