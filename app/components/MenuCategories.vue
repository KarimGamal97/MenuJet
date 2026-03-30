<script setup>
// بنستقبل الأقسام والكاتيجوري النشطة كـ Props
defineProps({
  categories: {
    type: Array,
    required: true,
  },
  activeCategory: {
    type: String,
    required: true,
  },
});

// بنعرف الـ Emit عشان نبلغ الأب بتغيير القسم
defineEmits(["update:activeCategory"]);
</script>

<template>
  <div class="sticky top-0 z-30 bg-gray-50/80 backdrop-blur-md py-4">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="$emit('update:activeCategory', cat)"
          :class="[
            'px-8 py-3 rounded-2xl font-black transition-all whitespace-nowrap border-2',
            activeCategory === cat
              ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100'
              : 'bg-white border-transparent text-gray-500 hover:bg-orange-50',
          ]"
        >
          {{ cat === "all" ? "الكل" : cat }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
