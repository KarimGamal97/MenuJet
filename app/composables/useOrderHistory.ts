interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  type: "cashier" | "whatsapp";
  time?: string;
}

export const useOrderHistory = () => {
  const history = useState<Order[]>("orderHistory", () => []);

  const loadHistory = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("menujet_order_history");
      if (saved) {
        try {
          history.value = JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing order history", e);
          history.value = [];
        }
      }
    }
  };

  const addOrder = (order: Order) => {
    const newOrder = {
      ...order,
      time: new Date().toISOString(),
    };
    history.value.unshift(newOrder);
    if (typeof window !== "undefined") {
      localStorage.setItem("menujet_order_history", JSON.stringify(history.value));
    }
  };

  return {
    history,
    addOrder,
    loadHistory,
  };
};
