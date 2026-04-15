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

      <!-- Password Toggle Icon -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10 focus:outline-none"
        @click="showPassword = !showPassword"
      >
        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>

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
