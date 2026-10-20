<template>
  <header
    class="sticky top-0 z-50 bg-orange-600 backdrop-blur-xl transition-all duration-300 h-20"
    :style="restaurant?.primary_color ? { backgroundColor: restaurant.primary_color } : {}"
  >
    <div
      class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center h-full"
    >
      <!-- Brand Logo & Status -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- Client Logo if uploaded -->
        <div
          v-if="restaurant?.logo"
          class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-white/15 p-0.5 border border-white/30 shadow-md shrink-0 flex items-center justify-center transition-transform hover:scale-105"
        >
          <img
            :src="restaurant.logo"
            :alt="restaurant.business_name"
            class="w-full h-full object-cover rounded-[14px]"
          />
        </div>

        <div class="flex flex-col items-start shrink-0">
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

  <!-- Floating Speed Dial Widget (Stacked Menu with + Trigger) -->
  <Teleport to="body">
    <div v-if="isFabVisible" class="fixed bottom-24 left-4 z-40 select-none">
      <!-- Backdrop when open to click-outside -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isFabOpen"
          class="fixed inset-0 z-30 bg-black/25 backdrop-blur-[1px]"
          @click="isFabOpen = false"
        />
      </Transition>

      <!-- Speed Dial Stacked Options (انبثاق انسيابي من مكان الزر) -->
      <Transition
        enter-active-class="transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-left"
        enter-from-class="opacity-0 scale-75 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in origin-bottom-left"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-75 translate-y-2"
      >
        <div
          v-if="isFabOpen"
          class="relative z-40 mb-3 flex flex-col gap-2.5 items-start"
        >
          <!-- 1. زر صفحة الترحيب والروابط (Bio Hub) -->
          <button
            v-if="isBioHubAllowed"
            @click="
              isFabOpen = false;
              emit('openBioHub');
            "
            type="button"
            class="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl backdrop-blur-md border border-white/20 text-xs font-bold transition-all active:scale-95 cursor-pointer whitespace-nowrap group"
          >
            <div class="w-6 h-6 rounded-full bg-white/10 text-amber-400 flex items-center justify-center shrink-0">
              <BaseIcon name="sparkles" class="w-3.5 h-3.5" />
            </div>
            <span>{{ $t('bio_hub.back_to_hub') }}</span>
          </button>

          <!-- 2. زر طلباتك (Orders History) -->
          <button
            v-if="hasOrders"
            @click="
              isFabOpen = false;
              showHistory = true;
            "
            type="button"
            class="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-xl backdrop-blur-md border border-gray-100 text-xs font-bold transition-all active:scale-95 cursor-pointer whitespace-nowrap group"
          >
            <div class="w-6 h-6 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <BaseIcon name="history" class="w-3.5 h-3.5" />
            </div>
            <div class="flex items-center gap-1.5">
              <span class="font-black">{{ locale === 'ar' ? 'طلباتك' : 'Your Orders' }}</span>
              <span
                v-if="history?.length"
                class="bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none"
              >
                {{ history.length }}
              </span>
            </div>
          </button>
        </div>
      </Transition>

      <!-- Main Floating (+) Trigger Button -->
      <button
        @click="isFabOpen = !isFabOpen"
        type="button"
        class="relative z-40 w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-2xl backdrop-blur-md border border-white/20 flex items-center justify-center active:scale-95 cursor-pointer group transition-colors duration-200"
        :class="{ '!bg-orange-600 border-orange-500': isFabOpen }"
        :aria-label="isFabOpen ? 'Close menu' : 'Open menu'"
        :title="isFabOpen ? (locale === 'ar' ? 'إغلاق' : 'Close') : (locale === 'ar' ? 'المزيد' : 'More')"
      >
        <!-- Plus Icon with smooth 45deg rotation on open -->
        <svg
          class="w-6 h-6 text-white transition-transform duration-200 ease-out"
          :class="{ 'rotate-45': isFabOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 5v14m7-7H5"
          />
        </svg>

        <!-- Unread / Active Orders Notification Badge (Fixed, no pulse) -->
        <span
          v-if="hasOrders && !isFabOpen"
          class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-orange-500 text-white text-[11px] font-black rounded-full border-2 border-white flex items-center justify-center shadow-md leading-none"
        >
          {{ history?.length || '!' }}
        </span>
      </button>
    </div>
  </Teleport>

  <!-- Cart Modal -->
  <CartModal
    :isOpen="showCart"
    :whatsappNumber="restaurant.whatsapp_number || ''"
    :restaurantUserId="restaurant.user_id || ''"
    @close="showCart = false"
  />

  <!-- History Modal -->
  <OrderHistoryModal
    :isOpen="showHistory"
    :restaurant="restaurant"
    @edit-order="handleEditFromHistory"
    @close="showHistory = false"
  />
</template>

<script setup>
const props = defineProps({
  restaurant: { type: Object, default: () => ({}) },
  locale: { type: String, default: "ar" },
  isOpen: { type: Boolean, default: true },
  isBioHubAllowed: { type: Boolean, default: false },
});

const emit = defineEmits(["openBioHub"]);
const isFabOpen = ref(false);
const { setLocale } = useI18n();

const { totalPrice, cartCount, setCart, startEditingOrder } = useCart();
const { history, loadHistory } = useOrderHistory();
const { $toast } = useNuxtApp();
const showCart = ref(false);
const showHistory = ref(false);
const { locale } = useI18n();

const handleEditFromHistory = (order) => {
  if (order?.items?.length) {
    startEditingOrder(order);
    showHistory.value = false;
    showCart.value = true;
    if ($toast?.success) {
      $toast.success(
        locale.value === "ar"
          ? `تعديل الطلب #${order.id}`
          : `Editing order #${order.id}`
      );
    }
  }
};

const hasOrders = computed(() => Boolean(history.value && history.value.length > 0));
const isFabVisible = computed(() => Boolean(props.isBioHubAllowed || hasOrders.value));

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
