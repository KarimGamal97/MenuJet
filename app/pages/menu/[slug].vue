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
        class="sticky top-20 z-40 backdrop-blur-md border-b border-gray-100 flex py-3 shadow-sm"
        :style="{ backgroundColor: primaryColor }"
      >
        <div
          class="flex flex-col md:flex-row items-center gap-3 px-4 mx-auto max-w-3xl w-full"
        >
          <!-- Search Input -->
          <div class="relative w-full md:w-64 lg:w-80 shrink-0">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('admin.search_placeholder')"
              class="w-full py-3 pr-10 pl-4 bg-gray-50 border-none rounded-2xl outline-none transition-all text-sm font-bold shadow-sm"
            />
            <div
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <BaseIcon name="search" class="w-4 h-4" />
            </div>
          </div>

          <!-- Categories List -->
          <div class="flex-1 min-w-0 w-full">
            <div class="flex gap-2 overflow-x-auto no-scrollbar py-1 w-full">
              <button
                v-for="cat in categories"
                :key="cat"
                @click="activeCategory = cat"
                :style="activeCategory === cat ? { backgroundColor: 'white', color: primaryColor } : { backgroundColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }"
                :class="[
                  'px-7 py-2.5 rounded-2xl font-bold whitespace-nowrap text-sm transition-all duration-300 shrink-0 flex items-center gap-2 tracking-wide',
                  activeCategory === cat
                    ? 'shadow-2xl -translate-y-0.5 scale-105'
                    : 'backdrop-blur-sm active:scale-95',
                ]"
              >
                <BaseIcon 
                  v-if="activeCategory === cat" 
                  name="check" 
                  class="w-4 h-4 animate-in zoom-in spin-in-12 duration-300" 
                  :style="{ color: primaryColor }"
                />
                {{ cat }}
              </button>
            </div>
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

      <!-- Floating Cart Bar (Only when shop is actually open) -->
      <FloatingCartBar
        v-if="isActuallyOpen"
        :whatsappNumber="restaurant.whatsapp_number"
        @openCart="showCart = true"
      />

      <!-- Item Detail Modal -->
      <ItemDetailModal
        :isOpen="showItemModal"
        :item="selectedItem"
        :isClosed="!isActuallyOpen"
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
        :whatsappOrderingEnabled="restaurant.whatsapp_ordering_enabled !== false"
        :phoneNumberEnabled="restaurant.show_phone_number !== false"
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
      .select("*")
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

// isShopOpen: Controls the overlay visibility only
const isShopOpen = computed(() => isActuallyOpen.value || isShopOpenOverride.value);

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

const isInitialLoading = ref(true);

const categories = computed(() => {
  return restaurant.value?.categories || [];
});

watch(
  () => restaurant.value?.categories,
  (newCats) => {
    if (newCats && newCats.length > 0) {
      if (!activeCategory.value || !newCats.includes(activeCategory.value)) {
        activeCategory.value = newCats[0];
      }
      // Data is ready and category is set
      setTimeout(() => {
        isInitialLoading.value = false;
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
    const q = searchQuery.value.toLowerCase();
    return items.filter((i) => 
      (i.name || "").toLowerCase().includes(q) || 
      (i.description || "").toLowerCase().includes(q)
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
</style>
