<template>
  <header
    class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 transition-all duration-300 h-20"
  >
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-center items-center">
      <!-- Brand Logo -->
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm"
        >
          <img
            v-if="restaurant.logo"
            :src="restaurant.logo"
            class="w-full h-full object-cover"
            :alt="restaurant.business_name"
          />
          <span v-else class="text-2xl">🍽️</span>
        </div>
        <div class="space-y-0.5">
          <span
            class="text-orange-600/60 text-[10px] font-black tracking-widest uppercase block"
          >
            {{ $t("welcome") }}
          </span>
          <h1 class="text-xl md:text-2xl font-black text-gray-900 leading-none">
            {{ getLocaleTxt(restaurant, "business_name") }}
          </h1>
        </div>
      </div>
    </div>
  </header>

  <!-- Cart Modal -->
  <CartModal
    :isOpen="showCart"
    :whatsappNumber="restaurant.whatsapp_number || ''"
    @close="showCart = false"
  />
</template>

<script setup>
defineProps(["restaurant", "locale"]);
const { setLocale } = useI18n();

const { totalPrice, cartCount } = useCart();
const showCart = ref(false);
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
</script>
