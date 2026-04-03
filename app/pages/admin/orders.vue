<template>
  <div class="p-6 space-y-6" dir="rtl">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-black text-gray-800 flex items-center gap-3">
        <BaseIcon name="boxes" class="w-8 h-8 text-orange-600" />
        Live Cashier Orders
      </h1>
      <div class="flex items-center gap-2">
        <span class="relative flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-green-500"
          ></span>
        </span>
        <span class="text-sm font-bold text-gray-500 text-right"
          >Live Connection Active</span
        >
      </div>
    </div>

    <div
      v-if="orders.length === 0"
      class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200"
    >
      <div class="mb-6 text-gray-100">
        <BaseIcon name="boxes" class="w-20 h-20" />
      </div>
      <p class="text-gray-500 font-bold">No orders received yet today</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="order in orders"
        :key="order.id"
        :class="[
          'p-6 rounded-[2.5rem] border-2 transition-all duration-500',
          order.status === 'pending'
            ? 'bg-white border-orange-200 shadow-xl shadow-orange-100'
            : 'bg-green-50/30 border-green-500/50 opacity-80 shadow-none',
        ]"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <span
              class="text-[10px] uppercase tracking-wider font-black text-gray-400"
              >Order ID</span
            >
            <div class="flex items-center gap-2">
              <h3 class="text-2xl font-black text-orange-600">
                #{{ order.id.toString().padStart(4, "0") }}
              </h3>
              <div
                v-if="order.status === 'pending'"
                class="bg-orange-50 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-lg border border-orange-100 uppercase tracking-tighter"
              >
                {{ $t("admin.order_status_pending") }}
              </div>
            </div>
          </div>
          <div class="text-left">
            <span
              class="text-[10px] uppercase tracking-wider font-black text-gray-400"
              >Time</span
            >
            <p class="text-sm font-bold text-gray-600">
              {{
                new Date(order.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            </p>
          </div>
        </div>

        <div class="space-y-2 mb-6">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex justify-between items-center bg-gray-100/50 p-3 rounded-2xl"
          >
            <div class="flex items-center gap-2">
              <span
                class="w-6 h-6 flex items-center justify-center bg-orange-100 text-orange-600 rounded-lg text-xs font-black"
              >
                {{ item.quantity }}
              </span>
              <span class="font-bold text-gray-700 text-sm">{{
                item.name
              }}</span>
            </div>
            <span class="font-black text-gray-900 text-sm">
              {{ item.price * item.quantity }}
              <small class="text-[10px]">EGP</small>
            </span>
          </div>
        </div>

        <div
          class="flex justify-between items-center border-t border-gray-100 pt-4"
        >
          <div>
            <span class="text-[10px] font-bold text-gray-400 block"
              >Total Amount</span
            >
            <div class="text-xl font-black text-gray-800">
              {{ order.total_price }} <small class="text-xs">EGP</small>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              v-if="order.status === 'pending'"
              @click="updateStatus(order.id, 'completed')"
              class="bg-green-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-100 text-sm flex items-center gap-2"
            >
              {{ $t("admin.order_confirm_btn") || "Complete" }}
              <BaseIcon name="chevron-left" class="w-4 h-4" />
            </button>
            <span
              v-else
              class="text-green-600 font-bold bg-green-50 px-5 py-2.5 rounded-2xl text-sm border border-green-100/50"
            >
              {{ $t("admin.order_status_completed") || "Completed" }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-center gap-4 pt-10"
    >
      <button
        @click="changePage(page - 1)"
        :disabled="page === 1"
        class="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:border-orange-200 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm"
      >
        <BaseIcon name="chevron-right" class="w-5 h-5" />
      </button>

      <div class="flex items-center gap-2">
        <span class="text-sm font-black text-gray-800">{{ page }}</span>
        <span class="text-xs font-bold text-gray-400">/</span>
        <span class="text-sm font-black text-gray-400">{{ totalPages }}</span>
      </div>

      <button
        @click="changePage(page + 1)"
        :disabled="page >= totalPages"
        class="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-orange-600 hover:border-orange-200 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm"
      >
        <BaseIcon name="chevron-left" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin", middleware: "auth" });

const client = useSupabaseClient();
const user = useSupabaseUser();
const orders = ref([]);
const realtimeChannel = ref(null);

// Pagination State
const page = ref(1);
const pageSize = ref(15);
const totalOrders = ref(0);
const totalPages = computed(() =>
  Math.ceil(totalOrders.value / pageSize.value),
);

// 1. Core Fetch Function
const fetchOrders = async (userId) => {
  if (!userId) return;

  const start = (page.value - 1) * pageSize.value;
  const end = start + pageSize.value - 1;

  console.log(`📡 Fetching orders for UID: ${userId}, Page: ${page.value}`);

  const { data, error, count } = await client
    .from("orders")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) console.error("❌ Fetch Error:", error);
  else {
    orders.value = data || [];
    totalOrders.value = count || 0;
  }
};

const changePage = (newPage) => {
  page.value = newPage;
  const userId = user.value?.id || user.value?.sub;
  if (userId) fetchOrders(userId);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 2. Core Realtime Function
const setupRealtime = (userId) => {
  if (!userId || realtimeChannel.value) return;

  console.log("🔌 Initializing Realtime for UID:", userId);
  realtimeChannel.value = client
    .channel("orders-admin")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "orders",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log("🔔 NEW ORDER RECEIVED!", payload.new);
        orders.value.unshift(payload.new);
        playNotificationSound();
      },
    )
    .subscribe((status) => console.log("🌐 Connection Status:", status));
};

// 3. The Activation Logic (The Fix)
onMounted(async () => {
  console.log("🖥️ Component Mounted");

  // Wait for session manually to be 100% sure
  const {
    data: { session },
  } = await client.auth.getSession();

  if (session?.user) {
    const userId = session.user.id;
    console.log("✅ Using Session UID:", userId);
    await fetchOrders(userId);
    setupRealtime(userId);
  } else {
    console.error("🚫 No session found on mount");
  }
});

const playNotificationSound = () => {
  const audio = new Audio("/notification.mp3");
  audio.play().catch((e) => console.warn("🔊 Sound blocked by browser"));
};

const updateStatus = async (id, status) => {
  await client.from("orders").update({ status }).eq("id", id);
  const idx = orders.value.findIndex((o) => o.id === id);
  if (idx !== -1) orders.value[idx].status = status;
};
</script>
