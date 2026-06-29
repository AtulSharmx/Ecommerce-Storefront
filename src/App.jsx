import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [highestPrice, setHighestPrice] = useState(1000);

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("https://fakestoreapi.com/products"),
          fetch("https://fakestoreapi.com/products/categories"),
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("Something went wrong. Please try again.");
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);

        const top = Math.ceil(Math.max(...productsData.map((p) => p.price)));
        setHighestPrice(top);
        setMaxPrice(top);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // combine search, category, and price filters — all three apply at the same time
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "" || p.category === selectedCategory;
    const matchesPrice = p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar onCartClick={() => setCartOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            All Products
          </h1>
          <p className="text-gray-400 text-sm">
            {loading ? "" : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700/40 p-4 mb-8 flex flex-col gap-4">
          <SearchBar search={search} onSearch={setSearch} />
          <Filters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            highestPrice={highestPrice}
          />
        </div>

        <ProductList
          products={filteredProducts}
          loading={loading}
          error={error}
        />
      </main>

      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
