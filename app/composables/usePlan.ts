import type { Plan } from "~/types";

export const DEFAULT_PLANS: Record<string, Plan> = {
  free: {
    id: "free",
    name_ar: "الباقة المجانية",
    name_en: "Free Plan",
    max_items: 20,
    max_categories: 5,
    allow_analytics: false,
    allow_branches: false,
    allow_tables: false,
    allow_whatsapp_orders: false,
    allow_custom_hours: false,
    allow_shifts: true,
    allow_extras: false,
    allow_cashier: false,
    allow_multi_languages: false,
    allow_users: false,
  },
  basic: {
    id: "basic",
    name_ar: "الباقة الأساسية",
    name_en: "Basic Plan",
    max_items: -1,
    max_categories: -1,
    allow_analytics: true,
    allow_branches: false,
    allow_tables: false,
    allow_whatsapp_orders: false,
    allow_custom_hours: false,
    allow_shifts: true,
    allow_extras: true,
    allow_cashier: true,
    allow_multi_languages: true,
    allow_users: false,
  },
  pro: {
    id: "pro",
    name_ar: "الباقة الاحترافية",
    name_en: "Pro Plan",
    max_items: -1,
    max_categories: -1,
    allow_analytics: true,
    allow_branches: true,
    allow_tables: true,
    allow_whatsapp_orders: true,
    allow_custom_hours: true,
    allow_shifts: true,
    allow_extras: true,
    allow_cashier: true,
    allow_multi_languages: true,
    allow_users: true,
  },
};

export const usePlan = () => {
  const authStore = useAuthStore();

  const currentPlanId = computed<string>(() => {
    return (
      authStore.profile?.plan?.id ||
      authStore.profile?.plans?.id ||
      authStore.profile?.plan_id ||
      authStore.profile?.plan_type ||
      "free"
    );
  });

  const currentPlan = computed<Plan>(() => {
    let planData: Plan = DEFAULT_PLANS[currentPlanId.value] || DEFAULT_PLANS.free;
    if (authStore.profile?.plan) {
      planData = { ...planData, ...authStore.profile.plan };
    } else if (authStore.profile?.plans) {
      planData = { ...planData, ...authStore.profile.plans };
    }
    return {
      ...planData,
      allow_shifts: true,
      allow_users: currentPlanId.value === "pro" || Boolean(planData.allow_users),
    };
  });

  const maxItems = computed<number>(() => {
    if (
      authStore.profile?.max_items !== undefined &&
      authStore.profile?.max_items !== null
    ) {
      return authStore.profile.max_items;
    }
    return currentPlan.value.max_items;
  });

  const maxCategories = computed<number>(() => {
    if (
      authStore.profile?.max_categories !== undefined &&
      authStore.profile?.max_categories !== null
    ) {
      return authStore.profile.max_categories;
    }
    return currentPlan.value.max_categories;
  });

  const isItemLimitReached = (currentCount: number) => {
    if (maxItems.value === -1) return false;
    return currentCount >= maxItems.value;
  };

  const isCategoryLimitReached = (currentCount: number) => {
    if (maxCategories.value === -1) return false;
    return currentCount >= maxCategories.value;
  };

  const can = (featureKey: keyof Plan) => {
    if (featureKey === "allow_shifts") return true;
    return Boolean(currentPlan.value[featureKey]);
  };

  const isFree = computed(() => currentPlanId.value === "free");
  const isBasic = computed(() => currentPlanId.value === "basic");
  const isPro = computed(() => currentPlanId.value === "pro");

  return {
    currentPlanId,
    currentPlan,
    maxItems,
    maxCategories,
    isItemLimitReached,
    isCategoryLimitReached,
    can,
    isFree,
    isBasic,
    isPro,
    plans: DEFAULT_PLANS,
  };
};
