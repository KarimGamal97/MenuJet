import type { MaybeRef } from "vue";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  dbId?: string | number;
  restaurantId?: string;
  restaurantSlug?: string;
  items: OrderItem[];
  total: number;
  type: "cashier" | "whatsapp";
  status?: string;
  time?: string;
  customer?: any;
}

export const useOrderHistory = (restaurantKey?: MaybeRef<string | null | undefined>) => {
  const allHistory = useState<Order[]>("allOrderHistory", () => []);

  const loadHistory = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("menujet_order_history");
      if (saved) {
        try {
          allHistory.value = JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing order history", e);
          allHistory.value = [];
        }
      }
    }
  };

  const addOrder = (order: Order) => {
    const newOrder: Order = {
      ...order,
      time: order.time || new Date().toISOString(),
    };
    allHistory.value.unshift(newOrder);
    if (typeof window !== "undefined") {
      localStorage.setItem("menujet_order_history", JSON.stringify(allHistory.value));
    }
  };

  const updateHistoryOrder = (idOrDbId: string | number, patch: Partial<Order>) => {
    const idx = allHistory.value.findIndex(
      (o) => o.id === idOrDbId || (o.dbId && o.dbId === idOrDbId),
    );
    if (idx !== -1) {
      allHistory.value[idx] = { ...allHistory.value[idx], ...patch };
      if (typeof window !== "undefined") {
        localStorage.setItem("menujet_order_history", JSON.stringify(allHistory.value));
      }
    }
  };

  const history = computed(() => {
    const key = unref(restaurantKey);
    if (!key) return allHistory.value;
    return allHistory.value.filter(
      (o) => o.restaurantId === key || o.restaurantSlug === key
    );
  });

  return {
    history,
    allHistory,
    addOrder,
    updateHistoryOrder,
    loadHistory,
  };
};
