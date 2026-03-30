<template>
  <header
    class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 transition-all duration-300"
  >
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
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

      <!-- Cart Button -->
      <button
        @click="showCart = true"
        class="flex items-center gap-3 bg-orange-50 px-4 py-2.5 rounded-2xl border border-orange-100 shadow-sm transition-all hover:shadow-md hover:bg-orange-100 active:scale-95"
        :class="cartCount > 0 ? 'opacity-100' : 'opacity-60'"
      >
        <div class="flex flex-col items-end">
          <span
            class="text-[10px] text-orange-400 font-bold uppercase tracking-tighter"
          >
            {{ cartCount > 0 ? $t("total") || "الإجمالي" : "السلة" }}
          </span>
          <span class="text-sm font-black text-orange-600 leading-none">
            {{ cartCount > 0 ? `${totalPrice} ${$t("currency")}` : "فارغة" }}
          </span>
        </div>
        <div
          class="w-8 h-8 bg-orange-600 text-white rounded-xl flex items-center justify-center text-xs font-black shadow-md shadow-orange-200"
        >
          {{ cartCount > 0 ? cartCount : "🛒" }}
        </div>
      </button>
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

const getLocaleTxt = (item, field) =>
  item[`${field}_${useI18n().locale.value}`] ||
  item[`${field}_ar`] ||
  item[field] ||
  "";
</script>
