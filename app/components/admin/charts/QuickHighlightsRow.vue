<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- 1. Peak Day -->
    <div class="bg-gradient-to-br from-amber-50 to-orange-50/40 p-5 rounded-[2rem] border border-orange-100/80 flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
        <BaseIcon name="fire" class="w-6 h-6" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-bold text-orange-900/60 uppercase">
          {{ $t("admin.peak_day_label") || "اليوم الأكثر طلباً" }}
        </p>
        <p class="text-lg font-black text-gray-900 truncate mt-0.5">
          {{ peakDay ? `${peakDay.dayName} (${peakDay.ordersCount} طلب)` : 'لا توجد بيانات' }}
        </p>
        <span v-if="peakDay && peakDay.revenue > 0" class="text-xs text-orange-600 font-bold">
          {{ peakDay.revenue.toLocaleString() }} {{ $t("currency") }}
        </span>
      </div>
    </div>

    <!-- 2. Top Dish -->
    <div class="bg-gradient-to-br from-purple-50 to-indigo-50/40 p-5 rounded-[2rem] border border-purple-100/80 flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 shrink-0">
        <BaseIcon name="star" class="w-6 h-6" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-bold text-purple-900/60 uppercase">
          {{ $t("admin.top_item_label") || "الصنف الأكثر طلباً" }}
        </p>
        <p class="text-lg font-black text-gray-900 truncate mt-0.5" :title="topDish?.name">
          {{ topDish ? topDish.name : 'لا توجد بيانات' }}
        </p>
        <span v-if="topDish" class="text-xs text-purple-600 font-bold">
          تم طلبه {{ topDish.count }} مرة
        </span>
      </div>
    </div>

    <!-- 3. Daily Average -->
    <div class="bg-gradient-to-br from-emerald-50 to-green-50/40 p-5 rounded-[2rem] border border-emerald-100/80 flex items-center gap-4">
      <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
        <BaseIcon name="chart" class="w-6 h-6" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-bold text-emerald-900/60 uppercase">
          {{ $t("admin.avg_daily_orders") || "معدل الطلبات اليومي" }}
        </p>
        <p class="text-lg font-black text-gray-900 mt-0.5">
          {{ avgDailyOrders }} <span class="text-xs font-bold text-emerald-600">طلب / يوم</span>
        </p>
        <span class="text-xs text-gray-400 font-medium">
          خلال {{ selectedPeriod }} يوم
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  peakDay: { dayName: string; ordersCount: number; revenue: number } | null
  topDish: { name: string; count: number } | null | undefined
  avgDailyOrders: string
  selectedPeriod: number
}>()
</script>
