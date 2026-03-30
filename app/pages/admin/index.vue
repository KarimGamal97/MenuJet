<template>
  <div class="space-y-8" dir="rtl">
    <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <h1 class="text-3xl font-black text-gray-900">
        {{ $t("admin.dashboard_title") }}
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
        <span
          class="text-4xl group-hover:scale-110 inline-block transition-transform"
          >👩🏻‍🍳</span
        >
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
        <span
          class="text-4xl group-hover:scale-110 inline-block transition-transform"
          >🙋‍♂️</span
        >
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
        <span
          class="text-4xl group-hover:scale-110 inline-block transition-transform"
          >📜</span
        >
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
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const user = useSupabaseUser();

// Fetch real stats from Supabase
const { data: stats } = await useAsyncData(
  "admin-stats",
  async () => {
    if (!user.value) return { items: 0, status: "Active", views: 0 };

    const { count: itemsCount } = await client
      .from("menu_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.value.sub);

    // 2. Get restaurant profile status
    const { data: profile } = await client
      .from("profiles")
      .select("status")
      .eq("user_id", user.value.sub)
      .maybeSingle();

    return {
      items: itemsCount || 0,
      status: profile?.status || "Active",
      views: 0,
    };
  },
  {
    watch: [user],
  },
);

definePageMeta({ layout: "admin", middleware: "auth" });
</script>
