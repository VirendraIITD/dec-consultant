const CATEGORIES = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'Engineering', label: 'Engineering', icon: '⚙️' },
  { id: 'Law', label: 'Law', icon: '⚖️' },
  { id: 'Management', label: 'Management', icon: '📊' },
  { id: 'Others', label: 'Others', icon: '📁' },
];

function CategoryFilter({ active, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center py-6">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
            active === cat.id
              ? 'bg-sky text-white shadow-md'
              : 'bg-white text-navy border border-gray-200 hover:border-sky'
          }`}
        >
          <span className="mr-1">{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;