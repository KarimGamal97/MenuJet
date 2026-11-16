<template>
  <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
    <div class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
      <img
        v-if="item.image"
        :src="item.image"
        class="w-full h-full object-cover"
      />
      <BaseIcon v-else name="heart" class="w-6 h-6 text-gray-400 opacity-20" />
    </div>

    <div class="flex-grow min-w-0">
      <p class="font-bold text-gray-800 text-sm truncate">
        {{ item.name }}
        <span v-if="item.size" class="text-orange-600">
          ({{ item.size.replace(/\s*قطعة/g, '').trim() }})
        </span>
      </p>
      <p v-if="item.notes" class="text-xs text-gray-500 truncate mt-0.5">
        {{ item.notes }}
      </p>
      <div v-if="item.selectedExtras?.length" class="flex flex-wrap gap-1 mt-1">
        <span
          v-for="ex in item.selectedExtras"
          :key="ex.name"
          class="bg-orange-50 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded-lg border border-orange-100"
        >
          + {{ ex.name }} (+{{ ex.price }} {{ $t("currency") }})
        </span>
      </div>
      <p class="text-orange-600 font-black text-sm mt-0.5">
        {{ (item.basePrice || item.price) * item.quantity }}<span v-if="item.selectedExtras?.length"> + {{ (item.price - (item.basePrice || item.price)) * item.quantity }}</span> {{ $t("currency") }}
      </p>
    </div>

    <div class="flex items-center gap-2">
      <button
        @click="emit('decrease')"
        class="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-500 font-black"
      >
        <BaseIcon name="minus" class="w-4 h-4 mx-auto" />
      </button>
      <span class="text-sm font-black text-gray-800 w-4 text-center">
        {{ item.quantity }}
      </span>
      <button
        @click="emit('increase')"
        class="w-7 h-7 rounded-full bg-orange-500 text-white font-black"
      >
        <BaseIcon name="plus" class="w-4 h-4 mx-auto" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: Record<string, any>
}>()

const emit = defineEmits<{
  increase: []
  decrease: []
}>()
</script>
