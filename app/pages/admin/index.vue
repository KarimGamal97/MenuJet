<template>
  <div class="space-y-8" dir="rtl">
    <!-- 1. Loading State (Skeleton) -->
    <template v-if="pending">
      <IndexSkeleton />
    </template>

    <!-- 2. Dashboard Stats Ready -->
    <template v-else>
      <div
        class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
      >
        <h1 class="text-3xl font-black text-gray-900 flex items-center gap-3">
          {{ $t("admin.dashboard_title") }}
          <BaseIcon name="dashboard" class="w-8 h-8 text-orange-600" />
        </h1>
        <p class="text-gray-500 mt-2">
          {{ $t("admin.dashboard_subtitle") }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Items -->
        <div
          class="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 group hover:shadow-lg transition-all duration-300"
        >
          <div
            class="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform"
          >
            <BaseIcon name="list" class="w-7 h-7" />
          </div>
          <div class="flex flex-col w-full">
            <h3 class="text-gray-600 font-bold mt-4">
              {{ $t("admin.items_label") }}
            </h3>
            <div class="flex items-center gap-2">
              <p class="text-3xl font-black text-orange-600">
                {{ stats?.items }}
              </p>
              <span class="text-sm font-bold text-orange-300">{{
                $t("admin.items_unit")
              }}</span>
            </div>
          </div>
        </div>

        <!-- Total Orders -->
        <div
          class="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 group hover:shadow-lg transition-all duration-300"
        >
          <div
            class="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"
          >
            <BaseIcon name="cart" class="w-7 h-7" />
          </div>
          <h3 class="text-gray-600 font-bold mt-4">
            {{ $t("admin.visits_label") }}
          </h3>
          <p class="text-3xl font-black text-blue-600">
            {{ stats?.orders }}
            <span class="text-sm font-bold text-blue-300">{{
              $t("admin.visits_unit")
            }}</span>
          </p>
        </div>

        <!-- Total Revenue -->
        <div
          class="bg-green-50 p-6 rounded-[2rem] border border-green-100 group hover:shadow-lg transition-all duration-300"
        >
          <div
            class="w-12 h-12 bg-green-600/10 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform"
          >
            <BaseIcon name="chart" class="w-7 h-7" />
          </div>
          <h3 class="text-gray-600 font-bold mt-4">
            {{ $t("admin.revenue_label") }}
          </h3>
          <p class="text-3xl font-black text-green-600">
            {{ stats?.revenue }}
            <span class="text-sm font-bold text-green-300">{{
              $t("currency")
            }}</span>
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const user = useSupabaseUser();

const { data: stats, pending } = useAsyncData(
  "admin-stats",
  async () => {
    if (!user.value) return { items: 0, orders: 0, revenue: 0 };
    const uId = user.value.id || user.value.sub;

    // Get total items
    const { count: itemsCount } = await client
      .from("menu_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", uId);

    // Get total orders count
    const { count: ordersCount } = await client
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", uId);

    // Get total revenue (sum of all orders)
    const { data: oData } = await client
      .from("orders")
      .select("total_price")
      .eq("user_id", uId);

    const revenueCount =
      oData?.reduce((acc, current) => acc + (current.total_price || 0), 0) || 0;

    return {
      items: itemsCount || 0,
      orders: ordersCount || 0,
      revenue: revenueCount,
    };
  },
  {
    lazy: true,
    watch: [user],
  },
);

definePageMeta({ layout: "admin", middleware: "auth" });
</script>
