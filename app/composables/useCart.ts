// app/composables/useCart.ts
const CART_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

export const useCart = () => {
  // Each entry: { ...item, quantity: number }
  const cart = useState<any[]>("cart", () => []);
  const activeCartSlug = useState<string>("cartRestaurantSlug", () => "");
  const editingOrder = useState<any | null>("editingOrder", () => null);

  const getStorageKey = (slug: string) => `menujet_cart_${slug}`;

  // Unique cart item ID based on id, size, extras, and notes
  const generateCartId = (item: any) => {
    const extrasKey = Array.isArray(item.selectedExtras) && item.selectedExtras.length > 0
      ? item.selectedExtras.map((e: any) => e.name).sort().join("+")
      : "noextras";
    return `${item.id}-${item.size || "default"}-${extrasKey}-${item.notes || "none"}`;
  };

  const persistCart = () => {
    if (typeof window === "undefined" || !activeCartSlug.value || editingOrder.value) return;
    try {
      const key = getStorageKey(activeCartSlug.value);
      if (!cart.value || cart.value.length === 0) {
        localStorage.removeItem(key);
        return;
      }
      localStorage.setItem(
        key,
        JSON.stringify({
          items: cart.value,
          updatedAt: Date.now(),
        }),
      );
    } catch {}
  };

  const initCartForRestaurant = (slug: string): boolean => {
    if (!slug) return false;
    activeCartSlug.value = slug;
    if (typeof window === "undefined" || editingOrder.value) return false;

    try {
      const key = getStorageKey(slug);
      const raw = localStorage.getItem(key);
      if (!raw) {
        cart.value = [];
        return false;
      }
      const parsed = JSON.parse(raw);
      const isExpired =
        !parsed?.updatedAt || Date.now() - Number(parsed.updatedAt) > CART_TTL_MS;

      if (isExpired || !Array.isArray(parsed.items) || parsed.items.length === 0) {
        localStorage.removeItem(key);
        cart.value = [];
        return false;
      }

      cart.value = parsed.items.map((i: any) => ({
        ...i,
        cartId: i.cartId || generateCartId(i),
      }));
      return true;
    } catch {
      cart.value = [];
      return false;
    }
  };

  const addToCart = (item: any) => {
    item.cartId = item.cartId || generateCartId(item);
    const existing = cart.value.find((i: any) => i.cartId === item.cartId);
    if (existing) {
      existing.quantity++;
    } else {
      cart.value.push({ ...item, quantity: 1 });
    }
    persistCart();
  };

  const increaseQty = (idOrCartId: any) => {
    const item = cart.value.find(
      (i: any) => (i.cartId && i.cartId === idOrCartId) || i.id === idOrCartId,
    );
    if (item) {
      item.quantity++;
      persistCart();
    }
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
      persistCart();
    }
  };

  const removeItem = (idOrCartId: any) => {
    cart.value = cart.value.filter((i: any) => {
      if (i.cartId) return i.cartId !== idOrCartId;
      return i.id !== idOrCartId;
    });
    persistCart();
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
    if (typeof window !== "undefined" && activeCartSlug.value) {
      try {
        localStorage.removeItem(getStorageKey(activeCartSlug.value));
      } catch {}
    }
  };

  const setCart = (newItems: any[]) => {
    cart.value = (newItems || []).map((i: any) => ({
      ...i,
      cartId: i.cartId || generateCartId(i),
    }));
    persistCart();
  };

  const startEditingOrder = (order: any) => {
    editingOrder.value = order;
    setCart(order.items || []);
  };

  const cancelEditingOrder = () => {
    editingOrder.value = null;
  };

  return {
    cart,
    editingOrder,
    initCartForRestaurant,
    startEditingOrder,
    cancelEditingOrder,
    addToCart,
    increaseQty,
    decreaseQty,
    removeItem,
    totalPrice,
    cartCount,
    clearCart,
    setCart,
  };
};
