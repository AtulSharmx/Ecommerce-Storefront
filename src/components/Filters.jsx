function Filters({ categories, selectedCategory, onCategoryChange, maxPrice, onMaxPriceChange, highestPrice }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wide font-medium">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors capitalize"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat} className="capitalize">
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wide font-medium">
          Max Price:{" "}
          <span className="text-indigo-600 font-semibold">${maxPrice}</span>
        </label>
        <input
          type="range"
          min={0}
          max={highestPrice}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>$0</span>
          <span>${highestPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default Filters;
