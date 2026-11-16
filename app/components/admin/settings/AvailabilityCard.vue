<template>
  <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4">
    <div class="flex items-center gap-3 mb-6 px-1">
      <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
        <BaseIcon name="clock" class="w-5 h-5 text-orange-600" />
      </div>
      <div>
        <label class="text-sm font-bold text-gray-800 block">{{ $t('admin.availability_title') }}</label>
        <p class="text-[10px] text-gray-400 font-bold mt-1">{{ $t('admin.availability_subtitle') }}</p>
      </div>
    </div>

    <div class="space-y-4">
      <BaseToggle
        v-model="form.is_active"
        :label="$t('admin.restaurant_status_label')"
        class="!bg-white !border !border-gray-100 shadow-sm"
      />

      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <BaseToggle
          v-model="form.automated_hours_enabled"
          :label="$t('admin.automated_hours_label')"
          :locked="!canAllowCustomHours"
          :badge="$t('plans.pro_badge_short')"
          @lock-click="emit('openUpgrade', $t('plans.feat_automated_hours'), $t('plans.pro_badge_short'), $t('plans.hours_modal_msg'))"
          class="!bg-transparent"
        />

        <div
          v-if="form.automated_hours_enabled && canAllowCustomHours"
          class="px-5 pb-5 pt-2 border-t border-gray-50 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300"
          dir="ltr"
        >
          <div class="flex-1 flex flex-col gap-1.5">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              {{ $t('admin.opening_time_label') }}
            </label>
            <input
              type="time"
              v-model="form.opening_time"
              class="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>
          <div class="flex-1 flex flex-col gap-1.5">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              {{ $t('admin.closing_time_label') }}
            </label>
            <input
              type="time"
              v-model="form.closing_time"
              class="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  form: Record<string, any>
  canAllowCustomHours: boolean
}>()

const emit = defineEmits<{
  openUpgrade: [featureName: string, badge: string, customMsg: string]
}>()
</script>
