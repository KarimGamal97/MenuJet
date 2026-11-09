<template>
  <div
    class="relative bg-white p-4 border-b border-gray-100 flex justify-between items-center rounded-[2rem] transition-all select-none"
    :class="[
      item.available === false && !isAdmin
        ? 'opacity-60 grayscale-[35%] bg-gray-50/80 cursor-not-allowed active:scale-100'
        : 'cursor-pointer active:scale-[0.98]'
    ]"
    @click="handleCardClick"
  >
    <!-- Badge on top left -->
    <span
      v-if="item.badge && (isAdmin || item.available !== false)"
      class="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-tl-[2rem] rounded-br-2xl uppercase tracking-wider shadow-sm z-10 pointer-events-none"
    >
      {{ item.badge }}
    </span>

    <div class="flex items-center gap-4 text-right min-w-0 flex-1">
      <div class="relative shrink-0">
        <img
          v-if="item.image && !imageError"
          :src="item.image"
          @error="imageError = true"
          class="w-16 h-16 rounded-2xl object-cover bg-gray-100 shadow-sm transition-transform group-hover:scale-105 border border-gray-50 shrink-0"
        />
        <div
          v-else
          class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100 shrink-0"
        >
          <BaseIcon name="photo" class="w-8 h-8 text-gray-300" />
        </div>
      </div>

      <div class="min-w-0 flex-1">
        <h3
          class="font-bold text-gray-800 line-clamp-1 truncate min-w-0 text-sm mt-1"
        >
          {{ item.name }}
          <!-- <span class="text-orange-600 text-xs"> ({{ item.size }})</span> -->
        </h3>
        <div v-if="item.description" class="text-gray-400 text-xs line-clamp-2">
          {{ item.description }}
        </div>
        <p
          v-if="displayPrice"
          class="font-black text-xs mt-1 transition-colors"
          :class="item.available === false && !isAdmin ? 'text-gray-400' : 'text-orange-600'"
        >
          {{ displayPrice }} {{ $t("currency") }}
        </p>
      </div>
    </div>

    <!-- Actions Area -->
    <div
      class="flex flex-col items-end gap-2 shrink-0 ms-3"
      :class="item.available === false && !isAdmin ? 'self-start mt-1' : ''"
    >
      <!-- Admin Mode: Edit/Delete -->
      <div v-if="userRole === 'super_admin'" class="flex gap-2">
        <BaseButton
          @click.stop="emit('edit', item)"
          variant="outline"
          icon="edit"
          class="!w-9 !h-9 !p-0 !rounded-xl"
        />
        <BaseButton
          @click.stop="emit('delete', item.id)"
          variant="outline"
          icon="trash"
          class="!w-9 !h-9 !p-0 !rounded-xl !text-red-500 hover:!bg-red-500 hover:!text-white"
        />
      </div>

      <!-- Public Mode: Add to Cart (Only if NOT in admin dashboard AND ordering is allowed AND item is available) -->
      <div v-else-if="!isAdmin && allowOrdering && item.available !== false">
        <BaseButton
          @click.stop="emit('select', item)"
          variant="ghost"
          icon="plus"
          class="!w-9 !h-9 !p-0 !rounded-xl text-orange-600 hover:bg-orange-50 active:scale-95"
        />
      </div>

      <!-- Public Mode: Unavailable Badge -->
      <div v-else-if="!isAdmin && item.available === false">
        <span
          class="inline-flex items-center text-[10px] sm:text-[11px] font-black text-red-600 bg-red-50 border border-red-200/80 px-2.5 py-1 rounded-xl whitespace-nowrap shadow-2xs select-none"
        >
          {{ $t("menu.item_unavailable") }}
        </span>
      </div>

      <!-- Admin Mode: Availability Badge -->
      <span
        v-if="isAdmin && item.available === false"
        class="text-[9px] bg-gray-100 text-gray-400 px-2 py-1 rounded-lg font-bold text-center uppercase"
      >
        {{ $t("admin.hidden") }}
      </span>
    </div>
  </div>
</template>

<script setup>
const { addToCart } = useCart();
const imageError = ref(false);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  userRole: {
    type: String,
    default: null,
  },
  allowOrdering: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["edit", "delete", "select"]);

const displayPrice = computed(() => {
  if (props.item.prices && typeof props.item.prices === 'object') {
    if (props.item.prices.fixed) return props.item.prices.fixed;
    const numericPrices = Object.values(props.item.prices)
      .map(Number)
      .filter((n) => !isNaN(n) && n > 0);
    if (numericPrices.length > 0) {
      return Math.min(...numericPrices);
    }
  }
  return props.item.price || null;
});

const handleCardClick = () => {
  if (props.isAdmin) {
    // Only allow editing if the user is a super_admin
    if (props.userRole === 'super_admin') {
      emit("edit", props.item);
    }
  } else {
    // Public view: select item if available
    if (props.item.available !== false) {
      emit("select", props.item);
    }
  }
};
</script>
