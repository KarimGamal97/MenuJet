<template>
  <div class="p-6 space-y-6" dir="rtl">
    <div
      class="flex justify-between items-center bg-white p-4 rounded-[2rem] shadow-sm"
    >
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center"
        >
          <BaseIcon name="boxes" class="w-7 h-7 text-orange-600" />
        </div>
        <h1 class="text-xl font-black text-gray-800">Live Orders</h1>
      </div>

      <div class="flex items-center gap-3">
        <!-- Live Status Label -->
        <div
          class="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-green-500"
            ></span>
          </span>
          <span class="text-[10px] font-bold text-gray-400"
            >Live Connection</span
          >
        </div>

        <!-- Reset/Cleanup Center Trigger -->
        <button
          @click="showCleanupModal = true"
          class="w-11 h-11 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
        >
          <BaseIcon name="trash" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Cleanup Center Modal -->
    <Teleport to="body">
      <div
        v-if="showCleanupModal"
        class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
      >
        <div
          class="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative"
        >
          <h3 class="text-xl font-black text-gray-900 mb-2">
            {{ $t("admin.cleanup_title") }}
          </h3>
          <p class="text-xs text-gray-400 font-bold mb-6">
            {{ $t("admin.cleanup_subtitle") }}
          </p>

          <div class="space-y-3">
            <button
              v-for="opt in cleanupOptions"
              :key="opt.type"
              @click="selectedCleanupType = opt.type"
              :class="[
                'w-full p-4 rounded-2xl border-2 transition-all text-right group flex items-center justify-between',
                selectedCleanupType === opt.type
                  ? 'border-orange-500 bg-orange-50/50'
                  : 'border-gray-50 bg-gray-50 hover:border-gray-200',
              ]"
            >
              <div>
                <p class="font-black text-sm text-gray-800">
                  {{ $t(opt.labelKey) }}
                </p>
                <p class="text-[10px] text-gray-400 font-bold mt-0.5">
                  {{ $t(opt.descKey) }}
                </p>
              </div>
              <div
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                :class="
                  selectedCleanupType === opt.type
                    ? 'border-orange-500 bg-orange-500'
                    : 'border-gray-200 bg-white'
                "
              >
                <div
                  v-if="selectedCleanupType === opt.type"
                  class="w-2 h-2 bg-white rounded-full"
                ></div>
              </div>
            </button>
          </div>

          <p
            class="mt-6 text-[10px] text-red-400 font-bold px-1 text-center italic"
          >
            {{ $t("admin.cleanup_confirm") }}
          </p>

          <div class="flex gap-3 mt-6">
            <button
              @click="showCleanupModal = false"
              class="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 active:scale-95 transition-all"
            >
              {{ $t("admin.cancel") }}
            </button>
            <button
              @click="handleCleanup"
              :disabled="!selectedCleanupType || isCleaning"
              class="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-100 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <div
                v-if="isCleaning"
                class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"
              ></div>
              {{ $t("admin.cleanup_btn") }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <div
      v-if="orders.length === 0"
      class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100"
    >
      <div class="mb-6 text-gray-100">
        <BaseIcon name="boxes" class="w-20 h-20" />
      </div>
      <p class="text-gray-400 font-bold opacity-60">
        No orders received yet today
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="order in orders"
        :key="order.id"
        :class="[
          'p-6 rounded-[2.5rem] border-2 transition-all duration-500',
          order.status === 'pending'
            ? 'bg-white border-orange-200 shadow-xl shadow-orange-100'
            : 'bg-green-50/10 border-green-500/20 opacity-80 shadow-none',
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
          <div class="text-left font-sans">
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
            class="flex justify-between items-center bg-gray-50/50 p-3 rounded-2xl"
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
            <span class="font-black text-gray-900 text-sm font-sans">
              {{ item.price * item.quantity }}
              <small class="text-[10px]">{{ $t("currency") }}</small>
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
            <div class="text-xl font-black text-gray-800 font-sans">
              {{ order.total_price }}
              <small class="text-xs">{{ $t("currency") }}</small>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              v-if="order.status === 'pending'"
              @click="updateStatus(order.id, 'completed')"
              class="bg-yellow-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-yellow-600 active:scale-95 transition-all shadow-lg shadow-yellow-100 text-sm flex items-center gap-2"
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
const { $toast } = useNuxtApp();
const orders = ref([]);
const realtimeChannel = ref(null);

// Cleanup State
const showCleanupModal = ref(false);
const selectedCleanupType = ref(null);
const isCleaning = ref(false);

const cleanupOptions = [
  {
    type: "completed",
    labelKey: "admin.cleanup_completed",
    descKey: "admin.cleanup_subtitle",
  },
  {
    type: "old",
    labelKey: "admin.cleanup_older_than_7",
    descKey: "admin.cleanup_subtitle",
  },
  {
    type: "all",
    labelKey: "admin.cleanup_all",
    descKey: "admin.cleanup_confirm",
  },
];

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

// Handle Cleanup
const handleCleanup = async () => {
  const userId = user.value?.id || user.value?.sub;
  if (!userId || !selectedCleanupType.value) return;

  isCleaning.value = true;
  try {
    let query = client.from("orders").delete().eq("user_id", userId);

    if (selectedCleanupType.value === "completed") {
      query = query.eq("status", "completed");
    } else if (selectedCleanupType.value === "old") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.lt("created_at", sevenDaysAgo.toISOString());
    }
    // 'all' doesn't need additional filters

    const { error } = await query;
    if (error) throw error;

    $toast.success($t("admin.cleanup_success"));
    showCleanupModal.value = false;
    page.value = 1;
    await fetchOrders(userId);
  } catch (err) {
    console.error("Cleanup Error:", err);
    $toast.error(err.message);
  } finally {
    isCleaning.value = false;
  }
};

// 2. Core Realtime Function
const setupRealtime = (userId) => {
  if (!userId || realtimeChannel.value) return;

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
        orders.value.unshift(payload.new);
        playNotificationSound();
      },
    )
    .subscribe();
};

// 3. The Activation Logic
onMounted(async () => {
  const {
    data: { session },
  } = await client.auth.getSession();

  if (session?.user) {
    const userId = session.user.id;
    await fetchOrders(userId);
    setupRealtime(userId);
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
