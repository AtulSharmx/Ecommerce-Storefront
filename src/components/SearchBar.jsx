function SearchBar({ search, onSearch }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </span>
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors text-sm"
      />
    </div>
  );
}

export default SearchBar;
