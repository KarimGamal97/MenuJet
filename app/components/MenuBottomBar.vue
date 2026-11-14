<template>
  <div
    class="fixed inset-x-3 max-w-md mx-auto z-50 select-none pointer-events-auto"
    :style="{ bottom: `${bottomOffset}px` }"
    dir="rtl"
  >
    <div
      class="bg-white/95 backdrop-blur-xl rounded-[2rem] border border-gray-100 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] p-2 flex items-center justify-between gap-1.5 transition-all duration-300"
    >
      <!-- 1. زر طلباتك السابقة -->
      <button
        type="button"
        @click="selectTab('history')"
        :style="{
          color: isTabActive('history') ? primaryColor : undefined,
          backgroundColor: getActiveBg('history'),
        }"
        class="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 relative group"
        :title="$t('history.title')"
      >
        <div class="relative flex items-center justify-center">
          <BaseIcon
            name="history"
            class="w-5 h-5 transition-colors"
            :class="isTabActive('history') ? '' : 'text-gray-500 group-hover:text-gray-700'"
            :style="isTabActive('history') ? { color: primaryColor } : {}"
          />
          <span
            v-if="orderCount > 0"
            class="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center shadow-xs leading-none"
            :style="{ backgroundColor: primaryColor }"
          >
            {{ orderCount }}
          </span>
        </div>
        <span
          class="text-[11px] font-bold mt-1 leading-tight transition-colors"
          :class="isTabActive('history') ? 'font-black' : 'text-gray-600 group-hover:text-gray-900'"
          :style="isTabActive('history') ? { color: primaryColor } : {}"
        >
          {{ $t("history.title") }}
        </span>
      </button>

      <!-- 2. زر طلبك / السلة (في المنتصف، الأيقونة فوق الكلمة) -->
      <button
        type="button"
        @click="selectTab('cart')"
        :style="{
          color: isTabActive('cart') ? primaryColor : undefined,
          backgroundColor: getActiveBg('cart'),
        }"
        class="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 relative group"
        :title="$t('cart.title')"
      >
        <div class="relative flex items-center justify-center">
          <BaseIcon
            name="cart"
            class="w-5 h-5 transition-colors"
            :class="isTabActive('cart') ? '' : 'text-gray-500 group-hover:text-gray-700'"
            :style="isTabActive('cart') ? { color: primaryColor } : {}"
          />
          <span
            v-if="cartCount > 0"
            class="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center shadow-xs leading-none"
            :style="{ backgroundColor: primaryColor }"
          >
            {{ cartCount }}
          </span>
        </div>
        <span
          class="text-[11px] font-bold mt-1 leading-tight transition-colors"
          :class="isTabActive('cart') ? 'font-black' : 'text-gray-600 group-hover:text-gray-900'"
          :style="isTabActive('cart') ? { color: primaryColor } : {}"
        >
          {{ $t("cart.title") }}
        </span>
      </button>

      <!-- 3. زر عن المطعم -->
      <button
        type="button"
        @click="selectTab('info')"
        :style="{
          color: isTabActive('info') ? primaryColor : undefined,
          backgroundColor: getActiveBg('info'),
        }"
        class="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 relative group"
        :title="$t('menu.restaurant_info')"
      >
        <div class="relative flex items-center justify-center">
          <BaseIcon
            name="store"
            class="w-5 h-5 transition-colors"
            :class="isTabActive('info') ? '' : 'text-gray-500 group-hover:text-gray-700'"
            :style="isTabActive('info') ? { color: primaryColor } : {}"
          />
        </div>
        <span
          class="text-[11px] font-bold mt-1 leading-tight transition-colors"
          :class="isTabActive('info') ? 'font-black' : 'text-gray-600 group-hover:text-gray-900'"
          :style="isTabActive('info') ? { color: primaryColor } : {}"
        >
          {{ $t("menu.restaurant_info") }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cartCount: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },
  primaryColor: { type: String, default: "#ea580c" },
  activeTab: { type: String, default: "" },
  canOrder: { type: Boolean, default: true },
});

const emit = defineEmits(["openCart", "openHistory", "openInfo"]);

const localActiveTab = ref(props.activeTab || (props.cartCount > 0 ? "cart" : ""));

watch(
  () => props.activeTab,
  (newVal) => {
    if (newVal !== undefined) {
      localActiveTab.value = newVal;
    }
  }
);

const selectTab = (tab) => {
  localActiveTab.value = tab;
  if (tab === "history") emit("openHistory");
  if (tab === "cart") emit("openCart");
  if (tab === "info") emit("openInfo");
};

const isTabActive = (tab) => {
  if (props.activeTab) return props.activeTab === tab;
  return localActiveTab.value === tab;
};

const getActiveBg = (tab) => {
  if (!isTabActive(tab)) return "transparent";
  const color = props.primaryColor || "#ea580c";
  if (color.startsWith("#") && (color.length === 7 || color.length === 4)) {
    return `${color}18`;
  }
  return "rgba(234, 88, 12, 0.1)";
};

const bottomOffset = ref(12);

const updatePosition = () => {
  if (typeof window === "undefined") return;
  const footer = document.querySelector("footer");
  if (!footer) {
    bottomOffset.value = 12;
    return;
  }
  const rect = footer.getBoundingClientRect();
  const overlap = window.innerHeight - rect.top;
  // If footer is visible in the viewport, keep the bar 16px above the footer
  bottomOffset.value = overlap > 0 ? overlap + 16 : 12;
};

let ticking = false;
const onScrollOrResize = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updatePosition();
      ticking = false;
    });
    ticking = true;
  }
};

onMounted(() => {
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
  nextTick(() => {
    updatePosition();
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScrollOrResize);
  window.removeEventListener("resize", onScrollOrResize);
});
</script>
