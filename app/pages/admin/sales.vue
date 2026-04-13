<template>
  <div class="p-6 space-y-6" dir="rtl">
    <!-- العنوان وفلتر التاريخ -->
    <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-black text-gray-900 flex items-center gap-3">
            {{ isToday ? $t("admin.sales_today") : $t("admin.sales") }}
            <BaseIcon name="chart" class="w-8 h-8 text-green-600" />
          </h1>
          <p class="text-gray-500 mt-2">
            {{ $t("admin.search_profit") }}
          </p>
        </div>

        <div class="flex flex-wrap items-end gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-400 px-1">{{ $t("admin.from_date") }}</label>
            <input
              type="date"
              v-model="startDate"
              class="block w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-400 px-1">{{ $t("admin.to_date") }}</label>
            <input
              type="date"
              v-model="endDate"
              class="block w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>
          <BaseButton
            variant="primary"
            @click="fetchSales"
            :loading="loading"
            class="!h-[52px] !px-8 !bg-green-600 hover:!bg-green-700 shadow-lg shadow-green-100 transition-transform active:scale-95"
          >
            بحث
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- ملخص الأرباح -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-green-50 p-6 rounded-[2rem] border border-green-100 flex items-center gap-4 group hover:shadow-lg transition-all">
        <div class="w-14 h-14 bg-green-600/10 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
          <BaseIcon name="chart" class="w-8 h-8" />
        </div>
        <div>
          <p class="text-sm font-bold text-green-600/60 uppercase">{{ $t("admin.total_revenue_period") }}</p>
          <div class="flex items-center gap-2">
            <p class="text-3xl font-black text-green-600">{{ totalRevenue }}</p>
            <span class="text-sm font-bold text-green-300">{{ $t("currency") }}</span>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center gap-4 group hover:shadow-lg transition-all">
        <div class="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
          <BaseIcon name="cart" class="w-8 h-8" />
        </div>
        <div>
          <p class="text-sm font-bold text-blue-600/60 uppercase">{{ $t("admin.visits_label") }}</p>
          <div class="flex items-center gap-2">
            <p class="text-3xl font-black text-blue-600">{{ orders.length }}</p>
            <span class="text-sm font-bold text-blue-300">{{ $t("admin.visits_unit") }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- قائمة الطلبات لهذه الفترة -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-64 bg-gray-100 animate-pulse rounded-[2.5rem]"></div>
    </div>

    <div v-else-if="orders.length === 0" class="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2.5rem] py-20 flex flex-col items-center justify-center">
       <BaseIcon name="boxes" class="w-20 h-20 text-gray-200 mb-4" />
       <p class="text-gray-400 font-bold opacity-60">{{ $t("admin.no_sales_period") }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <OrderCard
        v-for="order in orders"
        :key="order.id"
        :order="order"
        @update-status="fetchSales"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin", middleware: "auth" });

const client = useSupabaseClient();
const { userId } = useAuthUser();

const todayStr = new Date().toISOString().split('T')[0];
const startDate = ref(todayStr);
const endDate = ref(todayStr);
const orders = ref([]);
const loading = ref(false);

const isToday = computed(() => startDate.value === todayStr && endDate.value === todayStr);

const totalRevenue = computed(() => {
  return orders.value.reduce((acc, order) => acc + (order.total_price || 0), 0);
});

const fetchSales = async () => {
  if (!userId.value) return;
  loading.value = true;
  
  try {
    const { data, error } = await client
      .from("orders")
      .select("*")
      .eq("user_id", userId.value)
      .gte("created_at", `${startDate.value}T00:00:00`)
      .lte("created_at", `${endDate.value}T23:59:59`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    orders.value = data || [];
  } catch (err) {
    console.error("Sales Fetch Error:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchSales();
});
</script>
