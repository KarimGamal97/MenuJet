import type { Order, OrderStatus } from "~/types";

// Named constant instead of magic number
const CLEANUP_DAYS_THRESHOLD = 7;

export const useOrders = () => {
  const client = useSupabaseClient<any>();
  const { $toast } = useNuxtApp();
  const { t } = useI18n();

  const orders = ref<Order[]>([]);
  const totalOrders = ref(0);
  const loading = ref(false);
  const realtimeChannel = ref<any>(null);

  const fetchOrders = async (userId: string, page = 1, pageSize = 15) => {
    if (!userId) return;
    loading.value = true;

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    try {
      const { data, error, count } = await client
        .from("orders")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) throw error;
      orders.value = data || [];
      totalOrders.value = count || 0;
    } catch (err: any) {
      console.error("Fetch Orders Error:", err);
      $toast.error("Failed to load orders");
    } finally {
      loading.value = false;
    }
  };

  const updateOrderStatus = async (
    orderId: string | number,
    status: OrderStatus,
  ) => {
    try {
      const { error } = await client
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;

      const idx = orders.value.findIndex((o) => o.id === orderId);
      const order = orders.value[idx];
      if (order) order.status = status;
      $toast.success("Order status updated");
    } catch (err: any) {
      console.error("Update Status Error:", err);
      $toast.error("Failed to update status");
    }
  };

  const cleanupOrders = async (userId: string, type: string) => {
    if (!userId || !type) return;

    try {
      let query = client.from("orders").delete().eq("user_id", userId);

      if (type === "completed") {
        query = query.eq("status", "completed");
      } else if (type === "old") {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_DAYS_THRESHOLD);
        query = query.lt("created_at", cutoffDate.toISOString());
      }

      const { error } = await query;
      if (error) throw error;

      $toast.success(t("admin.cleanup_success"));
      return true;
    } catch (err: any) {
      console.error("Cleanup Error:", err);
      $toast.error("Failed to cleanup orders");
      return false;
    }
  };

  const setupRealtimeOrders = (userId: string, onNewOrder?: Function) => {
    if (!userId || realtimeChannel.value) return;

    realtimeChannel.value = client
      .channel(`orders-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          orders.value.unshift(payload.new);
          if (onNewOrder) onNewOrder(payload.new);
        },
      )
      .subscribe();
  };

  const stopRealtimeOrders = () => {
    if (realtimeChannel.value) {
      client.removeChannel(realtimeChannel.value);
      realtimeChannel.value = null;
    }
  };

  return {
    orders,
    totalOrders,
    loading,
    fetchOrders,
    updateOrderStatus,
    cleanupOrders,
    setupRealtimeOrders,
    stopRealtimeOrders,
  };
};
