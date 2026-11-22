<template>
  <div class="bg-white p-5 sm:p-6 rounded-[2rem] shadow-xs border border-gray-100 space-y-5">
    <!-- Search & Filters -->
    <div class="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
      <div class="w-full lg:max-w-sm">
        <BaseInput
          :modelValue="searchQuery"
          @update:modelValue="emit('update:searchQuery', String($event))"
          type="text"
          :placeholder="$t('platform.search_placeholder')"
          class="!border !border-gray-200 !py-2.5 !px-4 !bg-gray-50/70 focus:!bg-white !rounded-2xl shadow-none"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="tab in statusTabs"
          :key="tab.key"
          type="button"
          @click="emit('update:statusFilter', tab.key)"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer',
            statusFilter === tab.key
              ? 'bg-gray-900 text-white shadow-xs'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
        >
          {{ tab.label }}
        </button>

        <select
          :value="planFilter"
          @change="emit('update:planFilter', ($event.target as HTMLSelectElement).value as any)"
          class="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 focus:outline-none focus:border-orange-500 cursor-pointer"
        >
          <option value="all">{{ $t("platform.all_plans") }}</option>
          <option value="free">{{ $t("plans.free_name") }}</option>
          <option value="basic">{{ $t("plans.basic_name") }}</option>
          <option value="pro">{{ $t("plans.pro_name") }}</option>
        </select>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="space-y-3 py-4">
      <div
        v-for="i in 5"
        :key="i"
        class="h-16 bg-gray-100 rounded-2xl animate-pulse"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="restaurants.length === 0" class="py-16 text-center">
      <div class="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <BaseIcon name="store" class="w-7 h-7" />
      </div>
      <p class="text-gray-500 font-bold text-sm">
        {{ $t("platform.empty") }}
      </p>
    </div>

    <!-- Restaurants Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-start border-separate border-spacing-y-2">
        <thead>
          <tr class="text-gray-400 text-xs font-black uppercase">
            <th class="pb-2 ps-4 text-start font-bold">{{ $t("platform.col_restaurant") }}</th>
            <th class="pb-2 text-center font-bold">{{ $t("platform.col_plan") }}</th>
            <th class="pb-2 text-center font-bold">{{ $t("platform.col_usage") }}</th>
            <th class="pb-2 text-center font-bold">{{ $t("platform.col_status") }}</th>
            <th class="pb-2 pe-4 text-end font-bold">{{ $t("platform.col_actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in restaurants"
            :key="r.id"
            class="bg-gray-50/70 hover:bg-gray-50 transition-colors rounded-2xl"
          >
            <!-- Restaurant Info -->
            <td class="py-3.5 ps-4 rounded-s-2xl">
              <div class="flex flex-col gap-0.5 min-w-[180px]">
                <div class="flex items-center gap-2">
                  <span class="font-black text-gray-900 text-sm">
                    {{ getDisplayName(r) }}
                  </span>
                  <NuxtLink
                    v-if="r.slug"
                    :to="`/menu/${r.slug}`"
                    target="_blank"
                    class="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:underline bg-orange-50 px-2 py-0.5 rounded-lg"
                    dir="ltr"
                  >
                    <span>/{{ r.slug }}</span>
                    <BaseIcon name="external-link" class="w-3 h-3" />
                  </NuxtLink>
                </div>
                <div class="text-xs text-gray-500 font-medium" dir="ltr">
                  {{ r.email || "—" }}
                </div>
                <div v-if="r.whatsapp_number" class="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <BaseIcon name="whatsapp" solid class="w-3.5 h-3.5" />
                  <a
                    :href="buildWhatsAppUrl(r.whatsapp_number)"
                    target="_blank"
                    dir="ltr"
                    class="hover:underline"
                  >
                    {{ r.whatsapp_number }}
                  </a>
                </div>
              </div>
            </td>

            <!-- Plan -->
            <td class="py-3.5 text-center">
              <span
                :class="getPlanBadgeClass(r)"
                class="px-3 py-1 rounded-xl text-[11px] font-black inline-block whitespace-nowrap"
              >
                {{ getPlanLabel(r) }}
              </span>
            </td>

            <!-- Usage -->
            <td class="py-3.5 text-center">
              <div class="text-xs font-bold text-gray-700 whitespace-nowrap">
                <span>{{ r.items_count || 0 }} {{ $t("platform.items_unit") }}</span>
                <span class="text-gray-300 mx-1">•</span>
                <span>{{ r.orders_count || 0 }} {{ $t("platform.orders_unit") }}</span>
              </div>
            </td>

            <!-- Subscription Status & End Date -->
            <td class="py-3.5 text-center">
              <div class="flex flex-col items-center gap-1">
                <span
                  :class="getStatusBadgeClass(r)"
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-black whitespace-nowrap"
                >
                  {{ getStatusText(r) }}
                </span>
                <span
                  v-if="r.subscription_end_date"
                  class="text-[11px] text-gray-400 font-bold whitespace-nowrap"
                  dir="ltr"
                >
                  {{ formatDate(r.subscription_end_date) }}
                </span>
              </div>
            </td>

            <!-- Actions -->
            <td class="py-3.5 pe-4 text-end rounded-e-2xl">
              <div class="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  @click="emit('renew', r)"
                  class="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 text-xs font-black transition-colors cursor-pointer whitespace-nowrap"
                >
                  {{ $t("platform.btn_manage") }}
                </button>
                <button
                  type="button"
                  @click="emit('toggle-active', r)"
                  :disabled="saving"
                  :title="isExpired(r) ? $t('platform.btn_activate') : $t('platform.btn_suspend')"
                  :class="[
                    'px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50',
                    isExpired(r)
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50',
                  ]"
                >
                  {{ isExpired(r) ? $t("platform.btn_activate") : $t("platform.btn_suspend") }}
                </button>
                <button
                  type="button"
                  @click="emit('delete', r)"
                  :title="$t('platform.btn_delete')"
                  class="p-2 rounded-xl bg-white text-red-600 border border-red-100 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <BaseIcon name="trash" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  PlatformRestaurant,
  PlatformStatus,
} from "~/composables/usePlatformRestaurants";
import {
  buildWhatsAppUrl,
  isSubscriptionExpiredCheck,
  resolvePlanId,
} from "~/utils/helpers";

const { t, locale } = useI18n();

const props = defineProps<{
  restaurants: PlatformRestaurant[];
  loading: boolean;
  saving: boolean;
  searchQuery: string;
  statusFilter: "all" | PlatformStatus;
  planFilter: "all" | "free" | "basic" | "pro";
  getDaysRemaining: (r: PlatformRestaurant) => number | null;
  getRestaurantStatus: (r: PlatformRestaurant) => PlatformStatus;
  getDisplayName: (r: PlatformRestaurant | null) => string;
}>();

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "update:statusFilter", value: "all" | PlatformStatus): void;
  (e: "update:planFilter", value: "all" | "free" | "basic" | "pro"): void;
  (e: "renew", restaurant: PlatformRestaurant): void;
  (e: "toggle-active", restaurant: PlatformRestaurant): void;
  (e: "delete", restaurant: PlatformRestaurant): void;
}>();

const statusTabs = computed(() => [
  { key: "all" as const, label: t("common.all") },
  { key: "active" as const, label: t("platform.filter_active") },
  { key: "expiring" as const, label: t("platform.filter_expiring") },
  { key: "expired" as const, label: t("platform.filter_expired") },
  { key: "free" as const, label: t("platform.filter_free") },
]);

const isExpired = (r: PlatformRestaurant) => isSubscriptionExpiredCheck(r);

const getPlanLabel = (r: PlatformRestaurant) => {
  const id = resolvePlanId(r);
  if (id === "pro") return t("plans.pro_name");
  if (id === "basic") return t("plans.basic_name");
  return t("plans.free_name");
};

const getPlanBadgeClass = (r: PlatformRestaurant) => {
  const id = resolvePlanId(r);
  if (id === "pro") return "bg-orange-100 text-orange-700";
  if (id === "basic") return "bg-blue-50 text-blue-700";
  return "bg-gray-100 text-gray-600";
};

const getStatusBadgeClass = (r: PlatformRestaurant) => {
  const s = props.getRestaurantStatus(r);
  if (s === "expired") return "bg-red-50 text-red-600 border border-red-200/70";
  if (s === "expiring") return "bg-amber-50 text-amber-700 border border-amber-200/70";
  if (s === "free") return "bg-gray-100 text-gray-600";
  return "bg-emerald-50 text-emerald-700 border border-emerald-200/70";
};

const getStatusText = (r: PlatformRestaurant) => {
  const s = props.getRestaurantStatus(r);
  const days = props.getDaysRemaining(r);
  if (s === "expired") return t("platform.status_expired");
  if (s === "expiring" && days !== null) {
    return t("platform.days_left", { days });
  }
  if (s === "free") return t("plans.free_name");
  if (days !== null) return t("platform.days_left", { days });
  return t("platform.status_active");
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(locale.value === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
</script>
