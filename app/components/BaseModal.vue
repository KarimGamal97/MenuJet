<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div class="absolute inset-0 z-[201]" @click="emit('close')" />

      <div
        class="bg-white w-full rounded-3xl shadow-2xl relative z-[202] overflow-hidden animate-in zoom-in-95 duration-200"
        :class="maxWidth"
      >
        <!-- Header -->
        <div
          class="px-8 pt-8 pb-4 flex flex-col items-center text-center relative"
        >
          <!-- Close Button -->
          <button
            v-if="showClose"
            @click="emit('close')"
            class="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all font-bold"
          >
            <BaseIcon name="close" class="w-4 h-4" />
          </button>

          <!-- Top Icon (Optional) -->
          <div v-if="icon" class="mb-6 flex justify-center">
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center"
              :class="iconColor || 'bg-gray-50 text-gray-400'"
            >
              <BaseIcon :name="icon" class="w-8 h-8" />
            </div>
          </div>

          <h3
            v-if="title"
            class="text-xl font-black text-gray-900 line-clamp-1"
          >
            {{ title }}
          </h3>
          <p
            v-if="subtitle"
            class="text-gray-500 text-sm mt-2 text-center leading-relaxed"
          >
            {{ subtitle }}
          </p>
        </div>

        <!-- Body Content -->
        <div class="px-8 max-h-[70vh] overflow-y-auto no-scrollbar">
          <slot />
        </div>

        <!-- Footer -->
        <div
          v-if="$slots.footer"
          class="px-8 py-6 border-t border-gray-50 bg-gray-50/30"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: "" },
  subtitle: { type: String, default: null },
  icon: { type: String, default: null },
  iconColor: { type: String, default: null },
  showClose: { type: Boolean, default: true },
  maxWidth: { type: String, default: "max-w-md" },
});

const emit = defineEmits(["close"]);
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
