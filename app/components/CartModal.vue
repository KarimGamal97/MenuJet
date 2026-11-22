<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center brand-theme-scope"
      :style="{ '--p-color': primaryColor }"
    >
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="handleCloseCart"
      />

      <div
        class="relative w-full sm:max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl z-10 max-h-[90vh] flex flex-col"
      >
        <div class="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 class="text-xl font-black text-gray-800 flex items-center gap-2">
            <BaseIcon :name="editingOrder ? 'edit' : 'cart'" class="w-6 h-6 text-orange-600" />
            <span v-if="editingOrder">{{ locale === 'ar' ? `تعديل الطلب #${editingOrder.id}` : `Edit Order #${editingOrder.id}` }}</span>
            <span v-else>{{ $t("cart.title") }}</span>
          </h2>
          <button
            @click="handleCloseCart"
            class="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors font-bold text-lg cursor-pointer"
          >
            <BaseIcon name="close" class="w-5 h-5" />
          </button>
        </div>

        <!-- Banner when editing existing order -->
        <div v-if="editingOrder" class="mx-6 mb-2 p-3 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between gap-2 animate-in fade-in duration-300">
          <div class="flex items-center gap-2 text-xs font-bold text-orange-900">
            <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse shrink-0"></span>
            <span>{{ locale === 'ar' ? `تعديل أصناف الطلب #${editingOrder.id}` : `Editing items for order #${editingOrder.id}` }}</span>
          </div>
          <button
            type="button"
            @click="cancelEditingOrder(); clearCart(); emit('close');"
            class="text-[10px] font-black text-orange-700 bg-white border border-orange-200 px-2.5 py-1 rounded-xl hover:bg-orange-100 transition-colors shrink-0 cursor-pointer"
          >
            {{ locale === 'ar' ? 'إلغاء' : 'Cancel' }}
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-3 space-y-3">
          <div v-if="cart.length === 0" class="text-center py-14">
            <div class="flex justify-center mb-6">
              <BaseIcon name="empty" class="w-20 h-20 text-gray-100" />
            </div>
            <p class="text-gray-400 font-bold">{{ $t("cart.empty") }}</p>
          </div>

          <CartItemRow
            v-for="item in cart"
            :key="item.cartId || item.id"
            :item="item"
            @increase="increaseQty(item.cartId || item.id)"
            @decrease="decreaseQty(item.cartId || item.id)"
          />
        </div>

        <div class="px-6 py-5 border-t border-gray-100 space-y-3">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-500 font-bold">{{ $t("common.total") }}</span>
            <span class="text-orange-600 font-black text-xl"
              >{{ totalPrice }} {{ $t("currency") }}</span
            >
          </div>

          <div class="flex gap-3" v-if="cart.length > 0">
            <button
              v-if="whatsappOrderingEnabled !== false"
              @click="openWhatsappCheckout"
              :class="[
                'flex items-center justify-center gap-2 py-4 bg-white text-green-600 border border-gray-300 rounded-2xl font-black shadow-sm hover:shadow-md transition-all active:scale-95',
                cashierOrderingEnabled !== false ? 'flex-1 text-[12px]' : 'w-full text-sm'
              ]"
            >
              <BaseIcon name="whatsapp" class="w-5 h-5 fill-current" />
              {{ $t("cart.order_whatsapp") }}
            </button>

            <button
              v-if="cashierOrderingEnabled !== false"
              @click="openCashierCheckout"
              :disabled="isSubmitting"
              :class="[
                'flex items-center justify-center py-4 bg-gray-900 text-white rounded-2xl font-black disabled:opacity-50 transition-all active:scale-95',
                whatsappOrderingEnabled !== false ? 'flex-1 text-[12px]' : 'w-full text-sm'
              ]"
            >
              <div
                v-if="isSubmitting"
                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></div>
              <span v-else>{{ $t("cart.order_cashier") }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <CartCashierSuccessModal
    :open="showCashierModal"
    :primaryColor="primaryColor"
    :orderNumber="orderNumber"
    @close="closeCashierModal"
  />

  <!-- Cashier Checkout Modal -->
  <CartCashierCheckoutModal
    v-model:cashierPhone="cashierPhone"
    v-model:tableNumber="tableNumber"
    v-model:queueNumber="queueNumber"
    :open="showCashierCheckout"
    :phoneNumberEnabled="phoneNumberEnabled"
    :tableNumberEnabled="tableNumberEnabled"
    :queueNumberEnabled="queueNumberEnabled"
    :errors="errors"
    :isSubmitting="isSubmitting"
    @close="showCashierCheckout = false"
    @submit="placeCashierOrder"
  />

  <!-- Whatsapp Checkout Modal -->
  <CartWhatsappCheckoutModal
    v-model:customerForm="customerForm"
    v-model:selectedDeliveryArea="selectedDeliveryArea"
    :open="showWhatsappCheckout"
    :primaryColor="primaryColor"
    :phoneNumberEnabled="phoneNumberEnabled"
    :deliveryAreas="deliveryAreas"
    :availablePaymentMethods="availablePaymentMethods"
    :selectedPaymentMethodDetails="selectedPaymentMethodDetails"
    :errors="errors"
    :isSubmitting="isSubmitting"
    @close="showWhatsappCheckout = false"
    @submit="handleWhatsappOrderFinal"
    @clearDeliveryError="errors.deliveryArea = ''"
  />
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  whatsappNumber: { type: String, default: "" },
  restaurantUserId: { type: String, default: "" },
  restaurantSlug: { type: String, default: "" },
  deliveryAreas: { type: Array, default: () => [] },
  tableNumberEnabled: { type: Boolean, default: false },
  queueNumberEnabled: { type: Boolean, default: false },
  whatsappOrderingEnabled: { type: Boolean, default: true },
  cashierOrderingEnabled: { type: Boolean, default: true },
  phoneNumberEnabled: { type: Boolean, default: true },
  paymentMethodsAllowed: { type: String, default: "all" },
  vodafoneCashNumber: { type: String, default: "" },
  instapayAccount: { type: String, default: "" },
  primaryColor: { type: String, default: "#ea580c" },
});

const emit = defineEmits(["close"]);

const {
  locale,
  cart,
  increaseQty,
  decreaseQty,
  totalPrice,
  clearCart,
  editingOrder,
  cancelEditingOrder,
  handleCloseCart,
  showCashierModal,
  showWhatsappCheckout,
  showCashierCheckout,
  isSubmitting,
  orderNumber,
  cashierPhone,
  tableNumber,
  queueNumber,
  selectedDeliveryArea,
  customerForm,
  availablePaymentMethods,
  selectedPaymentMethodDetails,
  errors,
  openCashierCheckout,
  placeCashierOrder,
  openWhatsappCheckout,
  handleWhatsappOrderFinal,
  closeCashierModal,
} = useCartCheckout(props, () => emit("close"));
</script>
