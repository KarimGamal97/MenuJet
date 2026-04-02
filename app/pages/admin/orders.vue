<template>
  <div class="p-6 space-y-6" dir="rtl">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-black text-gray-800 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-orange-600">
          <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
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
      <div class="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20 text-gray-200">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
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
            ? 'bg-white border-orange-200 shadow-xl shadow-orange-50'
            : 'bg-gray-50 border-transparent opacity-75 shadow-none',
        ]"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <span
              class="text-[10px] uppercase tracking-wider font-black text-gray-400"
              >Order ID</span
            >
            <h3 class="text-2xl font-black text-orange-600">
              #{{ order.id.toString().padStart(4, "0") }}
            </h3>
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
                class="bg-green-500 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-green-600 active:scale-95 transition-all shadow-lg shadow-green-100 text-sm flex items-center gap-2"
              >
                {{ $t("admin.confirm") || "Done" }} 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
            <span
              v-else
              class="text-green-600 font-bold bg-green-50 px-5 py-2.5 rounded-2xl text-sm"
              >Completed</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin", middleware: "auth" });

const client = useSupabaseClient();
const user = useSupabaseUser();
const orders = ref([]);
const realtimeChannel = ref(null);

// 1. Core Fetch Function
const fetchOrders = async (userId) => {
  if (!userId) return;
  console.log("📡 Fetching orders for UID:", userId);
  const { data, error } = await client
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) console.error("❌ Fetch Error:", error);
  else orders.value = data || [];
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
