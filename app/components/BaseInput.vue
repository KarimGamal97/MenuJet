<template>
  <div class="w-full">
    <div class="relative group">
      <!-- Floating Label -->
      <label
        v-if="label"
        class="absolute -top-2 right-3 bg-white px-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 group-focus-within:text-orange-500 transition-colors z-10 pointer-events-none"
      >
        {{ label }}
      </label>

      <!-- Left Icon (Optional) -->
      <div
        v-if="icon"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors pointer-events-none"
      >
        <BaseIcon :name="icon" class="w-5 h-5" />
      </div>

      <input
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full p-4 bg-white border-2 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold text-gray-800 text-sm',
          label
            ? 'border-gray-200'
            : 'bg-gray-50 border-transparent focus:bg-white shadow-sm',
          icon ? 'pr-12' : 'pr-4',
          type === 'password' ? 'pl-12' : 'pl-4',
          error ? 'border-red-400' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        v-bind="$attrs"
      />

      <!-- Password Toggle Icon -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10 focus:outline-none"
        @click="showPassword = !showPassword"
      >
        <BaseIcon :name="showPassword ? 'eye-off' : 'eye'" class="w-5 h-5" />
      </button>
    </div>

    <!-- Error Message -->
    <p
      v-if="error"
      class="text-[10px] text-red-500 mt-1 px-1 font-bold animate-in fade-in slide-in-from-top-1 duration-200"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  type: { type: String, default: "text" },
  icon: String,
  error: String,
  disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const showPassword = ref(false);
const inputType = computed(() => {
  if (props.type === "password") {
    return showPassword.value ? "text" : "password";
  }
  return props.type;
});
</script>
