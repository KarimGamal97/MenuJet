<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
    <template v-if="pending">
      <MenuSkeleton />
    </template>

    <template v-else-if="restaurant">
      <MenuHeader :restaurant="restaurant" :locale="locale" />

      <nav
        class="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 flex py-2 shadow-sm overflow-x-auto no-scrollbar"
      >
        <div class="flex gap-2 px-4 mx-auto w-max md:justify-center">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            :class="[
              'px-6 py-2.5 rounded-2xl font-bold whitespace-nowrap text-sm transition-all duration-300 shrink-0',
              activeCategory === cat
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-100 scale-105'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100',
            ]"
          >
            {{ cat === "all" ? "الكل" : cat }}
          </button>
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
        <div v-else class="text-center py-20">
          <p class="text-gray-400 text-lg font-bold">
            لا توجد وجبات في هذا القسم حالياً 🍴
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
        <h1 class="text-6xl mb-4">🔍</h1>
        <h2 class="text-2xl font-black text-gray-800">المطعم غير موجود</h2>
        <p class="text-gray-500 mt-2">تأكد من الرابط الصحيح للمنيو</p>
        <NuxtLink
          to="/"
          class="mt-6 bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold transition-transform active:scale-95 shadow-lg shadow-orange-100"
          >العودة للرئيسية</NuxtLink
        >
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

const categories = computed(() => {
  const items = (restaurant.value?.menu_items || []).filter(
    (i) => i.available !== false,
  );
  const cats = items.map((i) => i.category).filter(Boolean);
  return ["all", ...new Set(cats)];
});

const filteredItems = computed(() => {
  const items = (restaurant.value?.menu_items || []).filter(
    (i) => i.available !== false,
  );
  if (activeCategory.value === "all") return items;
  return items.filter((i) => i.category === activeCategory.value);
});
</script>
