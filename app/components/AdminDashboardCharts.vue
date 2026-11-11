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
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- 1. Peak Day -->
      <div class="bg-gradient-to-br from-amber-50 to-orange-50/40 p-5 rounded-[2rem] border border-orange-100/80 flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
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
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
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
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
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

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Chart 1: Daily Orders & Revenue Trend (7 / 12) -->
      <div
        class="lg:col-span-7 bg-white p-5 sm:p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between"
      >
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

          <!-- Metric Toggle -->
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
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
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
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>المبيعات</span>
            </button>
          </div>
        </div>

        <!-- Canvas Container -->
        <div class="relative w-full h-[280px] md:h-[320px]">
          <canvas ref="trendCanvasRef" class="w-full h-full block"></canvas>
        </div>
      </div>

      <!-- Chart 2: Top Selling Dishes (5 / 12) -->
      <div
        class="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between"
      >
        <div class="mb-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black text-gray-900 flex items-center gap-2">
              {{ $t("admin.top_items_title") || "الأصناف الأكثر طلباً" }}
              <span class="text-xs font-bold px-2 py-0.5 bg-purple-50 text-purple-600 rounded-lg">
                Top 5
              </span>
            </h3>
            <span class="text-xs font-bold text-gray-400">
              {{ topDishesList.length }} أصناف
            </span>
          </div>
          <p class="text-xs text-gray-400 font-medium mt-1">
            الوجبات الأكثر تكراراً في طلبات العملاء
          </p>
        </div>

        <!-- Empty State -->
        <div
          v-if="topDishesList.length === 0"
          class="flex-1 flex flex-col items-center justify-center py-12 text-center"
        >
          <div class="w-16 h-16 rounded-3xl bg-gray-50 text-gray-300 flex items-center justify-center mb-3">
            <BaseIcon name="food" class="w-8 h-8" />
          </div>
          <p class="text-sm font-bold text-gray-400">
            {{ $t("admin.no_chart_data") || "لا توجد طلبات مسجلة خلال هذه الفترة" }}
          </p>
        </div>

        <!-- Ranking List -->
        <div v-show="topDishesList.length > 0" class="flex-1 flex flex-col justify-center">
          <!-- Dish Ranking List -->
          <div class="space-y-1 divide-y divide-gray-50">
            <div
              v-for="(item, idx) in topDishesList"
              :key="item.name"
              class="py-3 flex items-center justify-between text-xs gap-3"
            >
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <span
                  :class="[
                    'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0',
                    idx === 0 ? 'bg-amber-400 text-amber-950 shadow-sm' :
                    idx === 1 ? 'bg-gray-200 text-gray-800' :
                    idx === 2 ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-600'
                  ]"
                >
                  {{ idx + 1 }}
                </span>
                <span class="font-bold text-gray-800 truncate text-sm" :title="item.name">
                  {{ item.name }}
                </span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="w-20 text-center font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-xl text-xs shrink-0">
                  {{ item.count }} طلب
                </span>
                <span
                  v-if="item.totalRevenue"
                  class="w-24 text-start text-gray-400 font-bold text-xs shrink-0"
                >
                  ({{ item.totalRevenue.toLocaleString() }} ج.م)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Chart from "chart.js/auto";

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

const { t } = useI18n();

// Periods Filter
const periods = [
  { days: 7, label: "آخر 7 أيام" },
  { days: 14, label: "آخر 14 يوم" },
  { days: 30, label: "آخر 30 يوم" },
];

const selectedPeriod = ref(7);
const metricType = ref("orders"); // 'orders' | 'revenue'

const trendCanvasRef = ref(null);

let trendChartInstance = null;

// Helpers
const arabicDayNames = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const getLocalDateKey = (isoStr) => {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Filter orders within selected period
const filteredOrders = computed(() => {
  if (!props.orders || !props.orders.length) return [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - selectedPeriod.value);
  cutoff.setHours(0, 0, 0, 0);

  return props.orders.filter((order) => {
    if (!order.created_at) return false;
    return new Date(order.created_at) >= cutoff;
  });
});

// Daily Breakdown for the Trend Chart
const daysData = computed(() => {
  const result = [];
  const today = new Date();

  for (let i = selectedPeriod.value - 1; i >= 0; i--) {
    const target = new Date(today);
    target.setDate(today.getDate() - i);

    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, "0");
    const d = String(target.getDate()).padStart(2, "0");
    const dateKey = `${y}-${m}-${d}`;

    const dayName = arabicDayNames[target.getDay()];
    const shortDate = `${target.getDate()}/${target.getMonth() + 1}`;

    const dayOrders = filteredOrders.value.filter(
      (o) => getLocalDateKey(o.created_at) === dateKey
    );

    const ordersCount = dayOrders.length;
    const revenue = dayOrders.reduce(
      (sum, o) => sum + (Number(o.total_price) || 0),
      0
    );

    result.push({
      dateKey,
      dayName,
      shortDate,
      ordersCount,
      revenue,
    });
  }

  return result;
});

// Peak Day
const peakDay = computed(() => {
  if (!daysData.value.length) return null;
  const max = Math.max(...daysData.value.map((d) => d.ordersCount));
  if (max <= 0) return null;
  return daysData.value.find((d) => d.ordersCount === max) || null;
});

// Daily Average
const avgDailyOrders = computed(() => {
  const total = filteredOrders.value.length;
  if (!total) return "0";
  return (total / selectedPeriod.value).toFixed(1);
});

// Top Selling Dishes Aggregation
const topDishesList = computed(() => {
  const map = new Map();

  for (const order of filteredOrders.value) {
    let items = order.items;
    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
      } catch {
        items = [];
      }
    }
    if (!Array.isArray(items)) continue;

    for (const it of items) {
      const name = (it.name || "صنف").trim();
      const qty = Number(it.quantity) || 1;
      const price = Number(it.price || it.basePrice || 0) * qty;

      if (!map.has(name)) {
        map.set(name, { name, count: 0, totalRevenue: 0 });
      }
      const current = map.get(name);
      current.count += qty;
      current.totalRevenue += price;
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
});

// Top Dish
const topDish = computed(() => {
  return topDishesList.value.length ? topDishesList.value[0] : null;
});

const isMobile = ref(false);
let mediaQuery = null;

const updateViewportFlag = () => {
  isMobile.value = Boolean(mediaQuery?.matches);
};

// Render Trend Chart
const renderTrendChart = () => {
  if (!trendCanvasRef.value) return;

  if (trendChartInstance) {
    trendChartInstance.destroy();
    trendChartInstance = null;
  }

  const canvas = trendCanvasRef.value;
  const mobile = isMobile.value;
  const labels = daysData.value.map((d) => [d.dayName, d.shortDate]);
  const isOrders = metricType.value === "orders";
  const dataValues = isOrders
    ? daysData.value.map((d) => d.ordersCount)
    : daysData.value.map((d) => d.revenue);

  const maxVal = Math.max(...dataValues, 0);
  const shouldRotateOrSkip = mobile
    ? selectedPeriod.value > 7
    : selectedPeriod.value > 14;

  const baseTooltip = {
    textDirection: "rtl",
    backgroundColor: "#1F2937",
    titleFont: { family: "Tajawal, sans-serif", size: 13, weight: "bold" },
    bodyFont: { family: "Tajawal, sans-serif", size: 12 },
    padding: 12,
    cornerRadius: 12,
  };

  const formatTooltipTitle = (items) => {
    const day = daysData.value[items[0]?.dataIndex];
    return day ? `${day.dayName} - ${day.shortDate}` : "";
  };

  const xScale = {
    grid: { display: false },
    ticks: {
      font: {
        family: "Tajawal, sans-serif",
        size: mobile ? 9 : 11,
        weight: "bold",
      },
      color: "#6B7280",
      padding: mobile ? 4 : 6,
      maxRotation: shouldRotateOrSkip ? 45 : 0,
      minRotation: 0,
      autoSkip: shouldRotateOrSkip,
    },
  };

  try {
    if (isOrders) {
      trendChartInstance = new Chart(canvas, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "عدد الطلبات",
              data: dataValues,
              backgroundColor: daysData.value.map((d) =>
                d.ordersCount === maxVal && maxVal > 0 ? "#EA580C" : "#FED7AA"
              ),
              hoverBackgroundColor: "#EA580C",
              borderRadius: 8,
              borderSkipped: false,
              maxBarThickness: selectedPeriod.value > 14 ? 18 : 36,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              ...baseTooltip,
              callbacks: {
                title: formatTooltipTitle,
                label: (ctx) => `عدد الطلبات: ${ctx.parsed.y} طلب`,
                afterLabel: (ctx) => {
                  const day = daysData.value[ctx.dataIndex];
                  return day ? `المبيعات: ${day.revenue.toLocaleString()} ج.م` : "";
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                font: { family: "Tajawal, sans-serif", size: 11 },
                color: "#9CA3AF",
              },
              grid: {
                color: "#F3F4F6",
              },
            },
            x: xScale,
          },
        },
      });
    } else {
      const ctx = canvas.getContext("2d");
      const gradient = ctx ? ctx.createLinearGradient(0, 0, 0, 300) : null;
      if (gradient) {
        gradient.addColorStop(0, "rgba(16, 185, 129, 0.25)");
        gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");
      }

      trendChartInstance = new Chart(canvas, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "المبيعات (ج.م)",
              data: dataValues,
              borderColor: "#10B981",
              borderWidth: 3,
              backgroundColor: gradient || "rgba(16, 185, 129, 0.1)",
              fill: true,
              tension: 0.35,
              pointBackgroundColor: "#10B981",
              pointBorderColor: "#FFFFFF",
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              ...baseTooltip,
              callbacks: {
                title: formatTooltipTitle,
                label: (ctx) => `المبيعات: ${ctx.parsed.y.toLocaleString()} ج.م`,
                afterLabel: (ctx) => {
                  const day = daysData.value[ctx.dataIndex];
                  return day ? `عدد الطلبات: ${day.ordersCount} طلب` : "";
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: { family: "Tajawal, sans-serif", size: 11 },
                color: "#9CA3AF",
                callback: (val) => `${val.toLocaleString()} ج.م`,
              },
              grid: {
                color: "#F3F4F6",
              },
            },
            x: xScale,
          },
        },
      });
    }
  } catch (err) {
    console.error("Error creating trend chart:", err);
  }
};

const refreshAllCharts = () => {
  nextTick(() => {
    renderTrendChart();
  });
};

// Watchers
watch([daysData, metricType, isMobile], () => {
  nextTick(() => renderTrendChart());
});

watch(
  () => props.orders,
  () => {
    refreshAllCharts();
  },
  { deep: true }
);

onMounted(() => {
  if (typeof window !== "undefined") {
    mediaQuery = window.matchMedia("(max-width: 639px)");
    updateViewportFlag();
    mediaQuery.addEventListener("change", updateViewportFlag);
  }
  refreshAllCharts();
});

onBeforeUnmount(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener("change", updateViewportFlag);
    mediaQuery = null;
  }
  if (trendChartInstance) {
    trendChartInstance.destroy();
    trendChartInstance = null;
  }
});
</script>
