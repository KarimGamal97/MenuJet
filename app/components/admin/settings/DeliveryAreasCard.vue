<template>
  <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4 relative">
    <!-- Smart Lock Overlay for Free & Basic Plans -->
    <div
      v-if="!canAllowBranches"
      class="absolute inset-0 bg-white/85 backdrop-blur-[3px] z-20 rounded-3xl flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-amber-200/90 shadow-xs"
    >
      <div class="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-3 shadow-xs">
        <BaseIcon name="crown" class="w-7 h-7 text-amber-600" />
      </div>
      <h4 class="font-black text-gray-900 text-base mb-1">
        {{ $t("plans.delivery_lock_title") }}
      </h4>
      <p class="text-xs text-gray-500 font-medium max-w-sm mb-4 leading-relaxed">
        {{ $t("plans.delivery_lock_desc") }}
      </p>
      <button
        type="button"
        @click="emit('openUpgrade', $t('plans.feat_delivery'), $t('plans.pro_badge_short'), $t('plans.delivery_modal_msg'))"
        class="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs py-2.5 px-6 rounded-xl shadow-md shadow-orange-500/20 transition-transform active:scale-95 cursor-pointer"
      >
        <BaseIcon name="bolt" class="w-3.5 h-3.5" />
        {{ $t("plans.delivery_lock_btn") }}
      </button>
    </div>

    <div class="flex items-center gap-3 mb-4 px-1">
      <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
        <BaseIcon name="map-pin" class="w-5 h-5 text-green-600" />
      </div>
      <div>
        <label class="text-sm font-bold text-gray-800 block">{{ $t("admin.delivery_areas_title") }}</label>
        <span class="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 mt-1 rounded font-bold inline-flex items-center gap-1">
          <BaseIcon name="check" class="w-2 h-2" />
          {{ areas?.length || 0 }} {{ $t("admin.area_registered") }}
        </span>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 items-end bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
      <div class="flex-1 w-full">
        <BaseInput
          :modelValue="newArea.name"
          @update:modelValue="emit('update:newArea', { ...newArea, name: String($event ?? '') })"
          @keyup.enter="emit('add')"
          :placeholder="$t('admin.area_name_placeholder')"
        />
      </div>
      <div class="w-full sm:w-32">
        <BaseInput
          :modelValue="newArea.price"
          @update:modelValue="emit('update:newArea', { ...newArea, price: $event })"
          @keyup.enter="emit('add')"
          type="number"
          :placeholder="$t('admin.area_price_placeholder')"
        />
      </div>
      <BaseButton
        variant="primary"
        icon="plus"
        @click="emit('add')"
        class="!w-14 !h-14 !p-0 shrink-0 mb-1 !bg-green-500 hover:!bg-green-600 !shadow-green-200"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      <div
        v-for="(area, index) in areas"
        :key="index"
        class="bg-white p-4 rounded-2xl border-2 border-gray-50 shadow-sm flex items-center justify-between group hover:border-green-200 transition-all relative overflow-hidden"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <BaseIcon name="map-pin" class="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p class="font-bold text-sm text-gray-800">{{ area.name }}</p>
            <p class="text-xs font-black text-green-600 mt-1 bg-green-50 px-2 py-0.5 rounded inline-block">
              {{ area.price }} {{ $t("admin.currency") }}
            </p>
          </div>
        </div>
        <button
          @click="emit('remove', index)"
          class="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"
        >
          <BaseIcon name="trash" class="w-4 h-4" />
        </button>
      </div>

      <div v-if="!areas || areas.length === 0" class="col-span-full py-10 flex flex-col items-center justify-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-3xl text-sm bg-gray-50/30">
        <BaseIcon name="map-pin" class="w-10 h-10 mb-3 opacity-20" />
        {{ $t("admin.no_areas_msg") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DeliveryArea {
  name: string
  price: number | string
}

defineProps<{
  canAllowBranches: boolean
  areas: DeliveryArea[]
  newArea: DeliveryArea
}>()

const emit = defineEmits<{
  'update:newArea': [value: DeliveryArea]
  add: []
  remove: [index: number]
  openUpgrade: [featureName: string, badge: string, customMsg: string]
}>()
</script>
