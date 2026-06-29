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
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {cartItems.length === 0 ? (
            <p className="text-slate-400 text-center mt-12">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="px-4 py-4 border-t border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-500">Total</span>
              <span className="text-slate-900 font-bold text-lg">
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
