<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div
        class="absolute inset-0 z-[201]"
        @click="emit('close')"
      />
      
      <div
        class="bg-white w-full rounded-3xl shadow-2xl relative z-[202] overflow-hidden animate-in zoom-in-95 duration-200"
        :class="maxWidth"
      >
        <!-- Header -->
        <div class="px-8 pt-8 pb-4 flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 line-clamp-1">
              {{ title }}
            </h3>
            <p v-if="subtitle" class="text-xs text-gray-400 font-bold mt-1 line-clamp-2">
              {{ subtitle }}
            </p>
          </div>
          <button
            @click="emit('close')"
            class="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all font-bold text-lg"
          >
            <BaseIcon name="close" class="w-5 h-5" />
          </button>
        </div>

        <!-- Body Content -->
        <div class="px-8 py-4 max-h-[70vh] overflow-y-auto no-scrollbar">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="px-8 py-6 border-t border-gray-50 bg-gray-50/30">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
  maxWidth: { type: String, default: 'max-w-md' }
});

const emit = defineEmits(['close']);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
