<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
    <template v-if="restaurant">
      <MenuHeader :restaurant="restaurant" :locale="locale" />

      <MenuCategories :categories="categories" v-slot="{ activeCategory }">
        <div class="flex gap-2 overflow-x-auto p-4 bg-white shadow-sm">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            :class="[
              'px-6 py-2 rounded-full font-bold whitespace-nowrap',
              activeCategory === cat
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-600',
            ]"
          >
            {{ cat === "all" ? "الكل" : cat }}
          </button>
        </div>
      </MenuCategories>

      <main class="flex-grow max-w-7xl mx-auto w-full p-6">
        <div
          v-if="filteredItems.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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

      <MenuFooter
        v-if="restaurant.whatsapp_number"
        :whatsappNumber="restaurant.whatsapp_number"
      />
    </template>

    <template v-else>
      <div
        class="flex-grow flex flex-col items-center justify-center p-6 text-center"
      >
        <h1 class="text-6xl mb-4">🔍</h1>
        <h2 class="text-2xl font-black text-gray-800">المطعم غير موجود</h2>
        <p class="text-gray-500 mt-2">تأكد من الرابط الصحيح للمنيو</p>
        <NuxtLink
          to="/"
          class="mt-6 bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold"
          >العودة للرئيسية</NuxtLink
        >
      </div>
    </template>
  </div>
</template>

<script setup>
// المكونات بيتم استيرادها تلقائياً في Nuxt 3 لو موجودة في folder components
const { locale } = useI18n();
const route = useRoute();
const client = useSupabaseClient();

// 1. جلب بيانات المطعم مع الوجبات المرتبطة به
const { data: restaurant, error } = await useAsyncData(
  `menu-${route.params.slug}`,
  async () => {
    // جلب البروفايل أولاً بناءً على الـ slug
    const { data: profile, error: pError } = await client
      .from("profiles")
      .select("*")
      .eq("slug", route.params.slug)
      .single();

    if (pError) throw pError;

    // جلب الوجبات اللي ليها نفس الـ user_id بتاع صاحب المطعم
    const { data: items } = await client
      .from("menu_items")
      .select("*")
      .eq("user_id", profile.user_id); // الربط هنا بالـ user_id

    return { ...profile, menu_items: items || [] };
  },
);

const activeCategory = ref("all");

// 2. استخراج التصنيفات من الوجبات المتاحة
const categories = computed(() => {
  const items = restaurant.value?.menu_items || [];
  const cats = items.map((i) => i.category).filter(Boolean);
  return ["all", ...new Set(cats)];
});

// 3. فلترة الوجبات
const filteredItems = computed(() => {
  const items = restaurant.value?.menu_items || [];
  if (activeCategory.value === "all") return items;
  return items.filter((i) => i.category === activeCategory.value);
});
</script>
