<template>
  <div class="space-y-6">
    <!-- Header & Filter Bar -->
    <div
      class="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h2 class="text-2xl font-black text-gray-900 flex items-center gap-3">
          {{ $t("admin.analytics_title") || "إحصائيات وتحليلات الأداء" }}
          <span class="p-2 bg-orange-50 text-orange-600 rounded-2xl">
            <BaseIcon name="chart" class="w-6 h-6" />
          </span>
        </h2>
        <p class="text-gray-500 text-sm mt-1">
          {{ $t("admin.analytics_subtitle") || "متابعة حركة الطلبات، أوقات الذروة، والأصناف الأكثر طلباً" }}
        </p>
      </div>

      <!-- Time Filter Pills -->
      <div class="flex items-center gap-1.5 p-1.5 bg-gray-50 border border-gray-100 rounded-2xl self-start md:self-auto">
        <button
          v-for="p in periods"
          :key="p.days"
          type="button"
          @click="selectedPeriod = p.days"
          :class="[
            'px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 cursor-pointer',
            selectedPeriod === p.days
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/80'
          ]"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Quick Highlights -->
    <AdminChartsQuickHighlightsRow
      :peakDay="peakDay"
      :topDish="topDish"
      :avgDailyOrders="avgDailyOrders"
      :selectedPeriod="selectedPeriod"
    />

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Chart 1: Daily Orders & Revenue Trend (7 / 12) -->
      <div class="lg:col-span-7 bg-white p-5 sm:p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 class="text-lg font-black text-gray-900 flex items-center gap-2">
              {{ $t("admin.orders_trend_title") || "حركة الطلبات والمبيعات" }}
              <span class="text-xs font-bold px-2 py-0.5 bg-orange-50 text-orange-600 rounded-lg">
                {{ selectedPeriod === 7 ? 'أسبوعي' : selectedPeriod === 14 ? 'أسبوعين' : 'شهري' }}
              </span>
            </h3>
            <p class="text-xs text-gray-400 font-medium mt-1">
              {{ metricType === 'orders' ? 'إجمالي الطلبات المسجلة لكل يوم' : 'إجمالي المبيعات المحققة بالجنيه' }}
            </p>
          </div>

          <div class="flex items-center gap-1 p-1 bg-gray-50 border border-gray-100 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              @click="metricType = 'orders'"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer',
                metricType === 'orders'
                  ? 'bg-white text-orange-600 shadow-sm font-black'
                  : 'text-gray-500 hover:text-gray-900'
              ]"
            >
              <BaseIcon name="cart" class="w-3.5 h-3.5" />
              <span>عدد الطلبات</span>
            </button>
            <button
              type="button"
              @click="metricType = 'revenue'"
              :class="[
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer',
                metricType === 'revenue'
                  ? 'bg-white text-emerald-600 shadow-sm font-black'
                  : 'text-gray-500 hover:text-gray-900'
              ]"
            >
              <BaseIcon name="wallet" class="w-3.5 h-3.5" />
              <span>المبيعات</span>
            </button>
          </div>
        </div>

        <div class="relative w-full h-[280px] md:h-[320px]">
          <canvas ref="trendCanvasRef" class="w-full h-full block"></canvas>
        </div>
      </div>

      <!-- Chart 2: Top Selling Dishes (5 / 12) -->
      <AdminChartsTopDishesCard :topDishesList="topDishesList" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const {
  periods,
  selectedPeriod,
  metricType,
  trendCanvasRef,
  peakDay,
  avgDailyOrders,
  topDishesList,
  topDish,
} = useDashboardCharts(() => props.orders);
</script>
