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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-8 h-8 text-orange-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0h.5m-1.5 0h-10.5m0 0h-.5" />
          </svg>
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
          <div class="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-4.63 3.523 3.75 3.75 0 0 0 4.135 3.945Z" />
            </svg>
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

        <!-- Visitor Stats -->
        <div
          class="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 group hover:shadow-lg transition-all duration-300"
        >
          <div class="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          </div>
          <h3 class="text-gray-600 font-bold mt-4">
            {{ $t("admin.visits_label") }}
          </h3>
          <p class="text-3xl font-black text-blue-600">
            {{ stats?.views }}
            <span class="text-sm font-bold text-blue-300">{{
              $t("admin.visits_unit")
            }}</span>
          </p>
        </div>

        <!-- Menu Status -->
        <div
          class="bg-green-50 p-6 rounded-[2rem] border border-green-100 group hover:shadow-lg transition-all duration-300"
        >
          <div class="w-12 h-12 bg-green-600/10 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 class="text-gray-600 font-bold mt-4">
            {{ $t("admin.status_label") }}
          </h3>
          <p class="text-2xl font-black text-green-600 uppercase">
            {{
              stats?.status
                ? $t(`admin.status_${stats.status.toLowerCase()}`)
                : $t("admin.status_active")
            }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const user = useSupabaseUser();

// Fetch real stats from Supabase
const { data: stats, pending } = useAsyncData(
  "admin-stats",
  async () => {
    if (!user.value) return { items: 0, status: "Active", views: 0 };

    const { count: itemsCount } = await client
      .from("menu_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.value.sub || user.value.id);

    // 2. Get restaurant profile status
    const { data: profile } = await client
      .from("profiles")
      .select("status")
      .eq("user_id", user.value.sub || user.value.id)
      .maybeSingle();

    return {
      items: itemsCount || 0,
      status: profile?.status || "Active",
      views: 0,
    };
  },
  {
    lazy: true,
    watch: [user],
  },
);

definePageMeta({ layout: "admin", middleware: "auth" });
</script>
