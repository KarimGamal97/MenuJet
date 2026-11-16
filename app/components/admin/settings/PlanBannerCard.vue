<template>
  <div class="mb-8 p-5 rounded-3xl border border-gray-100 bg-gradient-to-l from-gray-50/80 via-white to-orange-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
    <div class="flex items-center gap-4">
      <div
        class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs shrink-0"
        :class="isPro ? 'bg-amber-100 text-amber-700' : isBasic ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-600'"
      >
        <BaseIcon :name="isPro ? 'crown' : isBasic ? 'bolt' : 'sparkles'" class="w-6 h-6" />
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h3 class="font-black text-gray-900 text-base md:text-lg">
            {{ $t(`plans.${currentPlan.id || 'free'}_name`) }}
          </h3>
          <span
            class="text-xs px-2.5 py-0.5 rounded-full font-black whitespace-nowrap shrink-0"
            :class="isPro ? 'bg-amber-100 text-amber-800' : isBasic ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'"
          >
            {{ isFree ? $t("plans.free_trial_badge") : $t("plans.active_badge") }}
          </span>
        </div>
        <p class="text-xs text-gray-500 font-medium mt-1">
          <template v-if="isFree">
            {{ $t("plans.allowed_limit", { items: currentPlan.max_items, categories: currentPlan.max_categories }) }}
          </template>
          <template v-else>
            {{ $t("plans.unlimited_items_cats") }} • {{ $t("plans.all_features_active") }}
          </template>
        </p>
      </div>
    </div>

    <button
      v-if="!isPro"
      type="button"
      @click="emit('openUpgrade', $t('plans.full_upgrade_title'), $t('plans.full_upgrade_badge'), $t('plans.full_upgrade_msg'))"
      class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs md:text-sm py-2.5 px-5 rounded-xl shadow-md shadow-orange-500/15 transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
    >
      <BaseIcon name="bolt" class="w-4 h-4" />
      {{ $t("plans.upgrade_now") }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isFree: boolean
  isBasic: boolean
  isPro: boolean
  currentPlan: Record<string, any>
}>()

const emit = defineEmits<{
  openUpgrade: [featureName: string, badge: string, customMsg: string]
}>()
</script>
