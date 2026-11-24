<template>
  <div class="space-y-6" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <template v-if="pending">
      <IndexSkeleton />
    </template>

    <template v-else>
      <!-- Header -->
      <div
        class="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
            {{ $t("platform.overview_title") }}
            <BaseIcon name="crown" class="w-7 h-7 text-orange-600" />
          </h1>
          <p class="text-gray-500 text-sm mt-1.5">
            {{ $t("platform.overview_subtitle") }}
          </p>
        </div>

        <NuxtLink
          to="/platform"
          class="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm shadow-md shadow-orange-500/20 transition-all text-center shrink-0"
        >
          {{ $t("admin.platform") }}
        </NuxtLink>
      </div>

      <!-- 3 Platform KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <NuxtLink
          to="/platform"
          class="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 group hover:shadow-lg transition-all duration-300 block"
        >
          <div
            class="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform"
          >
            <BaseIcon name="store" class="w-7 h-7" />
          </div>
          <h3 class="text-gray-600 font-bold mt-4">
            {{ $t("platform.overview_clients") }}
          </h3>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black text-orange-600">
              {{ overview?.totalClients || 0 }}
            </p>
            <span class="text-xs font-bold text-orange-500">
              ({{ overview?.activeClients || 0 }} {{ $t("platform.filter_active") }})
            </span>
          </div>
        </NuxtLink>

        <div
          class="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 group hover:shadow-lg transition-all duration-300"
        >
          <div
            class="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"
          >
            <BaseIcon name="cart" class="w-7 h-7" />
          </div>
          <h3 class="text-gray-600 font-bold mt-4">
            {{ $t("platform.overview_orders") }}
          </h3>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black text-blue-600">
              {{ overview?.totalOrders || 0 }}
            </p>
            <span class="text-xs font-bold text-blue-400">
              ({{ overview?.todayOrders || 0 }} {{ $t("platform.overview_today") }})
            </span>
          </div>
        </div>

        <div
          class="bg-green-50 p-6 rounded-[2rem] border border-green-100 group hover:shadow-lg transition-all duration-300"
        >
          <div
            class="w-12 h-12 bg-green-600/10 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform"
          >
            <BaseIcon name="chart" class="w-7 h-7" />
          </div>
          <h3 class="text-gray-600 font-bold mt-4">
            {{ $t("platform.overview_profit") }}
          </h3>
          <div class="flex items-baseline gap-2 mt-1">
            <p class="text-3xl font-black text-green-600">
              {{ (overview?.subscriptionRevenue || 0).toLocaleString() }}
            </p>
            <span class="text-sm font-bold text-green-500">
              {{ $t("currency") }} / {{ $t("pricing.per_month") }}
            </span>
          </div>
          <p class="text-[11px] font-bold text-green-700/70 mt-1">
            {{ $t("platform.overview_gmv") }}:
            {{ (overview?.totalOrdersRevenue || 0).toLocaleString() }} {{ $t("currency") }}
          </p>
        </div>
      </div>

      <!-- Plan Breakdown Bar -->
      <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base sm:text-lg font-black text-gray-900">
            {{ $t("platform.plan_breakdown_title") }}
          </h2>
          <span class="text-xs font-bold text-gray-400">
            {{ overview?.totalClients || 0 }} {{ $t("platform.clients_unit") }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            v-for="plan in planCards"
            :key="plan.id"
            class="p-4 rounded-2xl border border-gray-100 bg-gray-50/70 space-y-2.5"
          >
            <div class="flex items-center justify-between">
              <span :class="plan.badgeClass" class="text-xs font-black px-2.5 py-1 rounded-xl">
                {{ plan.label }}
              </span>
              <span class="text-lg font-black text-gray-900">
                {{ plan.count }}
              </span>
            </div>
            <div class="w-full h-2 bg-gray-200/80 rounded-full overflow-hidden">
              <div
                :class="plan.barClass"
                class="h-full rounded-full transition-all duration-500"
                :style="{ width: `${plan.percent}%` }"
              />
            </div>
            <div class="flex items-center justify-between text-[11px] font-bold text-gray-500">
              <span>{{ plan.percent }}%</span>
              <span v-if="plan.revenue > 0" class="text-emerald-700">
                {{ plan.revenue.toLocaleString() }} {{ $t("currency") }} / {{ $t("pricing.per_month") }}
              </span>
              <span v-else>{{ $t("plans.free_name") }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Grid: Top Active Restaurants + Expiring/Expired Renewals -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top 5 Active Restaurants -->
        <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base sm:text-lg font-black text-gray-900">
              {{ $t("platform.top_restaurants_title") }}
            </h2>
            <span class="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
              Top 5
            </span>
          </div>

          <div v-if="!overview?.topRestaurants?.length" class="py-10 text-center text-sm font-bold text-gray-400">
            {{ $t("platform.empty") }}
          </div>

          <div v-else class="space-y-2.5">
            <div
              v-for="(r, idx) in overview.topRestaurants"
              :key="r.id"
              class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 hover:bg-gray-50 transition-colors gap-3"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span
                  :class="idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-orange-200 text-orange-900' : 'bg-gray-200 text-gray-600'"
                  class="w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shrink-0"
                >
                  {{ idx + 1 }}
                </span>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-black text-sm text-gray-900 truncate">{{ r.name }}</span>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white border border-gray-200 text-gray-600 uppercase">
                      {{ r.planId }}
                    </span>
                  </div>
                  <NuxtLink
                    v-if="r.slug"
                    :to="`/menu/${r.slug}`"
                    target="_blank"
                    class="text-[11px] font-bold text-orange-600 hover:underline"
                    dir="ltr"
                  >
                    /{{ r.slug }}
                  </NuxtLink>
                </div>
              </div>

              <div class="text-end shrink-0">
                <span class="inline-block bg-orange-50 text-orange-700 text-xs font-black px-2.5 py-1 rounded-xl">
                  {{ r.ordersCount }} {{ $t("platform.orders_unit") }}
                </span>
                <p class="text-[11px] font-bold text-gray-400 mt-0.5">
                  {{ r.revenue.toLocaleString() }} {{ $t("currency") }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Expiring / Expired Subscriptions -->
        <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base sm:text-lg font-black text-gray-900">
              {{ $t("platform.renewals_due_title") }}
            </h2>
            <NuxtLink
              to="/platform"
              class="text-xs font-black text-orange-600 hover:underline"
            >
              {{ $t("platform.view_all") }}
            </NuxtLink>
          </div>

          <div v-if="!overview?.renewalsDue?.length" class="py-10 text-center text-sm font-bold text-emerald-600">
            {{ $t("platform.no_renewals_due") }}
          </div>

          <div v-else class="space-y-2.5">
            <div
              v-for="r in overview.renewalsDue"
              :key="r.id"
              class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 gap-3"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-black text-sm text-gray-900 truncate">{{ r.name }}</span>
                  <span
                    :class="r.expired ? 'bg-red-50 text-red-600 border-red-200/70' : 'bg-amber-50 text-amber-700 border-amber-200/70'"
                    class="text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0"
                  >
                    {{ r.expired ? $t("platform.status_expired") : $t("platform.days_left", { days: r.daysRemaining }) }}
                  </span>
                </div>
                <p class="text-[11px] font-bold text-gray-400 mt-0.5 uppercase">
                  {{ r.planId }}
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <a
                  v-if="buildWhatsAppUrl(r.whatsapp_number)"
                  :href="buildWhatsAppUrl(r.whatsapp_number, getRenewalMessage(r))"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-black inline-flex items-center gap-1.5 transition-colors"
                >
                  <BaseIcon name="whatsapp" solid class="w-3.5 h-3.5" />
                  <span>{{ $t("platform.remind") }}</span>
                </a>
                <NuxtLink
                  to="/platform"
                  class="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-black transition-colors"
                >
                  {{ $t("platform.btn_manage") }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  PLAN_MONTHLY_EGP,
  RENEWAL_PAYMENT_PHONE,
  buildWhatsAppUrl,
} from "~/utils/helpers";

const { t } = useI18n();

interface OverviewResponse {
  totalClients: number;
  activeClients: number;
  subscriptionRevenue: number;
  totalOrders: number;
  todayOrders: number;
  totalOrdersRevenue: number;
  planBreakdown: {
    pro: { count: number; revenue: number };
    basic: { count: number; revenue: number };
    free: { count: number; revenue: number };
  };
  topRestaurants: Array<{
    id: string;
    name: string;
    slug: string | null;
    planId: string;
    ordersCount: number;
    revenue: number;
  }>;
  renewalsDue: Array<{
    id: string;
    name: string;
    slug: string | null;
    whatsapp_number: string | null;
    planId: string;
    expired: boolean;
    daysRemaining: number | null;
  }>;
}

const { data: overview, pending } = useAsyncData<OverviewResponse>(
  "platform-overview",
  () => $fetch<OverviewResponse>("/api/platform/overview"),
  { lazy: true },
);

const formatRemainingDays = (days: number): string => {
  if (days === 1) return t("platform.renewal_days_one");
  if (days === 2) return t("platform.renewal_days_two");
  const mod100 = days % 100;
  if (mod100 >= 3 && mod100 <= 10) {
    return t("platform.renewal_days_few", { days });
  }
  return t("platform.renewal_days_many", { days });
};

const getPlanName = (planId: string): string => {
  if (planId === "pro") return t("plans.pro_name");
  if (planId === "basic") return t("plans.basic_name");
  return t("plans.free_name");
};

const getRenewalPaymentDetails = (planId: string): string => {
  const normalizedPlan = String(planId || "free").toLowerCase();
  const price = PLAN_MONTHLY_EGP[normalizedPlan] ?? 0;
  const currency = t("admin.currency");

  if (price > 0) {
    return t("platform.renewal_payment_paid", {
      plan: getPlanName(normalizedPlan),
      price,
      currency,
      phone: RENEWAL_PAYMENT_PHONE,
    });
  }

  return t("platform.renewal_payment_free", {
    basicPrice: PLAN_MONTHLY_EGP.basic,
    proPrice: PLAN_MONTHLY_EGP.pro,
    currency,
    phone: RENEWAL_PAYMENT_PHONE,
  });
};

const getRenewalMessage = (r: OverviewResponse["renewalsDue"][number]): string => {
  let intro: string;
  if (r.expired) {
    intro = t("platform.renewal_whatsapp_msg_expired", { name: r.name });
  } else if (typeof r.daysRemaining === "number") {
    intro =
      r.daysRemaining <= 0
        ? t("platform.renewal_whatsapp_msg_today", { name: r.name })
        : t("platform.renewal_whatsapp_msg_days", {
            name: r.name,
            daysText: formatRemainingDays(r.daysRemaining),
          });
  } else {
    intro = t("platform.renewal_whatsapp_msg", { name: r.name });
  }

  return `${intro}\n\n${getRenewalPaymentDetails(r.planId)}`;
};

const planCards = computed(() => {
  const total = overview.value?.totalClients || 0;
  const bd = overview.value?.planBreakdown || {
    pro: { count: 0, revenue: 0 },
    basic: { count: 0, revenue: 0 },
    free: { count: 0, revenue: 0 },
  };
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return [
    {
      id: "pro",
      label: t("plans.pro_name"),
      count: bd.pro.count,
      revenue: bd.pro.revenue,
      percent: pct(bd.pro.count),
      badgeClass: "bg-orange-100 text-orange-700",
      barClass: "bg-orange-500",
    },
    {
      id: "basic",
      label: t("plans.basic_name"),
      count: bd.basic.count,
      revenue: bd.basic.revenue,
      percent: pct(bd.basic.count),
      badgeClass: "bg-blue-100 text-blue-700",
      barClass: "bg-blue-500",
    },
    {
      id: "free",
      label: t("plans.free_name"),
      count: bd.free.count,
      revenue: 0,
      percent: pct(bd.free.count),
      badgeClass: "bg-gray-200 text-gray-700",
      barClass: "bg-gray-400",
    },
  ];
});
</script>
