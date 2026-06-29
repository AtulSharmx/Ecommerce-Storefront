import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";

function Cart({ isOpen, onClose }) {
  const { cartItems } = useCart();

  // calculate total price across all items and quantities
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-900 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-center mt-12">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300">Total</span>
              <span className="text-white font-bold text-lg">
                ${total.toFixed(2)}
              </span>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium transition-colors">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
