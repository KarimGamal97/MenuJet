<template>
  <div class="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
    <template v-if="pending">
      <MenuSkeleton />
    </template>

    <template v-else-if="restaurant">
      <MenuHeader :restaurant="restaurant" :locale="locale" />

      <nav
        class="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 flex py-3 shadow-sm"
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
          <div class="flex gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="activeCategory = cat"
              :class="[
                'px-6 py-2.5 rounded-2xl font-bold whitespace-nowrap text-sm transition-all duration-300 shrink-0',
                activeCategory === cat
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-100'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100',
              ]"
            >
              {{ cat === "all" ? "الكل" : cat }}
            </button>
          </div>
        </div>
      </nav>

      <main class="flex-grow max-w-3xl mx-auto w-full p-4 lg:p-6">
        <div
          v-if="filteredItems.length > 0"
          class="flex flex-col gap-3"
          :class="cartCount > 0 ? 'pb-36' : 'pb-10'"
        >
          <MenuItemCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
          />
        </div>
        <div
          v-else
          class="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-100"
        >
          <div class="mb-4 flex justify-center">
            <BaseIcon name="boxes" class="w-16 h-16 opacity-20" />
          </div>
          <p class="text-gray-400 text-lg font-bold">
            {{ $t("menu.no_items") || "لا توجد وجبات في هذا القسم حالياً" }}
          </p>
        </div>
      </main>

      <!-- Floating Cart Bar (Appears when cart is not empty) -->
      <FloatingCartBar
        :whatsappNumber="restaurant.whatsapp_number"
        @openCart="showCart = true"
      />

      <CartModal
        :isOpen="showCart"
        :whatsappNumber="restaurant.whatsapp_number"
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
        <h2 class="text-2xl font-black text-orange-600">المطعم غير موجود</h2>
        <p class="text-gray-400 mt-3 max-w-[280px] mx-auto leading-relaxed">
          عذراً، لم نتمكن من العثور على منيو بهذا الاسم. يرجى التأكد من مسح كود
          QR الصحيح للمطعم.
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

const activeCategory = ref("all");
const searchQuery = ref("");

const categories = computed(() => {
  const profileCats = restaurant.value?.categories?.length
    ? restaurant.value.categories
    : ["Main", "Drinks", "Dessert"];

  return ["all", ...profileCats];
});

const filteredItems = computed(() => {
  let items = (restaurant.value?.menu_items || []).filter(
    (i) => i.available !== false,
  );

  // Filter by category
  if (activeCategory.value !== "all") {
    items = items.filter((i) => i.category === activeCategory.value);
  }

  // Search filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    items = items.filter((i) => (i.name || "").toLowerCase().includes(q));
  }

  return items;
});
</script>
