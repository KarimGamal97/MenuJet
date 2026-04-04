<template>
  <div
    class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl transition-colors hover:bg-gray-100/80 cursor-pointer"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span class="text-sm font-bold text-gray-700">{{ label }}</span>
    <button
      type="button"
      :class="[
        'w-12 h-6 flex items-center p-1 rounded-full transition-all duration-300',
        modelValue ? 'bg-orange-600' : 'bg-gray-300',
      ]"
    >
      <div
        :class="[
          'w-4 h-4 bg-white rounded-full shadow-sm transform transition-all duration-300',
          modelValue ? '-translate-x-6' : 'translate-x-0',
        ]"
      ></div>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>
