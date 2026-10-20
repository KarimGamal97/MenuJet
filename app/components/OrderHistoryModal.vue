<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="$emit('close')"
      />

      <div
        class="relative w-full sm:max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl z-10 max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300"
      >
        <div
          class="flex items-center justify-between px-6 py-5 border-b border-gray-50"
        >
          <h2 class="text-xl font-black text-gray-800 flex items-center gap-3">
            <div
              class="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600"
            >
              <BaseIcon name="history" class="w-6 h-6" />
            </div>
            {{ $t("history.title") }}
          </h2>
          <button
            @click="$emit('close')"
            class="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors font-bold text-xl"
          >
            <BaseIcon name="close" class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div v-if="history.length === 0" class="text-center py-12">
            <div class="flex justify-center mb-6">
              <BaseIcon name="journal" class="w-20 h-20 text-gray-100" />
            </div>
            <p class="text-gray-400 font-bold">{{ $t("history.empty") }}</p>
          </div>

          <div
            v-for="order in history"
            :key="order.id + order.time"
            class="bg-gray-50 rounded-[2rem] p-5 border border-gray-100 hover:border-orange-200 transition-colors group"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <span
                  class="text-[10px] font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider"
                >
                  {{
                    order.type === "whatsapp"
                      ? $t("history.whatsapp_order")
                      : $t("history.cashier_order")
                  }}
                </span>
                <h3 class="text-lg font-black text-gray-800 mt-2">
                  {{ $t("history.order_prefix") }}{{ order.id }}
                </h3>
                <p class="text-[10px] text-gray-400 font-bold mt-1">
                  {{ formatDate(order.time) }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-400 font-bold">
                  {{ $t("history.total") }}
                </p>
                <p class="text-lg font-black text-orange-600">
                  {{ order.total }} {{ $t("currency") }}
                </p>
              </div>
            </div>

            <div class="space-y-2 border-t border-gray-200/50 pt-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex justify-between items-center text-sm"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="w-5 h-5 bg-white rounded-md flex items-center justify-center text-[10px] font-black border border-gray-100 text-gray-500"
                  >
                    {{ item.quantity }}x
                  </span>
                  <span class="font-bold text-gray-600">{{ item.name }}</span>
                </div>
                <span class="font-bold text-gray-400 text-xs">
                  {{ item.price * item.quantity }} {{ $t("currency") }}
                </span>
              </div>
            </div>

            <!-- Customer Edit Order Action (if allowed by restaurant and within window) -->
            <div
              v-if="canEditOrder(order)"
              class="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between gap-2 flex-wrap"
            >
              <div class="flex items-center gap-1.5 text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-100">
                <BaseIcon name="clock" class="w-3.5 h-3.5" />
                <span>{{ $t("history.edit_window_remaining") }} {{ getRemainingTime(order) }}</span>
              </div>

              <button
                type="button"
                @click="handleRequestEdit(order)"
                class="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-xs font-black transition-all shadow-sm shadow-orange-500/20 cursor-pointer"
              >
                <BaseIcon name="edit" class="w-3.5 h-3.5" />
                <span>{{ $t("history.edit_order") }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  restaurant: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["close", "edit-order"]);

const { history } = useOrderHistory();
const { locale, t } = useI18n();

const currentTime = ref(Date.now());
let timerInterval = null;

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      currentTime.value = Date.now();
      timerInterval = setInterval(() => {
        currentTime.value = Date.now();
      }, 1000);
    } else if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const canEditOrder = (order) => {
  if (!props.restaurant?.allow_order_editing) return false;
  if (order.status && order.status !== "pending") return false;
  if (!order.time) return false;
  const windowMins = Number(props.restaurant.order_edit_window_minutes) || 5;
  const orderTime = new Date(order.time).getTime();
  const elapsedMins = (currentTime.value - orderTime) / (1000 * 60);
  return elapsedMins < windowMins;
};

const getRemainingTime = (order) => {
  const windowMins = Number(props.restaurant?.order_edit_window_minutes) || 5;
  const orderTime = new Date(order.time).getTime();
  const elapsedSecs = Math.floor((currentTime.value - orderTime) / 1000);
  const remainingSecs = Math.max(0, windowMins * 60 - elapsedSecs);
  const mins = Math.floor(remainingSecs / 60);
  const secs = remainingSecs % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const handleRequestEdit = (order) => {
  emit("edit-order", order);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString(locale.value === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
</style>
