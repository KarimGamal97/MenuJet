import type { RestaurantShift, CashierSession } from "~/types";

export const useShifts = () => {
  const client = useSupabaseClient();
  const { $toast } = useNuxtApp();
  const { t } = useI18n();

  const shifts = ref<RestaurantShift[]>([]);
  const activeSession = ref<CashierSession | null>(null);
  const loading = ref(false);
  const sessionLoading = ref(false);

  // 1. Fetch restaurant shift definitions
  const fetchShifts = async (restaurantId: string) => {
    if (!restaurantId) return [];
    loading.value = true;
    try {
      const { data, error } = await client
        .from("restaurant_shifts")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("start_time", { ascending: true });

      if (error) throw error;
      shifts.value = data || [];
      return shifts.value;
    } catch (err: any) {
      console.error("Error fetching restaurant shifts:", err.message);
      return [];
    } finally {
      loading.value = false;
    }
  };

  // 2. Fetch currently open cashier session
  const fetchActiveSession = async (restaurantId: string) => {
    if (!restaurantId) return null;
    sessionLoading.value = true;
    try {
      const { data, error } = await client
        .from("cashier_sessions")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .eq("status", "open")
        .order("opened_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      activeSession.value = data || null;
      return activeSession.value;
    } catch (err: any) {
      console.error("Error fetching active session:", err.message);
      return null;
    } finally {
      sessionLoading.value = false;
    }
  };

  // 3. Auto-detect current shift based on time (supports overnight shifts)
  const autoDetectShift = (shiftsList: RestaurantShift[]): RestaurantShift | null => {
    if (!shiftsList || shiftsList.length === 0) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const shift of shiftsList) {
      if (!shift.is_active) continue;

      const [startH, startM] = shift.start_time.split(":").map(Number);
      const [endH, endM] = shift.end_time.split(":").map(Number);
      const startMinutes = startH * 60 + (startM || 0);
      const endMinutes = endH * 60 + (endM || 0);

      // Normal same-day shift (e.g., 08:00 to 16:00)
      if (startMinutes < endMinutes) {
        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
          return shift;
        }
      } else {
        // Overnight shift spanning midnight (e.g., 18:00 to 02:00)
        if (currentMinutes >= startMinutes || currentMinutes < endMinutes) {
          return shift;
        }
      }
    }

    // Fallback to first available shift if none match
    return shiftsList.find((s) => s.is_active) || shiftsList[0] || null;
  };

  // 4. Open a new cashier session with opening float
  const openSession = async ({
    restaurantId,
    userId,
    shiftId,
    shiftName,
    openingBalance,
  }: {
    restaurantId: string;
    userId?: string;
    shiftId?: string;
    shiftName?: string;
    openingBalance: number;
  }) => {
    sessionLoading.value = true;
    try {
      const newSession = {
        restaurant_id: restaurantId,
        user_id: userId || null,
        shift_id: shiftId || null,
        shift_name: shiftName || t("shifts.general_shift"),
        opening_balance: Number(openingBalance) || 0,
        status: "open",
        opened_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from("cashier_sessions")
        .insert(newSession)
        .select()
        .single();

      if (error) throw error;
      activeSession.value = data;
      $toast.success(t("shifts.session_opened_success"));
      return data;
    } catch (err: any) {
      console.error("Error opening cashier session:", err.message);
      $toast.error(err.message || t("shifts.error_opening_session"));
      return null;
    } finally {
      sessionLoading.value = false;
    }
  };

  // 5. Calculate live sales for current session from orders table
  const getSessionLiveStats = async (sessionId: string) => {
    if (!sessionId) return { cashSales: 0, cardSales: 0, totalSales: 0, count: 0 };

    try {
      const { data, error } = await client
        .from("orders")
        .select("total_price, payment_method, status")
        .eq("session_id", sessionId);

      if (error) throw error;

      let cashSales = 0;
      let cardSales = 0;
      let totalSales = 0;
      const count = data?.length || 0;

      data?.forEach((order: any) => {
        const price = Number(order.total_price) || 0;
        totalSales += price;
        if (order.payment_method === "card") {
          cardSales += price;
        } else {
          cashSales += price;
        }
      });

      return { cashSales, cardSales, totalSales, count };
    } catch (err: any) {
      console.error("Error getting session live stats:", err.message);
      return { cashSales: 0, cardSales: 0, totalSales: 0, count: 0 };
    }
  };

  // 6. Close shift and reconcile cash / Z-Report
  const closeSession = async ({
    sessionId,
    closingBalance,
    expenses = 0,
    notes,
  }: {
    sessionId: string;
    closingBalance: number;
    expenses?: number;
    notes?: string;
  }) => {
    sessionLoading.value = true;
    try {
      // 1. Compute actual session sales
      const stats = await getSessionLiveStats(sessionId);
      const opening = Number(activeSession.value?.opening_balance) || 0;
      const actualCash = Number(closingBalance) || 0;
      const totalExpenses = Number(expenses) || 0;

      // Expected drawer cash = opening float + cash sales - expenses
      const expectedCash = Math.max(0, opening + stats.cashSales - totalExpenses);
      // Variance = actual - expected (negative = shortage, positive = surplus)
      const difference = actualCash - expectedCash;

      const updateData = {
        status: "closed",
        closed_at: new Date().toISOString(),
        closing_balance: actualCash,
        expected_cash: expectedCash,
        cash_sales: stats.cashSales,
        card_sales: stats.cardSales,
        total_sales: stats.totalSales,
        orders_count: stats.count,
        difference: difference,
        notes: notes || null,
      };

      const { data, error } = await client
        .from("cashier_sessions")
        .update(updateData)
        .eq("id", sessionId)
        .select()
        .single();

      if (error) throw error;

      activeSession.value = null;
      $toast.success(t("shifts.session_closed_success"));
      return data;
    } catch (err: any) {
      console.error("Error closing session:", err.message);
      $toast.error(err.message || t("shifts.error_closing_session"));
      return null;
    } finally {
      sessionLoading.value = false;
    }
  };

  // 7. Manage shift definitions (create, update, delete)
  const addShift = async (restaurantId: string, shiftData: Partial<RestaurantShift>) => {
    try {
      const { data, error } = await client
        .from("restaurant_shifts")
        .insert({
          restaurant_id: restaurantId,
          shift_name: shiftData.shift_name,
          start_time: shiftData.start_time,
          end_time: shiftData.end_time,
          is_active: shiftData.is_active !== false,
        })
        .select()
        .single();

      if (error) throw error;
      shifts.value.push(data);
      $toast.success(t("shifts.shift_added_success"));
      return data;
    } catch (err: any) {
      $toast.error(err.message || t("shifts.error_saving_shift"));
      return null;
    }
  };

  const updateShift = async (shiftId: string, shiftData: Partial<RestaurantShift>) => {
    try {
      const { data, error } = await client
        .from("restaurant_shifts")
        .update(shiftData)
        .eq("id", shiftId)
        .select()
        .single();

      if (error) throw error;
      const index = shifts.value.findIndex((s) => s.id === shiftId);
      if (index !== -1) shifts.value[index] = data;
      $toast.success(t("shifts.shift_updated_success"));
      return data;
    } catch (err: any) {
      $toast.error(err.message || t("shifts.error_saving_shift"));
      return null;
    }
  };

  const deleteShift = async (shiftId: string) => {
    try {
      const { error } = await client
        .from("restaurant_shifts")
        .delete()
        .eq("id", shiftId);

      if (error) throw error;
      shifts.value = shifts.value.filter((s) => s.id !== shiftId);
      $toast.success(t("shifts.shift_deleted_success"));
      return true;
    } catch (err: any) {
      $toast.error(err.message || t("shifts.error_deleting_shift"));
      return false;
    }
  };

  return {
    shifts,
    activeSession,
    loading,
    sessionLoading,
    fetchShifts,
    fetchActiveSession,
    autoDetectShift,
    openSession,
    closeSession,
    getSessionLiveStats,
    addShift,
    updateShift,
    deleteShift,
  };
};
