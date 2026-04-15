// app/composables/useCart.ts
export const useCart = () => {
  // Each entry: { ...item, quantity: number }
  const cart = useState<any[]>("cart", () => []);

  // Use a unique cart item ID based on id, size, and notes (to fix same item different size/notes)
  const generateCartId = (item: any) => {
    return `${item.id}-${item.size || "default"}-${item.notes || "none"}`;
  };

  const addToCart = (item: any) => {
    item.cartId = item.cartId || generateCartId(item);
    const existing = cart.value.find((i: any) => i.cartId === item.cartId);
    if (existing) {
      existing.quantity++;
    } else {
      cart.value.push({ ...item, quantity: 1 });
    }
  };

  const increaseQty = (idOrCartId: any) => {
    const item = cart.value.find(
      (i: any) => (i.cartId && i.cartId === idOrCartId) || i.id === idOrCartId,
    );
    if (item) item.quantity++;
  };

  const decreaseQty = (idOrCartId: any) => {
    const item = cart.value.find(
      (i: any) => (i.cartId && i.cartId === idOrCartId) || i.id === idOrCartId,
    );
    if (item) {
      item.quantity--;
      if (item.quantity <= 0) {
        cart.value = cart.value.filter((i: any) => {
          if (i.cartId) return i.cartId !== idOrCartId;
          return i.id !== idOrCartId;
        });
      }
    }
  };

  const removeItem = (idOrCartId: any) => {
    cart.value = cart.value.filter((i: any) => {
      if (i.cartId) return i.cartId !== idOrCartId;
      return i.id !== idOrCartId;
    });
  };

  const totalPrice = computed(() =>
    cart.value.reduce(
      (total, item: any) => total + (Number(item.price) * item.quantity || 0),
      0,
    ),
  );

  const cartCount = computed(() =>
    cart.value.reduce((total, item: any) => total + item.quantity, 0),
  );

  const clearCart = () => {
    cart.value = [];
  };

  return {
    cart,
    addToCart,
    increaseQty,
    decreaseQty,
    removeItem,
    totalPrice,
    cartCount,
    clearCart,
  };
};
