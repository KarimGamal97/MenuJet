<template>
  <!-- Branding & Colors -->
  <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4">
    <div class="flex items-center gap-3 mb-4 px-1">
      <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
        <BaseIcon name="settings" class="w-5 h-5 text-orange-600" />
      </div>
      <div>
        <label class="text-sm font-bold text-gray-800 block">{{ $t("cart.primary_color_label") }}</label>
        <p class="text-[10px] text-gray-400 font-bold mt-1">{{ $t("cart.primary_color_subtitle") }}</p>
      </div>
    </div>

    <div class="bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
      <div class="flex flex-wrap gap-3 mb-5">
        <button
          v-for="color in presetColors"
          :key="color"
          @click="form.primary_color = color"
          class="w-10 h-10 rounded-full border-4 transition-all"
          :style="{ backgroundColor: color, borderColor: form.primary_color === color ? 'white' : 'transparent' }"
          :class="{ 'ring-2 ring-gray-200': form.primary_color === color }"
        ></button>

        <div class="relative w-10 h-10 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
          <input
            type="color"
            v-model="form.primary_color"
            class="absolute inset-0 w-[150%] h-[150%] cursor-pointer -translate-x-1/4 -translate-y-1/4"
          />
          <BaseIcon name="plus" class="w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div class="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-gray-100 max-w-[200px]">
        <div class="w-8 h-8 rounded-lg shadow-sm" :style="{ backgroundColor: form.primary_color }"></div>
        <input
          v-model="form.primary_color"
          type="text"
          class="bg-transparent border-none outline-none font-black text-sm text-gray-700 w-full"
          placeholder="#000000"
        />
      </div>
    </div>
  </div>

  <!-- Order ID Reset Settings -->
  <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4">
    <div class="flex items-center gap-3 mb-4 px-1">
      <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
        <BaseIcon name="settings" class="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <label class="text-sm font-bold text-gray-800 block">{{ $t("cart.order_id_reset_title") }}</label>
        <p class="text-[10px] text-gray-400 font-bold mt-1">{{ $t("cart.order_id_reset_subtitle") }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-3xl border border-gray-100 max-w-md">
      <button
        v-for="type in ['shift', 'daily']"
        :key="type"
        @click="form.order_reset_type = type"
        :class="[
          'py-3.5 px-3 rounded-2xl font-bold text-xs transition-all border-2 text-center flex items-center justify-center gap-2',
          form.order_reset_type === type
            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/10'
            : 'bg-white text-gray-500 border-transparent hover:border-blue-200'
        ]"
      >
        <BaseIcon :name="type === 'shift' ? 'clock' : 'calendar'" class="w-4 h-4" />
        <span>{{ $t(`cart.reset_${type}`) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  form: Record<string, any>
}>()

const presetColors = ['#ea580c', '#2563eb', '#16a34a', '#7c3aed', '#dc2626', '#1f2937']
</script>
