<!-- app/components/MenuItemCard.vue -->
<template>
  <div
    class="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-50 flex items-center gap-4 transition-all active:scale-95 group hover:shadow-md relative overflow-hidden"
  >
    <!-- 1. Right side (RTL): Circular Image -->
    <div
      class="w-20 h-20 rounded-full flex-shrink-0 overflow-hidden bg-gray-50 border-2 border-white shadow-sm flex items-center justify-center relative z-10"
    >
      <img
        v-if="item.image"
        :src="item.image"
        class="w-full h-full object-cover transition-transform group-hover:scale-110"
      />
      <span v-else class="text-2xl animate-pulse">🍽️</span>
    </div>

    <!-- 2. Middle: Name & Description -->
    <div class="flex-grow min-w-0 pr-1 flex flex-col justify-center">
      <h3 class="font-bold text-gray-800 text-lg leading-tight truncate">
        {{ getLocaleTxt(item, "name") }}
      </h3>
      <p class="text-gray-400 text-xs mt-1 line-clamp-1 opacity-70">
        {{ getLocaleTxt(item, "description") || $t("no_description") }}
      </p>
      
      <!-- Price (Positioned under name in list view) -->
      <div class="mt-2 flex items-baseline gap-1">
        <span class="text-orange-600 font-black text-lg">{{ item.price }}</span>
        <span class="text-orange-400 text-[10px] font-bold">{{ $t("currency") }}</span>
      </div>
    </div>

    <!-- 3. Left side: Plus Action Button -->
    <button
      @click="addToCart(item)"
      class="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-2xl font-light shadow-sm transition-all hover:bg-orange-600 hover:text-white relative active:scale-90"
    >
      +
    </button>
    
    <!-- Background subtle pattern/decoration -->
    <div class="absolute -right-4 -bottom-4 w-12 h-12 bg-orange-50/30 rounded-full z-0 blur-xl"></div>
  </div>
</template>

<script setup>
const { addToCart } = useCart();
defineProps(["item"]);
const { locale } = useI18n();

const getLocaleTxt = (item, field) =>
  item[`${field}_${locale.value}`] || item[`${field}_ar`] || item[field] || "";
</script>
