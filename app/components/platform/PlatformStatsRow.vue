<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    <div
      v-for="card in cards"
      :key="card.key"
      class="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center gap-3.5"
    >
      <div
        :class="card.iconBg"
        class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
      >
        <BaseIcon :name="card.icon" class="w-5 h-5" />
      </div>
      <div class="min-w-0">
        <p class="text-[11px] font-bold text-gray-400 truncate">
          {{ card.label }}
        </p>
        <p class="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
          {{ card.value }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const props = defineProps<{
  stats: {
    total: number;
    active: number;
    expiring: number;
    expired: number;
  };
}>();

const cards = computed(() => [
  {
    key: "total",
    label: t("platform.stats_total"),
    value: props.stats.total,
    icon: "store",
    iconBg: "bg-slate-100 text-slate-700",
  },
  {
    key: "active",
    label: t("platform.stats_active"),
    value: props.stats.active,
    icon: "check",
    iconBg: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "expiring",
    label: t("platform.stats_expiring"),
    value: props.stats.expiring,
    icon: "clock",
    iconBg: "bg-amber-50 text-amber-600",
  },
  {
    key: "expired",
    label: t("platform.stats_expired"),
    value: props.stats.expired,
    icon: "alert",
    iconBg: "bg-red-50 text-red-600",
  },
]);
</script>
