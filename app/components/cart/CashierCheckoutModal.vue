<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[400] flex items-end sm:items-center justify-center sm:p-4"
      dir="rtl"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-md"
        @click="emit('close')"
      />

      <div
        class="relative bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-sm shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden"
      >
        <div class="px-6 pt-8 pb-4 border-b border-gray-50">
          <h2 class="text-2xl font-black text-gray-800 mb-1">{{ $t("cart.order_cashier") }}</h2>
          <p class="text-xs text-gray-400 font-bold">
            {{ phoneNumberEnabled ? $t("cart.checkout_subtitle_cashier") : $t("cart.checkout_subtitle_cashier_no_phone") }}
          </p>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar">
          <div v-if="!phoneNumberEnabled && !tableNumberEnabled && !queueNumberEnabled" class="text-center py-4 text-gray-500 font-bold text-sm">
            {{ $t("cart.confirm_order_prompt") }}
          </div>

          <div v-if="phoneNumberEnabled">
            <label :class="['block text-[10px] font-black uppercase tracking-wider mb-2', errors.cashierPhone ? 'text-red-500' : 'text-gray-400']">
              {{ $t("cart.phone_label") }}
            </label>
            <input
              :value="cashierPhone"
              type="tel"
              :placeholder="$t('cart.phone_placeholder')"
              maxlength="12"
              @input="emit('update:cashierPhone', ($event.target as HTMLInputElement).value.replace(/[^0-9]/g, ''))"
              :class="['w-full p-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-gray-800 text-sm shadow-sm text-right', errors.cashierPhone ? 'border-red-400 focus:bg-white' : 'border-transparent focus:bg-white focus:border-green-500']"
            />
            <p v-if="errors.cashierPhone" class="text-xs text-red-500 font-bold mt-2 px-1">{{ errors.cashierPhone }}</p>
          </div>

          <!-- Table Number Field -->
          <div v-if="tableNumberEnabled">
            <label :class="['block text-[10px] font-black uppercase tracking-wider mb-2', errors.tableNumber ? 'text-red-500' : 'text-gray-400']">
              {{ $t("cart.table_number_label") }}
            </label>
            <input
              :value="tableNumber"
              type="text"
              inputmode="numeric"
              :placeholder="$t('cart.table_number_placeholder')"
              maxlength="3"
              @input="emit('update:tableNumber', ($event.target as HTMLInputElement).value)"
              :class="['w-full p-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-gray-800 text-sm shadow-sm text-right', errors.tableNumber ? 'border-red-400 focus:bg-white' : 'border-transparent focus:bg-white focus:border-green-500']"
            />
            <p v-if="errors.tableNumber" class="text-xs text-red-500 font-bold mt-2 px-1">{{ errors.tableNumber }}</p>
          </div>

          <!-- Queue Number Field -->
          <div v-if="queueNumberEnabled">
            <label :class="['block text-[10px] font-black uppercase tracking-wider mb-2', errors.queueNumber ? 'text-red-500' : 'text-gray-400']">
              {{ $t("cart.queue_number_label") }}
            </label>
            <input
              :value="queueNumber"
              type="text"
              :placeholder="$t('cart.queue_number_placeholder')"
              maxlength="15"
              @input="emit('update:queueNumber', ($event.target as HTMLInputElement).value)"
              :class="['w-full p-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-gray-800 text-sm shadow-sm text-right', errors.queueNumber ? 'border-red-400 focus:bg-white' : 'border-transparent focus:bg-white focus:border-green-500']"
            />
            <p v-if="errors.queueNumber" class="text-xs text-red-500 font-bold mt-2 px-1">{{ errors.queueNumber }}</p>
          </div>
        </div>

        <div class="px-6 py-6 bg-white border-t border-gray-100 flex gap-3 pb-8 sm:pb-6">
          <button
            @click="emit('close')"
            class="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black border border-gray-100 hover:bg-gray-100 transition-all"
            :disabled="isSubmitting"
          >
            {{ $t("common.cancel") }}
          </button>
          <button
            @click="emit('submit')"
            :disabled="isSubmitting"
            class="flex-1 flex items-center justify-center py-4 bg-gray-900 text-white rounded-2xl font-black disabled:opacity-50 text-[14px] shadow-lg shadow-gray-200"
          >
            <div
              v-if="isSubmitting"
              class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></div>
            <span v-else>{{ $t("cart.confirm_order") }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  phoneNumberEnabled: boolean
  tableNumberEnabled: boolean
  queueNumberEnabled: boolean
  cashierPhone: string
  tableNumber: string
  queueNumber: string
  errors: Record<string, string>
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: []
  'update:cashierPhone': [value: string]
  'update:tableNumber': [value: string]
  'update:queueNumber': [value: string]
}>()
</script>
