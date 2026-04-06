<template>
  <div
    class="bg-white p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer active:scale-[0.98] rounded-[2rem]"
    @click="handleCardClick"
  >
    <div class="flex items-center gap-4 text-right">
      <img
        v-if="item.image"
        :src="item.image"
        class="w-16 h-16 rounded-2xl object-cover bg-gray-100 shadow-sm transition-transform group-hover:scale-105 border border-gray-50 shrink-0"
      />
      <div
        v-else
        class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-200 border border-gray-50 shrink-0"
      >
        <BaseIcon name="photo" class="w-8 h-8" />
      </div>

      <div class="min-w-0">
        <h3
          class="font-bold text-gray-800 mt-1 line-clamp-1 truncate min-w-0 text-sm"
        >
          {{ item.name }}
          <!-- <span class="text-orange-600 text-xs"> ({{ item.size }})</span> -->
        </h3>
        <div v-if="item.description" class="text-gray-400 text-xs line-clamp-2">
          {{ item.description }}
        </div>
        <!-- <p class="text-orange-600 font-bold text-xs">
          {{ item.price }}
        </p> -->
      </div>
    </div>

    <!-- Actions Area -->
    <div class="flex flex-col gap-2">
      <!-- Admin Mode: Edit/Delete -->
      <div v-if="isAdmin" class="flex gap-2">
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

      <!-- Public Mode: Add to Cart -->
      <div v-else>
        <BaseButton
          @click.stop="emit('select', item)"
          variant="outline"
          icon="plus"
          class="!w-9 !h-9 !p-0 !rounded-xl text-orange-600 border-orange-100 hover:bg-orange-50 active:scale-95"
        />
      </div>

      <!-- Availability Badge -->
      <span
        v-if="item.available === false"
        class="text-[9px] bg-gray-100 text-gray-400 px-2 py-1 rounded-lg font-bold text-center uppercase"
      >
        {{ $t("admin.hidden") }}
      </span>
    </div>
  </div>
</template>

<script setup>
const { addToCart } = useCart();

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["edit", "delete", "select"]);

const handleCardClick = () => {
  if (props.isAdmin) {
    emit("edit", props.item);
  } else {
    if (props.item.available !== false) {
      emit("select", props.item);
    }
  }
};
</script>
