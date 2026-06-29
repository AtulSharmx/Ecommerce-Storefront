import ProductCard from "./ProductCard";

function ProductList({ products, loading, error }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <p className="text-3xl mb-2">⚠️</p>
          <p className="text-red-500 font-medium">Failed to load products.</p>
          <p className="text-slate-400 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-slate-500">No products found.</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
