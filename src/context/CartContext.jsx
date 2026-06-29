import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function handleAddToCart(product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function handleRemoveFromCart(id) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleQuantityChange(id, newQty) {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  }

  return (
    <CartContext.Provider
      value={{ cartItems, handleAddToCart, handleRemoveFromCart, handleQuantityChange }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
