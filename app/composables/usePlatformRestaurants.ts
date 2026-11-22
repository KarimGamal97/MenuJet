import { isSubscriptionExpiredCheck, resolvePlanId } from "~/utils/helpers";

export interface PlatformRestaurant {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  business_name: string | null;
  business_name_ar: string | null;
  business_name_en: string | null;
  slug: string | null;
  whatsapp_number: string | null;
  role: string;
  plan_id: string | null;
  plan_type: string | null;
  subscription_status: string | null;
  subscription_end_date: string | null;
  is_active: boolean;
  created_at: string;
  items_count?: number;
  orders_count?: number;
}

export type PlatformStatus = "expired" | "expiring" | "active" | "free";

export const usePlatformRestaurants = () => {
  const { $toast } = useNuxtApp();
  const { t } = useI18n();

  const restaurants = ref<PlatformRestaurant[]>([]);
  const loading = ref(false);
  const saving = ref(false);
  const deleting = ref(false);

  const searchQuery = ref("");
  const statusFilter = ref<"all" | PlatformStatus>("all");
  const planFilter = ref<"all" | "free" | "basic" | "pro">("all");

  const getDaysRemaining = (r: PlatformRestaurant): number | null => {
    if (!r.subscription_end_date) return null;
    const endMs = new Date(r.subscription_end_date).getTime();
    if (isNaN(endMs)) return null;
    return Math.ceil((endMs - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const getRestaurantStatus = (r: PlatformRestaurant): PlatformStatus => {
    if (isSubscriptionExpiredCheck(r)) return "expired";
    const days = getDaysRemaining(r);
    if (days !== null && days <= 7 && days >= 0) return "expiring";
    const planId = resolvePlanId(r);
    if (planId === "free" && !r.subscription_end_date) return "free";
    return "active";
  };

  const getDisplayName = (r: PlatformRestaurant | null): string => {
    if (!r) return "";
    return (
      r.business_name_ar ||
      r.business_name ||
      r.business_name_en ||
      r.full_name ||
      r.email?.split("@")[0] ||
      r.slug ||
      "—"
    );
  };

  const stats = computed(() => {
    let active = 0;
    let expiring = 0;
    let expired = 0;

    for (const r of restaurants.value) {
      const status = getRestaurantStatus(r);
      if (status === "expired") expired++;
      else if (status === "expiring") expiring++;
      else if (status === "active") active++;
    }

    return {
      total: restaurants.value.length,
      active: active + expiring,
      expiring,
      expired,
    };
  });

  const filteredRestaurants = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    return restaurants.value.filter((r) => {
      if (statusFilter.value !== "all" && getRestaurantStatus(r) !== statusFilter.value) {
        return false;
      }
      if (planFilter.value !== "all" && resolvePlanId(r) !== planFilter.value) {
        return false;
      }
      if (!q) return true;
      const hay = [
        r.business_name,
        r.business_name_ar,
        r.business_name_en,
        r.full_name,
        r.email,
        r.slug,
        r.whatsapp_number,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  });

  const fetchRestaurants = async () => {
    loading.value = true;
    try {
      const data = await $fetch<PlatformRestaurant[]>("/api/platform/restaurants");
      restaurants.value = data || [];
    } catch (err: any) {
      console.error("Failed to fetch restaurants:", err);
      $toast?.error(err?.data?.message || t("platform.fetch_error"));
    } finally {
      loading.value = false;
    }
  };

  const updateSubscription = async (
    id: string,
    payload: {
      plan_id?: string;
      subscription_status?: string;
      subscription_end_date?: string | null;
    },
  ) => {
    saving.value = true;
    try {
      const updated = await $fetch<PlatformRestaurant>(
        `/api/platform/restaurants/${id}`,
        { method: "PATCH", body: payload },
      );
      const idx = restaurants.value.findIndex((r) => r.id === id);
      if (idx !== -1 && updated) {
        restaurants.value[idx] = {
          ...restaurants.value[idx],
          ...updated,
        };
      }
      $toast?.success(t("platform.update_success"));
      return true;
    } catch (err: any) {
      console.error("Failed to update subscription:", err);
      $toast?.error(err?.data?.message || t("platform.update_error"));
      return false;
    } finally {
      saving.value = false;
    }
  };

  const toggleActiveStatus = async (r: PlatformRestaurant) => {
    const isCurrentlyExpired = isSubscriptionExpiredCheck(r);
    if (isCurrentlyExpired || r.subscription_status === "inactive" || r.subscription_status === "expired") {
      return updateSubscription(r.id, { subscription_status: "active" });
    }
    return updateSubscription(r.id, { subscription_status: "inactive" });
  };

  const deleteRestaurant = async (id: string) => {
    deleting.value = true;
    try {
      await $fetch(`/api/platform/restaurants/${id}`, { method: "DELETE" });
      restaurants.value = restaurants.value.filter((r) => r.id !== id);
      $toast?.success(t("platform.delete_success"));
      return true;
    } catch (err: any) {
      console.error("Failed to delete restaurant:", err);
      $toast?.error(err?.data?.message || t("platform.delete_error"));
      return false;
    } finally {
      deleting.value = false;
    }
  };

  return {
    restaurants,
    filteredRestaurants,
    stats,
    loading,
    saving,
    deleting,
    searchQuery,
    statusFilter,
    planFilter,
    getDaysRemaining,
    getRestaurantStatus,
    getDisplayName,
    fetchRestaurants,
    updateSubscription,
    toggleActiveStatus,
    deleteRestaurant,
  };
};
