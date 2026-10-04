import { Link } from 'react-router-dom';

function JobCard({ job }) {
  // Category color mapping
  const categoryColors = {
    Engineering: 'bg-sky',
    Law: 'bg-purple-500',
    Management: 'bg-emerald',
    Others: 'bg-amber',
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      {/* Category badge */}
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${
          categoryColors[job.category] || 'bg-gray-400'
        }`}
      >
        {job.category}
      </span>

      {/* Job title */}
      <h3 className="text-lg font-semibold text-navy mt-3 mb-1">
        {job.title}
      </h3>

      {/* Location + sub category */}
      <p className="text-sm text-gray-500 mb-3">
        📍 {job.location} {job.sub_category && `• ${job.sub_category}`}
      </p>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {job.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          Deadline: {new Date(job.deadline).toLocaleDateString('en-IN')}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky transition"
        >
          View →
        </Link>
      </div>
    </div>
  );
}

export default JobCard;