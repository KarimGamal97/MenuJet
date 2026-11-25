import type { Plan } from "~/types";
import { isActiveTrialCheck } from "~/utils/helpers";

export const DEFAULT_PLANS: Record<string, Plan> = {
  free: {
    id: "free",
    name_ar: "الباقة المجانية",
    name_en: "Free Plan",
    max_items: 130,
    max_categories: -1,
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
    allow_bio_hub: false,
  },
  basic: {
    id: "basic",
    name_ar: "الباقة الأساسية",
    name_en: "Basic Plan",
    max_items: 100,
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
    allow_bio_hub: false,
  },
  pro: {
    id: "pro",
    name_ar: "الباقة الاحترافية",
    name_en: "Pro Plan",
    max_items: 130,
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
    allow_bio_hub: true,
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

  const isActiveTrial = computed<boolean>(() =>
    isActiveTrialCheck(authStore.profile),
  );

  const effectivePlanId = computed<string>(() =>
    isActiveTrial.value ? "pro" : currentPlanId.value,
  );

  const currentPlan = computed<Plan>(() => {
    const basePlan: Plan =
      DEFAULT_PLANS[effectivePlanId.value] || DEFAULT_PLANS.free;
    let planData: Plan = { ...basePlan };

    if (!isActiveTrial.value) {
      if (authStore.profile?.plan) {
        planData = { ...planData, ...authStore.profile.plan };
      } else if (authStore.profile?.plans) {
        planData = { ...planData, ...authStore.profile.plans };
      }
    }

    const hasProTier = effectivePlanId.value === "pro";

    return {
      ...planData,
      max_items: basePlan.max_items,
      max_categories: basePlan.max_categories,
      allow_shifts: true,
      allow_users: hasProTier || Boolean(planData.allow_users),
      allow_bio_hub: hasProTier || Boolean(planData.allow_bio_hub),
    };
  });

  const maxItems = computed<number>(() => {
    const customMax = authStore.profile?.max_items;
    if (customMax !== undefined && customMax !== null) {
      if (isActiveTrial.value && customMax === 20) {
        return DEFAULT_PLANS.pro.max_items;
      }
      if (currentPlanId.value === "free" && customMax === 20) {
        return DEFAULT_PLANS.free.max_items;
      }
      return customMax;
    }
    return currentPlan.value.max_items;
  });

  const maxCategories = computed<number>(() => {
    const customMax = authStore.profile?.max_categories;
    if (customMax !== undefined && customMax !== null) {
      if ((isActiveTrial.value || currentPlanId.value === "free") && customMax === 5) {
        return -1;
      }
      return customMax;
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
    if (isActiveTrial.value) return true;
    if (featureKey === "allow_bio_hub") {
      return effectivePlanId.value === "pro" || Boolean(currentPlan.value.allow_bio_hub);
    }
    return Boolean(currentPlan.value[featureKey]);
  };

  const isFree = computed(() => currentPlanId.value === "free");
  const isBasic = computed(() => currentPlanId.value === "basic");
  const isPro = computed(() => currentPlanId.value === "pro" || isActiveTrial.value);

  return {
    currentPlanId,
    effectivePlanId,
    isActiveTrial,
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
