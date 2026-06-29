import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const { handleRemoveFromCart, handleQuantityChange } = useCart();

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-700">
      <img
        src={item.image}
        alt={item.title}
        className="w-14 h-14 object-contain bg-white rounded p-1 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-200 font-medium leading-tight line-clamp-2">
          {item.title}
        </p>
        <p className="text-indigo-400 text-sm mt-0.5">${item.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <button
            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
            className="w-6 h-6 rounded bg-gray-600 hover:bg-gray-500 text-white text-sm flex items-center justify-center"
          >
            −
          </button>
          <span className="text-gray-300 text-sm w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
            className="w-6 h-6 rounded bg-gray-600 hover:bg-gray-500 text-white text-sm flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => handleRemoveFromCart(item.id)}
        className="text-gray-500 hover:text-red-400 text-lg shrink-0 transition-colors"
        title="Remove"
      >
        ✕
      </button>
    </div>
  );
}

export default CartItem;
