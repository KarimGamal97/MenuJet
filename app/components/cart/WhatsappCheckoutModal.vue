<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[400] flex items-end sm:items-center justify-center sm:p-4 brand-theme-scope"
      :style="{ '--p-color': primaryColor }"
      dir="rtl"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-md"
        @click="emit('close')"
      />

      <div
        class="relative bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-md shadow-2xl z-10 max-h-[95vh] flex flex-col overflow-hidden"
      >
        <div class="px-8 pt-8 pb-4 border-b border-gray-50 sticky top-0 bg-white z-20">
          <h2 class="text-2xl font-black text-gray-800 mb-1">{{ $t("cart.checkout_title") }}</h2>
          <p class="text-xs text-gray-400 font-bold">{{ $t("cart.checkout_subtitle_whatsapp") }}</p>
        </div>

        <div class="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar pb-10">
          <div>
            <label :class="['block text-[10px] font-black uppercase tracking-wider mb-2', errors.name ? 'text-red-500' : 'text-gray-400']">
              {{ $t("cart.name_label") }}
            </label>
            <input
              :value="customerForm.name"
              type="text"
              :placeholder="$t('cart.name_placeholder')"
              maxlength="20"
              @input="updateField('name', ($event.target as HTMLInputElement).value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, ''))"
              :class="['w-full p-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-gray-800 text-sm shadow-sm text-right', errors.name ? 'border-red-400 focus:bg-white' : 'border-transparent focus:bg-white focus:border-green-500']"
            />
            <p v-if="errors.name" class="text-xs text-red-500 font-bold mt-2 px-1">{{ errors.name }}</p>
          </div>

          <div v-if="phoneNumberEnabled">
            <label :class="['block text-[10px] font-black uppercase tracking-wider mb-2', errors.phone ? 'text-red-500' : 'text-gray-400']">
              {{ $t("cart.phone_label") }}
            </label>
            <input
              :value="customerForm.phone"
              type="tel"
              :placeholder="$t('cart.phone_placeholder')"
              maxlength="12"
              @input="updateField('phone', ($event.target as HTMLInputElement).value.replace(/[^0-9]/g, ''))"
              :class="['w-full p-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-gray-800 text-sm shadow-sm text-right', errors.phone ? 'border-red-400 focus:bg-white' : 'border-transparent focus:bg-white focus:border-green-500']"
            />
            <p v-if="errors.phone" class="text-xs text-red-500 font-bold mt-2 px-1">{{ errors.phone }}</p>
          </div>

          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-3 text-right">
              {{ $t("cart.delivery_method") }}
            </label>
            <div class="flex gap-3">
              <button
                @click="updateField('method', 'توصيل'); emit('update:selectedDeliveryArea', null)"
                :class="[
                  'flex-1 py-4 rounded-2xl font-black text-sm transition-all border-2 flex items-center justify-center gap-2',
                  customerForm.method === 'توصيل'
                    ? 'border-green-500 bg-green-50 text-green-600 shadow-md ring-2 ring-green-500/10'
                    : 'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100'
                ]"
              >
                <BaseIcon name="map-pin" class="w-4 h-4" />
                {{ $t("cart.delivery") }}
              </button>
              <button
                @click="updateField('method', 'استلام من المحل')"
                :class="[
                  'flex-1 py-4 rounded-2xl font-black text-sm transition-all border-2 flex items-center justify-center gap-2',
                  customerForm.method === 'استلام من المحل'
                    ? 'border-green-500 bg-green-50 text-green-600 shadow-md ring-2 ring-green-500/10'
                    : 'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100'
                ]"
              >
                <BaseIcon name="store" class="w-4 h-4" />
                {{ $t("cart.pickup_store") }}
              </button>
            </div>
          </div>

          <div v-if="customerForm.method === 'توصيل'" class="mt-4 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
            <div class="text-right mb-5">
              <h3 class="font-black text-gray-800 text-lg">{{ $t("cart.delivery_select_title") }}</h3>
              <p class="text-[11px] text-gray-400 font-bold mt-1">{{ $t("cart.delivery_select_subtitle") }}</p>
            </div>

            <template v-if="deliveryAreas && deliveryAreas.length > 0">
              <div class="relative mb-5">
                <input
                  v-model="searchQuery"
                  :placeholder="$t('admin.search_placeholder')"
                  class="w-full bg-gray-50 border-none outline-none py-4 pr-12 pl-4 rounded-2xl text-sm font-bold text-gray-800 placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-green-500 transition-all border-2 border-transparent focus:bg-white text-right"
                />
                <BaseIcon name="search" class="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <div class="grid grid-cols-2 gap-3 min-h-[120px] max-h-72 overflow-y-auto p-1 scroll-smooth">
                <button
                  v-for="area in filteredAreas"
                  :key="area.name"
                  @click="emit('update:selectedDeliveryArea', area); emit('clearDeliveryError')"
                  :class="[
                    'p-4 rounded-[1.5rem] border-2 transition-all flex flex-col items-center justify-center gap-2 outline-none',
                    selectedDeliveryArea?.name === area.name
                      ? 'border-green-600 bg-green-50/50 shadow-md scale-100 ring-2 ring-green-600/20'
                      : 'border-gray-100 bg-white hover:border-green-200 opacity-90 hover:opacity-100 focus:border-green-300'
                  ]"
                >
                  <div :class="['w-9 h-9 rounded-full flex items-center justify-center mb-1 transition-colors', selectedDeliveryArea?.name === area.name ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400']">
                    <BaseIcon name="map-pin" class="w-4 h-4" />
                  </div>
                  <div class="text-center">
                    <p :class="['text-xs font-black mb-1', selectedDeliveryArea?.name === area.name ? 'text-green-800' : 'text-gray-700']">{{ area.name }}</p>
                    <p :class="['text-[11px] font-black', selectedDeliveryArea?.name === area.name ? 'text-green-600' : 'text-gray-500']">{{ area.price }} {{ $t("admin.currency") }}</p>
                  </div>
                </button>

                <div v-if="filteredAreas.length === 0" class="col-span-full py-10 text-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-3xl text-sm bg-gray-50/50">
                  {{ $t("cart.delivery_not_found") }}
                </div>
              </div>
            </template>

            <div v-else class="py-12 px-4 text-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-[2rem] text-sm bg-gray-50/30">
              <BaseIcon name="map-pin" class="w-12 h-12 mb-4 mx-auto opacity-20" />
              {{ $t("cart.delivery_no_areas") }}
            </div>

            <p v-if="errors.deliveryArea" class="text-xs text-red-500 font-bold mt-4 text-center bg-red-50 py-2 rounded-xl border border-red-100">{{ errors.deliveryArea }}</p>

            <div v-if="selectedDeliveryArea" class="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500 text-right">
              <label :class="['block text-[10px] font-black uppercase tracking-wider mb-2', errors.addressDetail ? 'text-red-500' : 'text-gray-400']">
                {{ $t("cart.address_detail_label") }}
              </label>
              <textarea
                :value="customerForm.addressDetail"
                @input="updateField('addressDetail', ($event.target as HTMLTextAreaElement).value)"
                :placeholder="$t('cart.address_detail_placeholder')"
                rows="3"
                :class="['w-full p-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-gray-800 text-sm shadow-sm resize-none text-right', errors.addressDetail ? 'border-red-400 focus:bg-white' : 'border-transparent focus:bg-white focus:border-green-500']"
              ></textarea>
              <p v-if="errors.addressDetail" class="text-xs text-red-500 font-bold mt-2 px-1">{{ errors.addressDetail }}</p>
            </div>
          </div>

          <!-- Electronic Payment Method Selection -->
          <div v-if="availablePaymentMethods.length > 0" class="pt-4 border-t border-gray-100 space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-[11px] font-black uppercase tracking-wider text-gray-500 text-right">
                {{ $t("cart.payment_method_label") }}
              </label>
              <span class="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200/60">
                تحويل إلكتروني مباشر
              </span>
            </div>

            <div class="relative">
              <select
                :value="customerForm.paymentMethod"
                @change="updateField('paymentMethod', ($event.target as HTMLSelectElement).value)"
                class="w-full p-4 bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-gray-800 text-sm shadow-sm appearance-none cursor-pointer text-right pr-4 pl-10"
              >
                <option v-for="method in availablePaymentMethods" :key="method.id" :value="method.id">
                  {{ method.name }}
                </option>
              </select>
              <div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <BaseIcon name="chevron-down" class="w-4 h-4" />
              </div>
            </div>

            <div
              v-if="selectedPaymentMethodDetails"
              class="p-4 rounded-2xl border-2 transition-all bg-gradient-to-br from-white to-gray-50/70 border-gray-100 shadow-xs space-y-3"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <img
                    :src="selectedPaymentMethodDetails.logo"
                    :alt="selectedPaymentMethodDetails.name"
                    class="h-7 w-auto object-contain max-w-[100px]"
                  />
                  <div>
                    <span class="text-xs font-black text-gray-800 block">
                      {{ selectedPaymentMethodDetails.name }}
                    </span>
                    <span class="text-[10px] font-bold text-gray-400">
                      {{ selectedPaymentMethodDetails.label }}
                    </span>
                  </div>
                </div>

                <button
                  v-if="selectedPaymentMethodDetails.value"
                  type="button"
                  @click="copyToClipboard(selectedPaymentMethodDetails.value, selectedPaymentMethodDetails.id)"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer',
                    copiedField === selectedPaymentMethodDetails.id
                      ? 'bg-emerald-500 text-white shadow-emerald-200'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                  ]"
                >
                  <BaseIcon
                    :name="copiedField === selectedPaymentMethodDetails.id ? 'check' : 'copy'"
                    class="w-3.5 h-3.5"
                  />
                  <span>
                    {{ copiedField === selectedPaymentMethodDetails.id ? $t("cart.copied") : $t("cart.copy_number") }}
                  </span>
                </button>
              </div>

              <div
                v-if="selectedPaymentMethodDetails.value"
                class="bg-white p-3 rounded-xl border border-dashed border-gray-200 flex items-center justify-between"
              >
                <span class="text-xs font-bold text-gray-400">رقم / حساب التحويل:</span>
                <span class="text-sm font-black text-gray-900 tracking-wider font-mono select-all" dir="ltr">
                  {{ selectedPaymentMethodDetails.value }}
                </span>
              </div>

              <p class="text-[11px] text-gray-500 font-bold leading-relaxed bg-amber-50/70 text-amber-900 p-2.5 rounded-xl border border-amber-100/80">
                💡 {{ selectedPaymentMethodDetails.instruction }}
              </p>
            </div>
          </div>
        </div>

        <div class="px-8 py-6 bg-white border-t border-gray-100 flex gap-3 pb-10 sm:pb-8 sticky bottom-0 z-20">
          <button
            @click="emit('submit')"
            :disabled="isSubmitting"
            class="flex-[2] flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-2xl font-black shadow-lg shadow-green-200 hover:bg-green-600 transition-all active:scale-95 text-[15px] disabled:opacity-50"
          >
            <div
              v-if="isSubmitting"
              class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></div>
            <template v-else>
              <BaseIcon name="whatsapp" class="w-6 h-6 fill-current" />
              {{ $t("cart.confirm_whatsapp") }}
            </template>
          </button>
          <button
            @click="emit('close')"
            class="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black border border-gray-100 hover:bg-gray-100 transition-all text-[15px]"
          >
            {{ $t("common.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface DeliveryArea {
  name: string
  price: number
}

interface PaymentMethodOption {
  id: string
  name: string
  logo: string
  value: string
  label: string
  instruction: string
}

interface CustomerForm {
  name: string
  phone: string
  method: string
  addressDetail: string
  paymentMethod: string
}

const props = defineProps<{
  open: boolean
  primaryColor: string
  phoneNumberEnabled: boolean
  deliveryAreas: DeliveryArea[]
  selectedDeliveryArea: DeliveryArea | null
  customerForm: CustomerForm
  availablePaymentMethods: PaymentMethodOption[]
  selectedPaymentMethodDetails: PaymentMethodOption | null
  errors: Record<string, string>
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: []
  'update:customerForm': [value: CustomerForm]
  'update:selectedDeliveryArea': [value: DeliveryArea | null]
  clearDeliveryError: []
}>()

const searchQuery = ref('')
const copiedField = ref('')

const filteredAreas = computed(() => {
  if (!props.deliveryAreas || props.deliveryAreas.length === 0) return []
  if (!searchQuery.value) return props.deliveryAreas
  return props.deliveryAreas.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
  )
})

const updateField = (key: keyof CustomerForm, val: string) => {
  emit('update:customerForm', { ...props.customerForm, [key]: val })
}

const copyToClipboard = async (text: string, field: string) => {
  if (!text) return
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    copiedField.value = field
    setTimeout(() => {
      copiedField.value = ''
    }, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}
</script>
