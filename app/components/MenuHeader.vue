<template>
  <header
    class="sticky top-0 z-50 bg-orange-600 backdrop-blur-xl transition-all duration-300 h-20"
  >
    <div
      class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center h-full"
    >
      <!-- Brand Logo & Status -->
      <div class="flex flex-col items-center shrink-0">
        <div
          class="flex items-center justify-center overflow-hidden transition-transform mb-1"
        >
          <span class="text-white font-black capitalize text-lg sm:text-xl leading-none">
            {{ restaurant.business_name }}
          </span>
        </div>

        <!-- Status Badge below Logo -->
        <div
          v-if="isOpen !== false"
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

      <!-- MenuJet Brand Link to Landing (Aligned on the same row as cafe logo/name) -->
      <div class="flex flex-col items-center shrink-0">
        <div class="flex items-center justify-center mb-1">
          <NuxtLink
            to="/"
            dir="ltr"
            class="text-white font-black text-xl sm:text-2xl tracking-tight hover:opacity-90 transition-all active:scale-95 select-none leading-none inline-block"
            title="MenuJet"
          >
            <span class="text-orange-400">M</span>enu<span class="text-orange-400">J</span>et
          </NuxtLink>
        </div>
        <!-- Spacer matching badge height so MenuJet is on the exact same row as restaurant name -->
        <div class="h-[21px] invisible select-none pointer-events-none" aria-hidden="true"></div>
      </div>

      <!-- Previous Orders Button (Commented out from top header as requested) -->
      <!--
      <button
        @click="showHistory = true"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50/40 hover:bg-orange-50 rounded-2xl transition-all active:scale-95 group border border-gray-100/50 shadow-sm pr-1.5"
        aria-label="Previous Orders"
      >
        <div
          class="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
        >
          <BaseIcon name="history" class="w-4 h-4 text-orange-600" />
        </div>
        <div class="flex gap-1 items-start leading-none ml-1">
          <span class="text-[10px] font-black text-gray-800">
            {{ $t("history.title") }}
          </span>
        </div>
      </button>
      -->
    </div>
  </header>

  <!-- Floating Order Status Widget (Appears like scroll-up arrow on screen) -->
  <Teleport to="body">
    <button
      v-if="hasOrders"
      @click="showHistory = true"
      class="fixed bottom-24 left-4 z-40 flex items-center gap-2 px-3.5 py-2 bg-white/95 text-gray-800 backdrop-blur-md rounded-full shadow-xl border border-gray-100 active:scale-95 transition-all text-xs font-bold hover:shadow-orange-500/10 group animate-in fade-in slide-in-from-bottom-4 duration-300 select-none"
      aria-label="Orders"
    >
      <div class="w-6 h-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
        <BaseIcon name="history" class="w-3.5 h-3.5" />
      </div>
      <span class="text-xs font-black text-gray-800">
        {{ locale === 'ar' ? 'طلباتك' : 'Your Orders' }}
      </span>
    </button>
  </Teleport>

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
defineProps(["restaurant", "locale", "isOpen"]);
const { setLocale } = useI18n();

const { totalPrice, cartCount } = useCart();
const { history, loadHistory } = useOrderHistory();
const showCart = ref(false);
const showHistory = ref(false);
const { locale } = useI18n();

const hasOrders = computed(() => Boolean(history.value && history.value.length > 0));

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
