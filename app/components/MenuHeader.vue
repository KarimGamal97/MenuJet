<template>
  <header
    class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 transition-all duration-300 h-20"
  >
    <div
      class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center h-full"
    >
      <!-- Brand Logo & Status -->
      <div class="flex flex-col items-center shrink-0">
        <div
          class="flex items-center justify-center overflow-hidden transition-transform mb-1"
        >
          <span class="text-orange-600 font-black capitalize">
            {{ restaurant.business_name }}
          </span>
        </div>

        <!-- Status Badge below Logo -->
        <div
          v-if="restaurant.is_active"
          class="flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full"
        >
          <span class="relative flex h-1.5 w-1.5">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"
            ></span>
          </span>
          <span
            class="text-[9px] font-black text-green-600 whitespace-nowrap uppercase tracking-tight"
          >
            {{ $t("admin.status_available") }}
          </span>
        </div>
        <div
          v-else
          class="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full opacity-70"
        >
          <span class="inline-flex rounded-full h-1.5 w-1.5 bg-gray-300"></span>
          <span
            class="text-[9px] font-black text-gray-400 whitespace-nowrap uppercase tracking-tight"
          >
            {{ $t("admin.status_closed") }}
          </span>
        </div>
      </div>

      <!-- History Icon  -->
      <button
        @click="showHistory = true"
        class="flex items-center gap-2 px-5 py-2 bg-gray-50/50 hover:bg-orange-50 rounded-2xl transition-all active:scale-95 group border border-gray-100 shadow-sm pr-2"
        aria-label="Previous Orders"
      >
        <div
          class="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"
        >
          <BaseIcon name="history" class="w-5 h-5 text-orange-600" />
        </div>
        <div class="flex gap-1 items-start leading-none ml-1">
          <span class="text-[11px] font-black text-gray-800">
            {{ $t("history.title") }}</span
          >
        </div>
      </button>
    </div>
  </header>

  <!-- Cart Modal -->
  <CartModal
    :isOpen="showCart"
    :whatsappNumber="restaurant.whatsapp_number || ''"
    :restaurantUserId="restaurant.user_id || ''"
    @close="showCart = false"
  />

  <!-- History Modal -->
  <OrderHistoryModal :isOpen="showHistory" @close="showHistory = false" />
</template>

<script setup>
defineProps(["restaurant", "locale"]);
const { setLocale } = useI18n();

const { totalPrice, cartCount } = useCart();
const { loadHistory } = useOrderHistory();
const showCart = ref(false);
const showHistory = ref(false);
const { locale } = useI18n();

const getLocaleTxt = (item, field) => {
  if (!item) return "";
  const currentLocale = locale.value;
  return (
    item[`${field}_${currentLocale}`] ||
    item[`${field}_ar`] ||
    item[field] ||
    (field === "business_name" ? item.name : "") ||
    ""
  );
};

onMounted(() => {
  if (process.client) {
    loadHistory();
  }
});
</script>
