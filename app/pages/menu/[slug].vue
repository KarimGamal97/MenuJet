<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col max-w-full overflow-x-hidden"
    :style="{ '--p-color': primaryColor }"
    dir="rtl"
  >
    <template v-if="pending">
      <MenuSkeleton />
    </template>

    <template v-else-if="restaurant">
      <MenuHeader :restaurant="restaurant" :locale="locale" :isOpen="isActuallyOpen" />
      
      <!-- Closed Overlay -->
      <div v-if="!isShopOpen" class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div class="bg-white p-8 rounded-[3rem] shadow-2xl max-w-xs w-full border-4 border-orange-500 animate-in zoom-in duration-300">
          <div class="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <BaseIcon name="clock" class="w-8 h-8 text-orange-600" />
          </div>
          <h3 class="text-xl font-black text-gray-800 mb-2">{{ $t('admin.status_closed') }}</h3>
          <p class="text-[11px] text-gray-500 font-bold mb-6 leading-relaxed px-2">
            {{ closedMessage }}
            <span v-if="restaurant.automated_hours_enabled" class="block mt-2 text-orange-600 dir-ltr text-lg">
              {{ formatTime12h(restaurant.opening_time || '09:00') }} - {{ formatTime12h(restaurant.closing_time || '23:00') }}
            </span>
          </p>
          <button 
            @click="isShopOpenOverride = true" 
            class="w-full py-3.5 px-4 text-white rounded-[1.5rem] font-bold text-sm transition-all shadow-lg active:scale-95"
            :style="{ backgroundColor: primaryColor }"
          >
            تصفح المنيو فقط
          </button>
        </div>
      </div>
      
      <nav
        class="sticky top-20 z-40 backdrop-blur-md border-b border-white/10 flex flex-col py-3 shadow-md transition-all duration-300"
        :style="{ backgroundColor: primaryColor }"
      >
        <div class="max-w-3xl mx-auto w-full px-4 flex flex-col gap-3">
          <!-- Search Input -->
          <div class="relative w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-white/20">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full py-3 pr-11 pl-4 bg-transparent border-none rounded-2xl outline-none transition-all text-sm font-bold relative z-10 text-gray-800"
            />

            <!-- Animated Placeholder: static prefix + dynamic sliding product name -->
            <div
              v-if="!searchQuery"
              class="absolute inset-y-0 right-11 left-4 flex items-center gap-1.5 pointer-events-none overflow-hidden z-0"
            >
              <span class="text-sm font-bold text-gray-400 shrink-0 select-none">
                {{ locale === 'ar' ? 'ابحث عن' : 'Search for' }}
              </span>
              <div class="relative overflow-hidden h-full flex items-center flex-1">
                <Transition name="placeholder-slide" mode="out-in">
                  <span
                    :key="dynamicSearchPlaceholder"
                    class="text-sm font-bold text-gray-400 truncate block select-none"
                  >
                    {{ dynamicSearchPlaceholder }}
                  </span>
                </Transition>
              </div>
            </div>

            <div
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
            >
              <BaseIcon name="search" class="w-4 h-4" />
            </div>
          </div>

          <!-- Categories List with arrows outside the scroll container -->
          <div class="flex items-center gap-1.5 w-full">
            <!-- Scroll Arrow Right (In RTL: scroll back towards right) -->
            <button
              v-if="hasScrollOverflow"
              type="button"
              @click="scrollCategories('right')"
              :disabled="!canScrollRight"
              :class="[
                'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all border border-white/20',
                canScrollRight
                  ? 'bg-white/30 text-white hover:bg-white hover:text-gray-800 shadow-sm active:scale-90 cursor-pointer'
                  : 'bg-white/10 text-white/30 cursor-not-allowed opacity-40'
              ]"
              aria-label="Scroll right"
            >
              <BaseIcon name="chevron-right" class="w-3.5 h-3.5" />
            </button>

            <!-- Categories Horizontal Container -->
            <div
              ref="categoriesContainer"
              @scroll="checkCategoryScroll"
              class="flex-1 min-w-0 flex gap-2 overflow-x-auto custom-scrollbar-thin py-1.5 scroll-smooth select-none px-0.5"
            >
              <button
                v-for="cat in categories"
                :key="cat"
                @click="selectCategory(cat, $event)"
                :style="activeCategory === cat ? { backgroundColor: 'white', color: primaryColor } : { backgroundColor: 'rgba(255,255,255,0.22)', color: 'white' }"
                :class="[
                  'px-5 py-2 rounded-2xl font-black whitespace-nowrap text-xs sm:text-sm transition-all duration-300 shrink-0 flex items-center gap-2 border border-white/20 active:scale-95 cursor-pointer',
                  activeCategory === cat
                    ? 'shadow-lg shadow-black/10 -translate-y-0.5'
                    : 'hover:bg-white/30 backdrop-blur-sm',
                ]"
              >
                <BaseIcon 
                  v-if="activeCategory === cat" 
                  name="check" 
                  class="w-3.5 h-3.5 animate-in zoom-in duration-200" 
                  :style="{ color: primaryColor }"
                />
                {{ cat }}
              </button>
            </div>

            <!-- Scroll Arrow Left (In RTL: scroll forward towards left) -->
            <button
              v-if="hasScrollOverflow"
              type="button"
              @click="scrollCategories('left')"
              :disabled="!canScrollLeft"
              :class="[
                'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all border border-white/20',
                canScrollLeft
                  ? 'bg-white/30 text-white hover:bg-white hover:text-gray-800 shadow-sm active:scale-90 cursor-pointer'
                  : 'bg-white/10 text-white/30 cursor-not-allowed opacity-40'
              ]"
              aria-label="Scroll left"
            >
              <BaseIcon name="chevron-left" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      <main class="flex-grow max-w-3xl mx-auto w-full p-4 lg:p-6">
        <!-- 1. Skeleton Loading (While fetching or calculating initial category) -->
        <div v-if="pending || isInitialLoading" class="flex flex-col gap-3">
          <div v-for="i in 6" :key="i" class="bg-white p-4 rounded-[2rem] border border-gray-50 flex items-center gap-4 animate-pulse">
            <div class="w-20 h-20 rounded-2xl bg-gray-100 flex-shrink-0"></div>
            <div class="flex-grow space-y-3">
              <div class="w-2/3 h-5 bg-gray-100 rounded-lg"></div>
              <div class="w-1/2 h-3 bg-gray-50 rounded-lg"></div>
              <div class="w-1/4 h-6 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>

        <!-- 2. Items List -->
        <div 
          v-else-if="filteredItems.length > 0"
          class="flex flex-col gap-3"
          :class="cartCount > 0 ? 'pb-40' : 'pb-16'"
        >
          <MenuItemCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            :allowOrdering="canOrder"
            @select="openItemModal"
          />
        </div>

        <!-- 3. No Results -->
        <div v-else class="text-center py-5">
          <div class="mb-4 flex justify-center">
            <BaseIcon name="boxes" class="w-16 h-16 opacity-20" />
          </div>
          <p class="text-gray-400 text-lg font-bold">
            {{ $t("menu.no_items") }}
          </p>
        </div>
      </main>

      <!-- Floating Cart Bar (Only when ordering is active) -->
      <FloatingCartBar
        v-if="canOrder"
        :whatsappNumber="restaurant.whatsapp_number"
        @openCart="showCart = true"
      />

      <!-- Item Detail Modal -->
      <ItemDetailModal
        :isOpen="showItemModal"
        :item="selectedItem"
        :isClosed="!isActuallyOpen"
        :allowOrdering="canOrder"
        @close="showItemModal = false"
      />

      <CartModal
        v-if="restaurant && restaurant.user_id"
        :isOpen="showCart"
        :whatsappNumber="restaurant.whatsapp_number"
        :restaurantUserId="restaurant.user_id"
        :deliveryAreas="restaurant.delivery_areas"
        :tableNumberEnabled="restaurant.show_table_number === true"
        :queueNumberEnabled="restaurant.show_queue_number === true"
        :whatsappOrderingEnabled="isWhatsappOrderingAllowed"
        :phoneNumberEnabled="restaurant.show_phone_number !== false"
        :paymentMethodsAllowed="isElectronicPaymentAllowed ? (restaurant.payment_methods_allowed || 'all') : 'none'"
        :vodafoneCashNumber="restaurant.vodafone_cash_number || ''"
        :instapayAccount="restaurant.instapay_account || ''"
        @close="showCart = false"
      />

      <MenuFooter
        v-if="restaurant.whatsapp_number && cartCount === 0"
        :whatsappNumber="restaurant.whatsapp_number"
      />
    </template>

    <!-- 3. Error or Not Found -->
    <template v-else>
      <div
        class="flex-grow flex flex-col items-center justify-center p-6 text-center"
      >
        <div class="mb-6">
          <BaseIcon name="not-found" class="w-24 h-24 text-gray-200" />
        </div>
        <h2 class="text-2xl font-black text-orange-600">{{ $t('menu.restaurant_not_found') }}</h2>
        <p class="text-gray-400 mt-3 max-w-[280px] mx-auto leading-relaxed">
          {{ $t('menu.restaurant_not_found_desc') }}
        </p>
      </div>
    </template>
  </div>
</template>

<script setup>
const { locale } = useI18n();
const route = useRoute();
const client = useSupabaseClient();
const { cartCount } = useCart();
const showCart = ref(false);
const showItemModal = ref(false);
const selectedItem = ref({});

const {
  data: restaurant,
  error,
  pending,
} = useAsyncData(
  `menu-${route.params.slug}`,
  async () => {
    const { data: profile, error: pError } = await client
      .from("profiles")
      .select("*, plans(*)")
      .eq("slug", route.params.slug)
      .single();

    if (pError) throw pError;

    const { data: items } = await client
      .from("menu_items")
      .select("*")
      .eq("user_id", profile.user_id);

    return { ...profile, menu_items: items || [] };
  },
  { lazy: true },
);

const primaryColor = computed(
  () => restaurant.value?.primary_color || "#ea580c",
);

const isShopOpenOverride = ref(false);
const currentTimeStr = ref("");

onMounted(() => {
  const updateTime = () => {
    const now = new Date();
    currentTimeStr.value =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");
  };
  updateTime();
  setInterval(updateTime, 60000); // Update every minute
});

// isActuallyOpen: Real status (ignores browse-only override)
const isActuallyOpen = computed(() => {
  if (!restaurant.value) return true;

  // 1. If manual toggle is ON, it's ALWAYS OPEN (overrides everything)
  if (restaurant.value.is_active === true) return true;

  // 2. If manual toggle is OFF, check automated hours
  if (restaurant.value.automated_hours_enabled) {
    if (!currentTimeStr.value) return true; // Wait for client hydration

    const parseTime = (timeStr) => {
      if (!timeStr) return "00:00";
      let [time, modifier] = timeStr.trim().split(" ");
      let [hours, minutes] = time.split(":");
      hours = parseInt(hours, 10) || 0;
      if (modifier && modifier.toUpperCase() === "PM" && hours < 12) hours += 12;
      if (modifier && modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, "0")}:${minutes || "00"}`;
    };

    const currentStr = currentTimeStr.value;
    const start = parseTime(restaurant.value.opening_time || "09:00");
    const end = parseTime(restaurant.value.closing_time || "23:00");
    if (start <= end) {
      return currentStr >= start && currentStr <= end;
    } else {
      return currentStr >= start || currentStr <= end;
    }
  }

  // 3. If both are OFF, then it's closed
  return false;
});

// Ordering enabled toggle from restaurant settings
const isWhatsappOrderingAllowed = computed(() => {
  if (!restaurant.value) return false;
  const p = restaurant.value;
  const planId = p.plan?.id || p.plans?.id || p.plan_id || p.plan_type || "free";
  const allowsWhatsapp = p.plans?.allow_whatsapp_orders ?? p.plan?.allow_whatsapp_orders ?? (planId === "pro");
  return Boolean(allowsWhatsapp) && p.whatsapp_ordering_enabled !== false;
});

// Electronic payments allowed only for Pro plan
const isElectronicPaymentAllowed = computed(() => {
  if (!restaurant.value) return false;
  const p = restaurant.value;
  const planId = p.plan?.id || p.plans?.id || p.plan_id || p.plan_type || "free";
  return planId === "pro";
});

const isOrderingEnabled = computed(() => {
  return restaurant.value?.whatsapp_ordering_enabled !== false;
});

// canOrder: true only when restaurant is open AND ordering is enabled
const canOrder = computed(() => {
  return isActuallyOpen.value && isOrderingEnabled.value;
});

// isShopOpen: Controls the overlay visibility only (in browse-only mode, menu is always viewable)
const isShopOpen = computed(() => {
  if (!isOrderingEnabled.value) return true;
  return isActuallyOpen.value || isShopOpenOverride.value;
});

const closedMessage = computed(() => {
  if (!restaurant.value) return "";
  if (!restaurant.value.automated_hours_enabled) {
    return "المطعم مغلق حالياً. يرجى العودة لاحقاً.";
  }
  return "عذراً، المطعم مغلق حالياً. يرجى محاولة الطلب في مواعيد العمل:";
});

const formatTime12h = (timeStr) => {
  if (!timeStr) return "";
  let [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "م" : "ص";
  hours = hours % 12 || 12; 
  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const openItemModal = (item) => {
  selectedItem.value = item;
  showItemModal.value = true;
};

const activeCategory = ref("");
const searchQuery = ref("");

// Arabic text normalizer (e.g. قهوة === قهوه, أ/إ/آ -> ا, remove diacritics/tatweel)
const normalizeArabic = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u065F\u0670]/g, "") // remove tashkeel
    .replace(/\u0640/g, "") // remove tatweel
    .replace(/[أإآٱ]/g, "ا") // normalize alef
    .replace(/ة/g, "ه") // normalize taa marbuta
    .replace(/[ىئ]/g, "ي") // normalize yaa
    .replace(/\s+/g, " "); // collapse multiple spaces
};

// Dynamic Rotating Search Placeholder (Max 5 items from current menu)
const sampleProductNames = computed(() => {
  const items = restaurant.value?.menu_items || [];
  const names = items
    .filter((i) => i.name && i.available !== false)
    .map((i) => i.name.trim());
  return [...new Set(names)].slice(0, 5);
});

const placeholderIndex = ref(0);
let placeholderTimer = null;

onMounted(() => {
  placeholderTimer = setInterval(() => {
    if (sampleProductNames.value.length > 0) {
      placeholderIndex.value =
        (placeholderIndex.value + 1) % sampleProductNames.value.length;
    }
  }, 3600);

  if (process.client) {
    nextTick(() => {
      checkCategoryScroll();
    });
    window.addEventListener("resize", checkCategoryScroll);
  }
});

onUnmounted(() => {
  if (placeholderTimer) clearInterval(placeholderTimer);
  if (process.client) {
    window.removeEventListener("resize", checkCategoryScroll);
  }
});

const dynamicSearchPlaceholder = computed(() => {
  if (sampleProductNames.value.length > 0) {
    return sampleProductNames.value[placeholderIndex.value];
  }
  return locale.value === "ar" ? "وجبة أو مشروب" : "item";
});

const isInitialLoading = ref(true);

const categories = computed(() => {
  return restaurant.value?.categories || [];
});

const categoriesContainer = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const hasScrollOverflow = ref(false);

const checkCategoryScroll = () => {
  const el = categoriesContainer.value;
  if (!el) return;
  const maxScroll = el.scrollWidth - el.clientWidth;
  if (maxScroll <= 5) {
    hasScrollOverflow.value = false;
    canScrollLeft.value = false;
    canScrollRight.value = false;
    return;
  }
  hasScrollOverflow.value = true;
  const current = Math.abs(el.scrollLeft);
  canScrollLeft.value = current < maxScroll - 8;
  canScrollRight.value = current > 8;
};

const scrollCategories = (direction) => {
  const el = categoriesContainer.value;
  if (!el) return;
  const amount = direction === 'left' ? -220 : 220;
  el.scrollBy({ left: amount, behavior: 'smooth' });
  setTimeout(checkCategoryScroll, 350);
};

const selectCategory = (cat, event) => {
  activeCategory.value = cat;
  if (event?.currentTarget) {
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }
  setTimeout(checkCategoryScroll, 350);
};

watch(
  () => restaurant.value?.categories,
  (newCats) => {
    if (newCats && newCats.length > 0) {
      if (!activeCategory.value || !newCats.includes(activeCategory.value)) {
        activeCategory.value = newCats[0];
      }
      setTimeout(() => {
        isInitialLoading.value = false;
        checkCategoryScroll();
      }, 100);
    }
  },
  { immediate: true },
);

// If restaurant finishes loading but categories aren't set yet, keep loading
watch(pending, (isPending) => {
  if (!isPending && (!restaurant.value || !activeCategory.value)) {
    // wait for the categories watch to fire
  } else if (!isPending) {
    // done
  }
});

const filteredItems = computed(() => {
  // If we are still initializing or have no items, show nothing (trigger skeleton)
  if (isInitialLoading.value || !restaurant.value?.menu_items || (categories.value.length > 0 && !activeCategory.value)) {
    return [];
  }

  let items = restaurant.value.menu_items.filter(
    (i) => i.available !== false,
  );

  if (searchQuery.value) {
    const q = normalizeArabic(searchQuery.value);
    return items.filter((i) => 
      normalizeArabic(i.name).includes(q) || 
      normalizeArabic(i.description).includes(q)
    );
  }

  if (activeCategory.value) {
    return items.filter(
      (i) => i.category === activeCategory.value
    );
  }

  return items;
});
</script>

<style scoped>
/* The Ultimate Brand Override */
:deep(.bg-orange-600), :deep(.bg-orange-500) { background-color: var(--p-color) !important; }
:deep(.text-orange-600), :deep(.text-orange-500) { color: var(--p-color) !important; }
:deep(.border-orange-600), :deep(.border-orange-500) { border-color: var(--p-color) !important; }
:deep(.ring-orange-600), :deep(.ring-orange-500) { --tw-ring-color: var(--p-color) !important; }

/* Light variations using color-mix */
:deep(.bg-orange-50) { background-color: color-mix(in srgb, var(--p-color), transparent 92%) !important; }
:deep(.bg-orange-100) { background-color: color-mix(in srgb, var(--p-color), transparent 85%) !important; }
:deep(.text-orange-100) { color: color-mix(in srgb, var(--p-color), white 80%) !important; }
:deep(.bg-orange-900\/30) { background-color: color-mix(in srgb, var(--p-color), black 70%) !important; }

/* Animated slide up placeholder (from bottom to top) */
.placeholder-slide-enter-active,
.placeholder-slide-leave-active {
  transition: all 0.55s cubic-bezier(0.25, 1, 0.5, 1);
}

.placeholder-slide-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.placeholder-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* Custom Thin Horizontal Scrollbar */
.custom-scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar-thin::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
}
.custom-scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.55);
  border-radius: 9999px;
}
.custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.85);
}
</style>
