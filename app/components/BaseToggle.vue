<template>
  <div
    class="flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer select-none"
    :class="locked ? 'hover:bg-amber-50/50' : 'hover:bg-gray-50/50'"
    @click="handleClick"
  >
    <div class="flex items-center gap-2">
      <span class="text-sm font-bold text-gray-700">{{ label }}</span>
      <span
        v-if="locked"
        class="inline-flex items-center gap-1 bg-amber-100/80 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200/80 shadow-xs"
      >
        <span>🔒</span>
        <span>{{ badge || $t("plans.pro_badge_short") }}</span>
      </span>
    </div>
    <button
      type="button"
      :class="[
        'w-12 h-6 flex items-center p-1 rounded-full transition-all duration-300 pointer-events-none',
        locked ? 'bg-gray-200 opacity-60' : modelValue ? 'bg-orange-600' : 'bg-gray-300',
      ]"
    >
      <div
        :class="[
          'w-4 h-4 bg-white rounded-full shadow-sm transform transition-all duration-300',
          !locked && modelValue ? '-translate-x-6' : 'translate-x-0',
        ]"
      ></div>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: true,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  badge: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "lock-click"]);

const handleClick = () => {
  if (props.locked) {
    emit("lock-click");
    return;
  }
  emit("update:modelValue", !props.modelValue);
};
</script>
