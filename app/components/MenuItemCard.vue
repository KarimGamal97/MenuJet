<!-- app/components/MenuItemCard.vue -->
<template>
  <div
    class="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300 h-auto"
  >
    <div class="h-32 w-full bg-gray-200 relative">
      <img
        v-if="item.image"
        :src="item.image"
        class="w-full h-full object-cover"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-gray-400 font-black text-xs"
      >
        MenuJet
      </div>
      <div
        class="absolute bottom-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-2xl font-black shadow-lg"
      >
        {{ item.price }}
        <small class="text-[10px] opacity-80">{{ $t("currency") }}</small>
      </div>
    </div>
    <div class="p-6 text-center">
      <h3 class="font-black text-xl text-gray-800 mb-2">
        {{ getLocaleTxt(item, "name") }}
      </h3>
      <p class="text-gray-400 text-sm opacity-80">
        {{ getLocaleTxt(item, "description") || $t("no_description") }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps(["item"]);
const { locale } = useI18n();

const getLocaleTxt = (item, field) =>
  item[`${field}_${locale.value}`] || item[`${field}_ar`] || item[field] || "";
</script>
