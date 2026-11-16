<template>
  <div class="md:col-span-2 relative p-6 bg-gradient-to-br from-gray-50/80 to-white rounded-3xl border border-gray-100 shadow-xs space-y-5">
    <!-- Smart Lock Overlay for Free & Basic Plans -->
    <div
      v-if="!isPro"
      class="absolute inset-0 bg-white/85 backdrop-blur-[3px] z-20 rounded-3xl flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-amber-200/90 shadow-xs"
    >
      <div class="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-3 shadow-xs">
        <BaseIcon name="crown" class="w-7 h-7 text-amber-600" />
      </div>
      <h4 class="font-black text-gray-900 text-base mb-1">
        {{ $t("plans.payments_lock_title") }}
      </h4>
      <p class="text-xs text-gray-500 font-medium max-w-sm mb-4 leading-relaxed">
        {{ $t("plans.payments_lock_desc") }}
      </p>
      <button
        type="button"
        @click="emit('openUpgrade', $t('plans.feat_payments'), $t('plans.pro_badge_short'), $t('plans.payments_modal_msg'))"
        class="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs py-2.5 px-6 rounded-xl shadow-md shadow-orange-500/20 transition-transform active:scale-95 cursor-pointer"
      >
        <BaseIcon name="bolt" class="w-3.5 h-3.5" />
        {{ $t("plans.payments_lock_btn") }}
      </button>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
          <BaseIcon name="wallet" class="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-bold text-gray-800 block">{{ $t("admin.payment_methods_title") }}</label>
            <span class="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-black">
              <BaseIcon name="crown" class="w-3 h-3" />
              {{ $t("plans.pro_name") }}
            </span>
          </div>
          <p class="text-xs text-gray-400 font-medium mt-0.5">{{ $t("admin.payment_methods_subtitle") }}</p>
        </div>
      </div>
    </div>

    <!-- Custom Dropdown -->
    <div class="space-y-1.5 relative">
      <label class="text-xs font-bold text-gray-700 block px-1">
        {{ $t("admin.payment_methods_allowed_label") }}
      </label>
      <div class="relative">
        <button
          type="button"
          @click="isPaymentDropdownOpen = !isPaymentDropdownOpen"
          class="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 flex items-center justify-between shadow-xs hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer text-right"
        >
          <span>
            {{ paymentOptions.find(o => o.value === allowed)?.label || $t("admin.payment_methods_all") }}
          </span>
          <BaseIcon
            name="chevron-down"
            class="w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0"
            :class="{ 'rotate-180 text-orange-500': isPaymentDropdownOpen }"
          />
        </button>

        <div
          v-if="isPaymentDropdownOpen"
          class="absolute top-full mt-2 inset-x-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1"
        >
          <button
            v-for="opt in paymentOptions"
            :key="opt.value"
            type="button"
            @click="
              emit('update:allowed', opt.value);
              isPaymentDropdownOpen = false;
            "
            :class="[
              'w-full text-right px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-colors cursor-pointer',
              allowed === opt.value
                ? 'bg-orange-50 text-orange-600 font-black'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <span>{{ opt.label }}</span>
            <BaseIcon
              v-if="allowed === opt.value"
              name="check"
              class="w-4 h-4 text-orange-500 shrink-0"
            />
          </button>
        </div>
      </div>

      <div
        v-if="isPaymentDropdownOpen"
        @click="isPaymentDropdownOpen = false"
        class="fixed inset-0 z-40"
      ></div>
    </div>

    <!-- Payment Inputs -->
    <div v-if="allowed !== 'none'" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      <!-- Vodafone Cash Input -->
      <div
        v-if="['all', 'vodafone_cash'].includes(allowed)"
        class="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-2"
      >
        <div class="flex items-center gap-2 mb-1">
          <img :src="vodafoneCashLogo" alt="Vodafone Cash" class="h-6 w-auto object-contain" />
          <span class="text-xs font-black text-gray-800">{{ $t("admin.vodafone_cash_title") }}</span>
        </div>
        <label class="text-[11px] font-bold text-gray-500 block px-0.5">
          {{ $t("admin.vodafone_cash_number_label") }}
        </label>
        <input
          :value="vodafoneCashNumber"
          @input="emit('update:vodafoneCashNumber', ($event.target as HTMLInputElement).value)"
          type="tel"
          maxlength="15"
          :placeholder="$t('admin.vodafone_cash_number_placeholder')"
          dir="ltr"
          class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all text-right"
        />
      </div>

      <!-- InstaPay Input -->
      <div
        v-if="['all', 'instapay'].includes(allowed)"
        class="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-2"
      >
        <div class="flex items-center gap-2 mb-1">
          <img :src="instapayLogo" alt="InstaPay" class="h-6 w-auto object-contain" />
          <span class="text-xs font-black text-gray-800">{{ $t("admin.instapay_title") }}</span>
        </div>
        <label class="text-[11px] font-bold text-gray-500 block px-0.5">
          {{ $t("admin.instapay_account_label") }}
        </label>
        <input
          :value="instapayAccount"
          @input="emit('update:instapayAccount', ($event.target as HTMLInputElement).value)"
          type="text"
          maxlength="40"
          :placeholder="$t('admin.instapay_account_placeholder')"
          dir="ltr"
          class="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all text-right"
        />
      </div>
    </div>

    <!-- Disabled Notice -->
    <div
      v-else
      class="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-3.5 text-amber-900 animate-in fade-in duration-200"
    >
      <div class="w-10 h-10 rounded-xl bg-amber-100/90 flex items-center justify-center shrink-0 text-amber-700">
        <BaseIcon name="close" class="w-4 h-4 text-amber-700" />
      </div>
      <div>
        <p class="text-xs font-black text-gray-800">
          {{ $t("admin.payment_methods_disabled") }}
        </p>
        <p class="text-[11px] text-gray-500 font-medium mt-0.5 leading-relaxed">
          {{ $t("admin.payment_methods_disabled_notice") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import instapayLogo from '~/assets/instapay-logo.png'
import vodafoneCashLogo from '~/assets/vodafone-cash-logo.png'

const { t } = useI18n()

defineProps<{
  isPro: boolean
  allowed: string
  vodafoneCashNumber: string
  instapayAccount: string
}>()

const emit = defineEmits<{
  'update:allowed': [value: string]
  'update:vodafoneCashNumber': [value: string]
  'update:instapayAccount': [value: string]
  openUpgrade: [featureName: string, badge: string, customMsg: string]
}>()

const isPaymentDropdownOpen = ref(false)

const paymentOptions = computed(() => [
  { value: 'all', label: t('admin.payment_methods_all') },
  { value: 'vodafone_cash', label: t('admin.payment_methods_vodafone_only') },
  { value: 'instapay', label: t('admin.payment_methods_instapay_only') },
  { value: 'none', label: t('admin.payment_methods_disabled') },
])
</script>
