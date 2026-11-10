import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // ⬅ ADDED IMPORT

function TalentPool() {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '', email: '', mobile: '', gender: '', date_of_birth: '',
    current_city: '', preferred_location: '', preferred_category: '',
    preferred_role: '', qualification: '', specialization: '', experience: '',
    previous_org: '', current_ctc: '', notice_period: '', skills: '',
    is_fresher: false, last_degree_organization: '', linkedin_url: '', portfolio_url: '',
  });

  const [resumeFile, setResumeFile] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file only');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File must be less than 5 MB');
        return;
      }
      setResumeFile(file);
      setError('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (!resumeFile) {
        setError('Please upload your resume');
        setSubmitting(false);
        return;
      }

      const fileName = `talent-pool/${Date.now()}_${resumeFile.name}`;
      const { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, resumeFile);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(fileName);

      const { error: insertError } = await supabase.from('talent_pool').insert({
          full_name: formData.full_name, email: formData.email, mobile: formData.mobile,
          gender: formData.gender, date_of_birth: formData.date_of_birth || null,
          current_city: formData.current_city, preferred_category: formData.preferred_category,
          preferred_role: formData.preferred_role, preferred_location: formData.preferred_location,
          qualification: formData.qualification, specialization: formData.specialization,
          experience: formData.is_fresher ? 'Fresher' : formData.experience,
          previous_org: formData.is_fresher ? null : formData.previous_org,
          current_ctc: formData.is_fresher ? null : formData.current_ctc,
          notice_period: formData.is_fresher ? null : formData.notice_period,
          skills: formData.skills, is_fresher: formData.is_fresher,
          last_degree_organization: formData.is_fresher ? formData.last_degree_organization : null,
          linkedin_url: formData.linkedin_url || null, portfolio_url: formData.portfolio_url || null,
          resume_url: urlData.publicUrl, status: 'new',
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  // ============ SUCCESS VIEW ============
  if (success) {
    return (
      // ⬅ ADDED flex flex-col
      <div className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        
        {/* ⬅ ADDED flex-grow */}
        <div className="flex-grow w-full max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-7xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-4xl font-bold text-navy mb-4">
            You're in our Talent Pool!
          </h1>
          <p className="text-lg text-charcoal/70 mb-8">
            Thank you for sharing your profile. Our HR team will reach out when
            a matching opportunity opens up.
          </p>

          <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 text-left">
            <h3 className="font-semibold text-navy mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li>✅ Your profile is now visible to our HR team</li>
              <li>📧 We'll contact you when a suitable job opens</li>
              <li>💼 Browse current openings anytime</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/jobs" className="bg-sky text-white px-6 py-2 rounded-lg font-medium hover:bg-navy transition">
              Browse Jobs
            </Link>
            <Link to="/" className="bg-white text-navy border border-gray-200 px-6 py-2 rounded-lg font-medium hover:border-sky transition">
              Return Home
            </Link>
          </div>
        </div>

        {/* ⬅ ADDED Footer */}
        <Footer />
      </div>
    );
  }

  // ============ FORM VIEW ============
  return (
    // ⬅ ADDED flex flex-col
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      {/* ⬅ ADDED flex-grow */}
      <div className="flex-grow w-full max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-amber/20 text-amber-700 rounded-full text-xs font-medium mb-3">
            TALENT POOL
          </div>
          <h1 className="text-3xl font-bold text-navy mb-2">Submit Your Resume</h1>
          <p className="text-charcoal/70 max-w-xl mx-auto">
            Didn't find a matching role? No problem. Submit your profile and
            we'll reach out when the right opportunity opens.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
          {/* ... (ALL YOUR FORM FIELDS STAY EXACTLY THE SAME) ... */}
          
          {/* Submit Button */}
          <button type="submit" disabled={submitting} className="w-full bg-amber text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 shadow-md">
            {submitting ? 'Submitting...' : '📩 Submit to Talent Pool'}
          </button>
          <p className="text-xs text-center text-charcoal/50">By submitting, you agree to our terms</p>
        </form>
      </div>

      {/* ⬅ ADDED Footer */}
      <Footer />
    </div>
  );
}

export default TalentPool;