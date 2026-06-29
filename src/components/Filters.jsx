function Filters({ categories, selectedCategory, onCategoryChange, maxPrice, onMaxPriceChange, highestPrice }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors capitalize"
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
        <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
          Max Price:{" "}
          <span className="text-indigo-400 font-semibold">${maxPrice}</span>
        </label>
        <input
          type="range"
          min={0}
          max={highestPrice}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>$0</span>
          <span>${highestPrice}</span>
        </div>
      </div>
    </div>
  );
}

export default Filters;
