import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import CategoryFilter from '../components/CategoryFilter';

function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch jobs from Supabase on page load
  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data || []);
        setFilteredJobs(data || []);
      }
      setLoading(false);
    }
    fetchJobs();
  }, []);

  // Filter when category changes
  function handleCategoryFilter(category) {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter((job) => job.category === category));
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-navy text-center mb-2">
          Open Positions
        </h1>
        <p className="text-charcoal/60 text-center mb-4">
          Find your next opportunity at DEC Consultant
        </p>

        {/* Filter */}
        <CategoryFilter active={activeCategory} onSelect={handleCategoryFilter} />

        {/* Jobs */}
        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            No jobs found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Talent Pool CTA */}
        <div className="bg-amber/10 border-2 border-amber rounded-2xl p-6 text-center mt-10">
          <h3 className="text-lg font-bold text-charcoal mb-1">
            Didn't find what you're looking for?
          </h3>
          <p className="text-sm text-charcoal/70 mb-4">
            Submit your resume to our Talent Pool.
          </p>
          <Link
            to="/talent-pool"
            className="inline-block bg-amber text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition"
          >
            📩 Submit Resume Anyway
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobListings;