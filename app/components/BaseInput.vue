<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" class="text-[10px] uppercase tracking-wider font-bold text-gray-400 px-1">
      {{ label }}
    </label>
    
    <div class="relative group">
      <!-- Left Icon (Optional) -->
      <div v-if="icon" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
        <BaseIcon :name="icon" class="w-5 h-5" />
      </div>

      <input
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-800 shadow-sm text-sm',
          icon ? 'pr-12' : 'px-4',
          error ? 'border-red-500 bg-red-50/10' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        ]"
        v-bind="$attrs"
      />
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-[10px] text-red-500 mt-1 px-1 font-bold italic animate-in fade-in slide-in-from-top-1 duration-200">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  type: { type: String, default: "text" },
  icon: String,
  error: String,
  disabled: Boolean
});

const emit = defineEmits(["update:modelValue"]);
</script>
