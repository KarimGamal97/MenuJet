<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col max-w-full overflow-x-hidden"
    dir="rtl"
  >
    <template v-if="pending">
      <MenuSkeleton />
    </template>

    <template v-else-if="restaurant">
      <MenuHeader :restaurant="restaurant" :locale="locale" />

      <nav
        class="sticky top-20 z-40 bg-orange-600 backdrop-blur-md border-b border-gray-100 flex py-3 shadow-sm"
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
              class="w-full py-3 pr-10 pl-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm font-bold shadow-sm"
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
                :class="[
                  'px-7 py-2.5 rounded-2xl font-bold whitespace-nowrap text-sm transition-all duration-300 shrink-0 flex items-center gap-2 tracking-wide',
                  activeCategory === cat
                    ? 'bg-white text-orange-600 shadow-2xl shadow-orange-900/30 -translate-y-0.5 scale-105'
                    : 'bg-white/20 text-white/80 hover:bg-white/30 backdrop-blur-sm active:scale-95',
                ]"
              >
                <BaseIcon 
                  v-if="activeCategory === cat" 
                  name="check" 
                  class="w-4 h-4 text-orange-600 animate-in zoom-in spin-in-12 duration-300" 
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

      <!-- Floating Cart Bar (Appears when cart is not empty) -->
      <FloatingCartBar
        :whatsappNumber="restaurant.whatsapp_number"
        @openCart="showCart = true"
      />

      <!-- Item Detail Modal -->
      <ItemDetailModal
        :isOpen="showItemModal"
        :item="selectedItem"
        @close="showItemModal = false"
      />

      <CartModal
        v-if="restaurant && restaurant.user_id"
        :isOpen="showCart"
        :whatsappNumber="restaurant.whatsapp_number"
        :restaurantUserId="restaurant.user_id"
        :deliveryAreas="restaurant.delivery_areas"
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

const openItemModal = (item) => {
  selectedItem.value = item;
  showItemModal.value = true;
};

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
