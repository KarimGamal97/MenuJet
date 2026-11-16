<template>
  <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4">
    <div class="flex items-center justify-between gap-3 mb-4 px-1">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
          <BaseIcon name="sparkles" class="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-bold text-gray-800 block">{{ $t('admin.announcement_title') }}</label>
            <span class="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-black">
              <BaseIcon name="crown" class="w-3 h-3" />
              {{ $t("plans.pro_name") }}
            </span>
          </div>
          <p class="text-[10px] text-gray-400 font-bold mt-0.5">
            {{ $t('admin.announcement_subtitle') }}
          </p>
        </div>
      </div>
    </div>

    <div class="bg-gray-50/50 rounded-3xl border border-gray-100 p-4 space-y-4">
      <BaseToggle
        v-model="form.announcement_enabled"
        :label="$t('admin.announcement_toggle')"
        :locked="!isPro"
        :badge="$t('plans.pro_badge_short')"
        @lock-click="emit('openUpgrade', $t('admin.announcement_short_title'), $t('plans.pro_badge_short'), $t('admin.announcement_lock_msg'))"
        class="!bg-white"
      />

      <div v-if="form.announcement_enabled && isPro" class="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
        <label class="text-xs font-bold text-gray-700 block px-1">
          {{ $t('admin.announcement_text_label') }}
        </label>
        <input
          v-model="form.announcement_text"
          type="text"
          :placeholder="$t('admin.announcement_placeholder')"
          class="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  form: Record<string, any>
  isPro: boolean
}>()

const emit = defineEmits<{
  openUpgrade: [featureName: string, badge: string, customMsg: string]
}>()
</script>
