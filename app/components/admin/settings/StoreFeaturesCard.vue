<template>
  <div class="md:col-span-2 pt-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <BaseToggle
        v-model="form.show_table_number"
        :label="$t('cart.table_number_setting_label')"
        :locked="!canAllowTables"
        :badge="$t('plans.pro_badge_short')"
        @lock-click="emit('openUpgrade', $t('plans.feat_tables'), $t('plans.pro_badge_short'), $t('plans.tables_modal_msg'))"
        class="!bg-gray-50/50 !border !border-gray-100"
      />
      <BaseToggle
        v-model="form.show_queue_number"
        :label="$t('cart.queue_number_setting_label')"
        :locked="!canAllowTables"
        :badge="$t('plans.pro_badge_short')"
        @lock-click="emit('openUpgrade', $t('plans.feat_queue'), $t('plans.pro_badge_short'), $t('plans.queue_modal_msg'))"
        class="!bg-gray-50/50 !border !border-gray-100"
      />
      <BaseToggle
        v-model="form.whatsapp_ordering_enabled"
        :label="$t('plans.enable_whatsapp_ordering')"
        :locked="!canAllowWhatsapp"
        :badge="$t('plans.pro_badge_short')"
        @lock-click="emit('openUpgrade', $t('plans.feat_whatsapp'), $t('plans.pro_badge_short'), $t('plans.whatsapp_modal_msg'))"
        class="!bg-gray-50/50 !border !border-gray-100"
      />
      <BaseToggle
        v-model="form.show_phone_number"
        :label="$t('plans.enable_phone_number')"
        class="!bg-gray-50/50 !border !border-gray-100"
      />
      <BaseToggle
        v-model="form.cashier_ordering_enabled"
        :label="$t('plans.enable_cashier_ordering')"
        class="!bg-gray-50/50 !border !border-gray-100"
      />

      <!-- Order Editing Feature Settings -->
      <div class="sm:col-span-2 bg-gray-50/50 rounded-3xl border border-gray-100 p-4 transition-all">
        <BaseToggle
          v-model="form.allow_order_editing"
          :label="$t('admin.allow_order_editing_label')"
          class="!bg-transparent !p-0 !border-0"
        />
        <p class="text-[11px] text-gray-400 font-bold mt-1 px-1">
          {{ $t('admin.allow_order_editing_subtitle') }}
        </p>

        <div v-if="form.allow_order_editing" class="mt-4 pt-3 border-t border-gray-200/60 animate-in slide-in-from-top-2 duration-300">
          <label class="text-xs font-bold text-gray-700 flex items-center gap-1.5 mb-2 px-1">
            <BaseIcon name="clock" class="w-3.5 h-3.5 text-orange-500" />
            {{ $t('admin.order_edit_window_label') }}
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="mins in [3, 5, 10]"
              :key="mins"
              type="button"
              @click="form.order_edit_window_minutes = mins"
              :class="[
                'py-2.5 px-3 rounded-2xl text-xs font-black transition-all border flex items-center justify-center gap-1.5 cursor-pointer',
                form.order_edit_window_minutes === mins
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
              ]"
            >
              <span>{{ $t(`admin.edit_window_${mins}`) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  form: Record<string, any>
  canAllowTables: boolean
  canAllowWhatsapp: boolean
}>()

const emit = defineEmits<{
  openUpgrade: [featureName: string, badge: string, customMsg: string]
}>()
</script>
