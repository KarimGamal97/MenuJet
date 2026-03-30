<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      @click.self="$emit('close')"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="$emit('close')"
      />

      <!-- Modal Sheet -->
      <div
        class="relative w-full sm:max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl z-10 max-h-[90vh] flex flex-col"
      >
        <!-- Handle bar (mobile) -->
        <div class="flex justify-center pt-4 pb-2 sm:hidden">
          <div class="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-6 pt-4 pb-2">
          <h2 class="text-xl font-black text-gray-800">🛒 طلبك</h2>
          <button
            @click="$emit('close')"
            class="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors font-bold text-lg"
          >×</button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto px-6 py-3 space-y-3">
          <!-- Empty State -->
          <div v-if="cart.length === 0" class="text-center py-14">
            <div class="text-5xl mb-3">🍽️</div>
            <p class="text-gray-400 font-bold">سلة الطلبات فارغة</p>
          </div>

          <!-- Item Rows -->
          <div
            v-for="item in cart"
            :key="item.id"
            class="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl"
          >
            <!-- Image -->
            <div class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
              <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" />
              <span v-else class="text-xl">🍽️</span>
            </div>

            <!-- Info -->
            <div class="flex-grow min-w-0">
              <p class="font-bold text-gray-800 text-sm truncate">{{ item.name }}</p>
              <p class="text-orange-600 font-black text-sm mt-0.5">
                {{ item.price * item.quantity }}
                <span class="text-[10px] font-bold opacity-70">{{ $t("currency") }}</span>
              </p>
            </div>

            <!-- Qty Controls -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                @click="decreaseQty(item.id)"
                class="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 font-black hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all text-sm"
              >−</button>
              <span class="text-sm font-black text-gray-800 w-4 text-center">{{ item.quantity }}</span>
              <button
                @click="increaseQty(item.id)"
                class="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center font-black hover:bg-orange-600 transition-all text-sm"
              >+</button>
            </div>
          </div>
        </div>

        <!-- Footer: Total + Actions -->
        <div class="px-6 py-5 border-t border-gray-100 space-y-3">
          <!-- Total Row -->
          <div class="flex justify-between items-center">
            <span class="text-gray-500 font-bold text-sm">الإجمالي</span>
            <span class="text-orange-600 font-black text-xl">
              {{ totalPrice }} {{ $t("currency") }}
            </span>
          </div>

          <!-- Order Buttons -->
          <div class="flex flex-col gap-3 pt-1" v-if="cart.length > 0">
            <!-- WhatsApp Order -->
            <a
              :href="whatsappLink"
              target="_blank"
              @click="clearCart(); $emit('close')"
              class="w-full flex items-center justify-center gap-3 py-4 bg-green-500 text-white rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-600 active:scale-95 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.672 1.433 5.66 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              اطلب عبر واتساب
            </a>

            <!-- Cashier Order -->
            <button
              @click="clearCart(); $emit('close')"
              class="w-full flex items-center justify-center gap-3 py-4 bg-gray-900 text-white rounded-2xl font-black shadow-lg hover:bg-gray-800 active:scale-95 transition-all"
            >
              🏪 اطلب عند الكاشير
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  whatsappNumber: { type: String, default: '' }
})

defineEmits(['close'])

const { cart, increaseQty, decreaseQty, totalPrice, clearCart } = useCart()

const whatsappLink = computed(() => {
  const items = cart.value
    .map((i) => `• ${i.name} x${i.quantity} = ${i.price * i.quantity} ${useI18n().t('currency')}`)
    .join('\n')
  const msg = `طلب جديد:\n${items}\n\nالإجمالي: ${totalPrice.value} ${useI18n().t('currency')}`
  return `https://wa.me/${props.whatsappNumber}?text=${encodeURIComponent(msg)}`
})
</script>
