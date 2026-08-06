import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      // إضافة للسلة
      addToCart: (product) => {
        const existing = get().cartItems.find((item) => item.id === product.id);

        if (existing) {
          set({
            cartItems: get().cartItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + product.quantity }
                : item,
            ),
          });
        } else {
          set({
            cartItems: [...get().cartItems, product],
          });
        }
      },

      // زيادة الكمية
      increaseQuantity: (id) => {
        set({
          cartItems: get().cartItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        });
      },

      // تقليل الكمية
      decreaseQuantity: (id) => {
        set({
          cartItems: get()
            .cartItems.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        });
      },

      // حذف منتج
      removeFromCart: (id) => {
        set({
          cartItems: get().cartItems.filter((item) => item.id !== id),
        });
      },

      // تفريغ السلة
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage", // اسم التخزين في localStorage
    },
  ),
);
