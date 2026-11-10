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
        <NuxtLink
          to="/admin/menu"
          class="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 group hover:shadow-lg transition-all duration-300 block"
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
        </NuxtLink>

        <!-- Total Orders -->
        <NuxtLink
          to="/admin/orders"
          class="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 group hover:shadow-lg transition-all duration-300 block"
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
        </NuxtLink>

        <!-- Total Revenue -->
        <NuxtLink
          v-if="userRole === 'super_admin'"
          to="/admin/sales"
          class="bg-green-50 p-6 rounded-[2rem] border border-green-100 group hover:shadow-lg transition-all duration-300 block"
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
        </NuxtLink>
      </div>

      <!-- 3. Performance Analytics & Charts (Pro Plan Exclusive) -->
      <ClientOnly>
        <template v-if="isPro">
          <AdminDashboardCharts
            :orders="stats?.recentOrders || []"
            :loading="pending"
          />
        </template>
        <template v-else>
          <div
            class="bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                <BaseIcon name="chart" class="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-black text-gray-900">
                    {{ $t("admin.analytics_title") || "إحصائيات وتحليلات الأداء" }}
                  </h3>
                  <span class="bg-amber-100 text-amber-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                    الباقة الاحترافية
                  </span>
                </div>
                <p class="text-xs text-gray-500 font-medium mt-1">
                  تابع حركة المبيعات اليومية، أيام الذروة، والأصناف الأكثر طلباً حصرياً مع الباقة الاحترافية.
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="showUpgradeModal = true"
              class="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs md:text-sm py-3 px-6 rounded-2xl shadow-md shadow-orange-500/20 transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              ترقية للباقة الاحترافية
            </button>
          </div>

          <UpgradeModal
            :isOpen="showUpgradeModal"
            title="الترقية للباقة الاحترافية"
            badgeText="الباقة الاحترافية"
            message="احصل على إحصائيات متقدمة لمطعمك، وتعرف على أيام الذروة والوجبات الأكثر مبيعاً لمضاعفة أرباحك."
            @close="showUpgradeModal = false"
          />
        </template>
      </ClientOnly>
    </template>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const { ownerId, userRole } = useAuthUser();
const { isPro } = usePlan();

const showUpgradeModal = ref(false);

const { data: stats, pending } = useAsyncData(
  "admin-stats",
  async () => {
    const uId = ownerId.value;
    if (!uId) return { items: 0, orders: 0, revenue: 0, recentOrders: [] };

    const todayStart = new Date().toISOString().split('T')[0];

    const { count: itemsCount } = await client
      .from("menu_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", uId);

    const { count: ordersCount } = await client
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", uId)
      .gte("created_at", todayStart);

    const { data: oData } = await client
      .from("orders")
      .select("total_price")
      .eq("user_id", uId)
      .gte("created_at", todayStart);

    const revenueCount =
      oData?.reduce((acc, current) => acc + (current.total_price || 0), 0) || 0;

    // Fetch past 30 days orders for analytics and trend charts only if Pro
    let recentOrders = [];
    if (isPro.value) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);

      const { data } = await client
        .from("orders")
        .select("id, total_price, items, created_at, status")
        .eq("user_id", uId)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      recentOrders = data || [];
    }

    return {
      items: itemsCount || 0,
      orders: ordersCount || 0,
      revenue: revenueCount,
      recentOrders,
    };
  },
  {
    lazy: true,
    watch: [ownerId, isPro],
  },
);


definePageMeta({ layout: "admin", middleware: "auth" });
</script>
