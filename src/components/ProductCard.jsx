import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { handleAddToCart, cartItems } = useCart();

  const inCart = cartItems.find((item) => item.id === product.id);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700/50 overflow-hidden flex flex-col hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-900/20 transition-all duration-200 group">
      <div className="bg-white p-5 flex items-center justify-center h-48">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-36 object-contain group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-indigo-400 capitalize font-medium mb-1">
          {product.category}
        </span>
        <h3 className="text-gray-200 text-sm font-medium leading-snug line-clamp-2 flex-1">
          {product.title}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-white font-bold text-lg">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1 text-yellow-400 text-xs">
            <span>★</span>
            <span className="text-gray-400">{product.rating?.rate}</span>
            <span className="text-gray-500">({product.rating?.count})</span>
          </div>
        </div>
        <button
          onClick={() => handleAddToCart(product)}
          className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            inCart
              ? "bg-indigo-600/30 text-indigo-300 border border-indigo-600/50 hover:bg-indigo-600/50"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }`}
        >
          {inCart ? `In Cart (${inCart.quantity})` : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
