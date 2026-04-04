<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 font-bold',
      fullWidth ? 'w-full' : 'w-auto',
      sizeClasses[size],
      variantClasses[variant],
      roundedClasses[rounded],
    ]"
    v-bind="$attrs"
  >
    <div
      v-if="loading"
      :class="[
        'animate-spin border-2 border-current border-t-transparent rounded-full',
        size === 'sm' ? 'w-3 h-3' : 'w-4 h-4',
      ]"
    ></div>

    <template v-else>
      <BaseIcon v-if="icon" :name="icon" :class="iconSizeClasses[size]" />
      <slot />
    </template>
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: "button" },
  variant: { type: String, default: "primary" }, // primary, secondary, danger, ghost, success
  size: { type: String, default: "md" }, // sm, md, lg, xl
  icon: { type: String, default: null },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
  rounded: { type: String, default: "2xl" }, // xl, 2xl, full
});

const sizeClasses = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
  xl: "px-10 py-5 text-lg",
};

const iconSizeClasses = {
  sm: "w-3 h-3",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

const variantClasses = {
  primary:
    "bg-orange-600 text-white shadow-lg shadow-orange-100/50 hover:bg-orange-700",
  secondary: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  danger: "bg-red-600 text-white shadow-lg shadow-red-100/50 hover:bg-red-700",
  success:
    "bg-green-600 text-white shadow-lg shadow-green-100/50 hover:bg-green-700",
  ghost: "bg-transparent text-gray-400 hover:bg-gray-50 hover:text-orange-600",
  outline:
    "bg-white border-2 border-orange-500/10 text-gray-800 hover:border-orange-500 shadow-sm",
};

const roundedClasses = {
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};
</script>
