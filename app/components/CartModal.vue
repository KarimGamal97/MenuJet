<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="emit('close')"
      />

      <div
        class="relative w-full sm:max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl z-10 max-h-[90vh] flex flex-col"
      >
        <div class="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 class="text-xl font-black text-gray-800 flex items-center gap-2">
            <BaseIcon name="cart" class="w-6 h-6 text-orange-600" />
            {{ $t("cart.title") }}
          </h2>
          <button
            @click="emit('close')"
            class="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors font-bold text-lg"
          >
            <BaseIcon name="close" class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-3 space-y-3">
          <div v-if="cart.length === 0" class="text-center py-14">
            <div class="flex justify-center mb-6">
              <BaseIcon name="empty" class="w-20 h-20 text-gray-100" />
            </div>
            <p class="text-gray-400 font-bold">{{ $t("cart.empty") }}</p>
          </div>

          <div
            v-for="item in cart"
            :key="item.cartId || item.id"
            class="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl"
          >
            <div
              class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center"
            >
              <img
                v-if="item.image"
                :src="item.image"
                class="w-full h-full object-cover"
              />
              <BaseIcon name="heart" class="w-6 h-6 text-gray-400 opacity-20" />
            </div>
            <div class="flex-grow min-w-0">
              <p class="font-bold text-gray-800 text-sm truncate">
                {{ item.name }}
                <span v-if="item.size" class="text-orange-600"
                  >({{ item.size }})</span
                >
              </p>
              <p v-if="item.notes" class="text-xs text-gray-500 truncate mt-0.5">{{ item.notes }}</p>
              <p class="text-orange-600 font-black text-sm mt-0.5">
                {{ item.price * item.quantity }} {{ $t("currency") }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="decreaseQty(item.cartId || item.id)"
                class="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-500 font-black"
              >
                <BaseIcon name="minus" class="w-4 h-4 mx-auto" />
              </button>
              <span class="text-sm font-black text-gray-800 w-4 text-center">{{
                item.quantity
              }}</span>
              <button
                @click="increaseQty(item.cartId || item.id)"
                class="w-7 h-7 rounded-full bg-orange-500 text-white font-black"
              >
                <BaseIcon name="plus" class="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        <div class="px-6 py-5 border-t border-gray-100 space-y-3">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-500 font-bold">{{ $t("cart.total") }}</span>
            <span class="text-orange-600 font-black text-xl"
              >{{ totalPrice }} {{ $t("currency") }}</span
            >
          </div>

          <div class="flex gap-3" v-if="cart.length > 0">
          <button
            @click="openWhatsappCheckout"
            class="flex-1 flex items-center justify-center gap-2 py-4 bg-white text-green-600 border border-gray-300 rounded-2xl font-black text-[12px] shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <BaseIcon name="whatsapp" class="w-5 h-5 fill-current" />
            {{ $t("cart.order_whatsapp") }}
          </button>

            <button
              @click="openCashierCheckout"
              class="flex-1 flex items-center justify-center py-4 bg-gray-900 text-white rounded-2xl font-black text-[12px]"
            >
              <span>{{ $t("cart.order_cashier") }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="showCashierModal"
      class="fixed inset-0 z-[300] flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-md"
        @click="closeCashierModal"
      />

      <div
        class="relative bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl z-10 overflow-hidden"
      >
        <div class="bg-gray-900 px-6 pt-10 pb-12 text-center">
          <div class="flex justify-center mb-6">
            <div
              class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse"
            >
              <BaseIcon name="check" class="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h2 class="text-white font-black text-xl">
            {{ $t("cart.cashier_title") }}
          </h2>
          <p class="text-gray-400 text-sm mt-2">
            {{ $t("cart.cashier_subtitle") }}
          </p>
        </div>

        <div class="flex justify-center -mt-6">
          <div
            class="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-2xl shadow-xl border-4 border-white"
          >
            #{{ orderNumber }}
          </div>
        </div>

        <div class="px-6 py-8">
          <button
            @click="closeCashierModal"
            class="w-full py-4 bg-orange-100 text-orange-600 rounded-2xl font-black hover:bg-orange-200 transition-all"
          >
            {{ $t("cart.close") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Cashier Checkout Modal -->
  <Teleport to="body">
    <div
      v-if="showCashierCheckout"
      class="fixed inset-0 z-[400] flex items-end sm:items-center justify-center sm:p-4"
      dir="rtl"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-md"
        @click="showCashierCheckout = false"
      />

      <div
        class="relative bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-sm shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden"
      >
        <div class="px-6 pt-8 pb-4 border-b border-gray-50">
          <h2 class="text-2xl font-black text-gray-800 mb-1">{{ $t("cart.order_cashier") }}</h2>
          <p class="text-xs text-gray-400 font-bold">{{ $t("cart.checkout_subtitle_cashier") }}</p>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar">
          <div>
            <label :class="['block text-[10px] font-black uppercase tracking-wider mb-2', errors.cashierPhone ? 'text-red-500' : 'text-gray-400']">{{ $t("cart.phone_label") }}</label>
            <input
              v-model="cashierPhone"
              type="tel"
              :placeholder="$t('cart.phone_placeholder')"
              maxlength="12"
              @input="cashierPhone = cashierPhone.replace(/[^0-9]/g, '')"
              :class="['w-full p-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-gray-800 text-sm shadow-sm', errors.cashierPhone ? 'border-red-400 focus:bg-white' : 'border-transparent focus:bg-white focus:border-green-500']"
            />
            <p v-if="errors.cashierPhone" class="text-xs text-red-500 font-bold mt-2 px-1">{{ errors.cashierPhone }}</p>
          </div>
        </div>

        <div class="px-6 py-6 bg-white border-t border-gray-100 flex gap-3 pb-8 sm:pb-6">
          <button
            @click="showCashierCheckout = false"
            class="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black border border-gray-100 hover:bg-gray-100 transition-all"
            :disabled="isSubmitting"
          >
            {{ $t("admin.cancel") }}
          </button>
          <button
            @click="placeCashierOrder"
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

  <!-- Whatsapp Checkout Modal -->
  <Teleport to="body">
    <div
      v-if="showWhatsappCheckout"
      class="fixed inset-0 z-[400] flex items-end sm:items-center justify-center sm:p-4"
      dir="rtl"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-md"
        @click="showWhatsappCheckout = false"
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
            <label :class="['block text-[10px] font-black uppercase tracking-wider mb-2', errors.name ? 'text-red-500' : 'text-gray-400']">{{ $t("cart.name_label") }}</label>
            <input
              v-model="customerForm.name"
              type="text"
              :placeholder="$t('cart.name_placeholder')"
              maxlength="20"
              @input="customerForm.name = customerForm.name.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '')"
              :class="['w-full p-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-gray-800 text-sm shadow-sm', errors.name ? 'border-red-400 focus:bg-white' : 'border-transparent focus:bg-white focus:border-green-500']"
            />
            <p v-if="errors.name" class="text-xs text-red-500 font-bold mt-2 px-1">{{ errors.name }}</p>
          </div>

          <div>
            <label :class="['block text-[10px] font-black uppercase tracking-wider mb-2', errors.phone ? 'text-red-500' : 'text-gray-400']">{{ $t("cart.phone_label") }}</label>
            <input
              v-model="customerForm.phone"
              type="tel"
              :placeholder="$t('cart.phone_placeholder')"
              maxlength="12"
              @input="customerForm.phone = customerForm.phone.replace(/[^0-9]/g, '')"
              :class="['w-full p-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all font-bold text-gray-800 text-sm shadow-sm', errors.phone ? 'border-red-400 focus:bg-white' : 'border-transparent focus:bg-white focus:border-green-500']"
            />
            <p v-if="errors.phone" class="text-xs text-red-500 font-bold mt-2 px-1">{{ errors.phone }}</p>
          </div>
          
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-3 text-right">{{ $t("cart.delivery_method") }}</label>
            <div class="flex gap-3">
              <button 
                @click="customerForm.method = 'توصيل'; selectedDeliveryArea = null;"
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
                @click="customerForm.method = 'استلام من المحل'"
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
                  @click="selectedDeliveryArea = area; errors.deliveryArea = ''"
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
          </div>
        </div>

        <div class="px-8 py-6 bg-white border-t border-gray-100 flex gap-3 pb-10 sm:pb-8 sticky bottom-0 z-20">
          <button
            @click="handleWhatsappOrderFinal"
            class="flex-[2] flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-2xl font-black shadow-lg shadow-green-200 hover:bg-green-600 transition-all active:scale-95 text-[15px]"
          >
            <BaseIcon name="whatsapp" class="w-6 h-6 fill-current" />
            {{ $t("cart.confirm_whatsapp") }}
          </button>
          <button
            @click="showWhatsappCheckout = false"
            class="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black border border-gray-100 hover:bg-gray-100 transition-all text-[15px]"
          >
            {{ $t("admin.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { toast } from "vue-sonner";

const props = defineProps({
  isOpen: Boolean,
  whatsappNumber: { type: String, default: "" },
  restaurantUserId: { type: String, default: "" },
  deliveryAreas: { type: Array, default: () => [] }
});

const emit = defineEmits(["close"]);

const { t } = useI18n();
const { cart, increaseQty, decreaseQty, totalPrice, clearCart } = useCart();
const { addOrder } = useOrderHistory();
const client = useSupabaseClient();
const route = useRoute();

const showCashierModal = ref(false);
const showWhatsappCheckout = ref(false);
const showCashierCheckout = ref(false);
const isSubmitting = ref(false);
const orderNumber = ref("");
const cashierPhone = ref("");
const searchQuery = ref("");
const selectedDeliveryArea = ref(null);

const filteredAreas = computed(() => {
  if (!props.deliveryAreas || props.deliveryAreas.length === 0) return [];
  if (!searchQuery.value) return props.deliveryAreas;
  return props.deliveryAreas.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
  );
});

const customerForm = ref({
  name: "",
  phone: "",
  method: "استلام من المحل"
});

const errors = ref({
  name: "",
  phone: "",
  cashierPhone: "",
  deliveryArea: ""
});

const openCashierCheckout = () => {
  if (cart.value.length === 0) return;
  errors.value.cashierPhone = "";
  cashierPhone.value = "";
  showCashierCheckout.value = true;
};

const placeCashierOrder = async () => {
  if (cart.value.length === 0 || isSubmitting.value) return;

  errors.value.cashierPhone = "";
  let hasError = false;

  const phoneValue = cashierPhone.value.trim();
  if (!phoneValue) {
    errors.value.cashierPhone = t("cart.err_phone_required");
    hasError = true;
  } else if (!/^\d+$/.test(phoneValue)) {
    errors.value.cashierPhone = t("cart.err_phone_numbers");
    hasError = true;
  } else if (phoneValue.length < 8) {
    errors.value.cashierPhone = t("cart.err_phone_length");
    hasError = true;
  }

  if (hasError) return;

  isSubmitting.value = true;

  try {
    let finalRestaurantId = props.restaurantUserId;

    if (!finalRestaurantId) {
      const slug = route.params.slug;
      if (slug) {
        const { data: profile, error: profileError } = await client
          .from("profiles")
          .select("user_id")
          .eq("slug", slug)
          .single();

        if (profile && !profileError) {
          finalRestaurantId = profile.user_id;
        }
      }
    }

    if (!finalRestaurantId) {
      alert(
        "خطأ: لم يتم العثور على كود المطعم (Restaurant ID missing). تأكد من الرابط.",
      );
      isSubmitting.value = false;
      return;
    }

    console.log("الـ ID اللي هيتبعت:", finalRestaurantId);

    const { data: order, error: orderError } = await client
      .from("orders")
      .insert({
        user_id: finalRestaurantId,
        items: cart.value,
        total_price: totalPrice.value,
        status: "pending",
        customer_phone: cashierPhone.value.trim()
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Supabase Insert Error:", orderError);
      alert(
        `عذراً، فشل إرسال الطلب.\nالسبب: ${orderError.message}\nالتفاصيل: ${orderError.hint || "لا يوجد"}`,
      );
      throw orderError;
    }

    const orderNum = order.id.toString().padStart(4, "0");
    orderNumber.value = orderNum;

    addOrder({
      id: orderNum,
      items: [...cart.value],
      total: totalPrice.value,
      type: "cashier",
      customer: { phone: cashierPhone.value.trim() }
    });

    showCashierCheckout.value = false;
    showCashierModal.value = true;

    setTimeout(() => {
      clearCart();
      emit("close");
      toast.success(t("cart.order_success"));
    }, 300);
  } catch (err) {
    console.error("Detailed Order Error:", err);
    toast.error(t("cart.order_error"));
  } finally {
    isSubmitting.value = false;
  }
};

const openWhatsappCheckout = () => {
  errors.value = { name: "", phone: "" };
  showWhatsappCheckout.value = true;
};

const handleWhatsappOrderFinal = () => {
  errors.value = { name: "", phone: "" };
  let hasError = false;

  const nameValue = customerForm.value.name.trim();
  if (!nameValue) {
    errors.value.name = t("cart.err_name_required");
    hasError = true;
  } else if (nameValue.length < 4) {
    errors.value.name = t("cart.err_name_length");
    hasError = true;
  } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(nameValue)) {
    errors.value.name = t("cart.err_name_letters");
    hasError = true;
  }

  const phoneValue = customerForm.value.phone.trim();
  if (!phoneValue) {
    errors.value.phone = t("cart.err_phone_required");
    hasError = true;
  } else if (!/^\d+$/.test(phoneValue)) {
    errors.value.phone = t("cart.err_phone_numbers");
    hasError = true;
  } else if (phoneValue.length < 8) {
    errors.value.phone = t("cart.err_phone_length");
    hasError = true;
  }

  if (customerForm.value.method === "توصيل" && props.deliveryAreas && props.deliveryAreas.length > 0 && !selectedDeliveryArea.value) {
    errors.value.deliveryArea = "يرجى اختيار منطقة التوصيل من القائمة";
    hasError = true;
  }

  if (hasError) return;

  // Save link before state clears
  const link = whatsappLink.value;
  
  // Open WhatsApp in new tab
  window.open(link, '_blank');

  // Save to local history before clearing
  addOrder({
    id: "WA-" + Date.now().toString().slice(-4),
    items: [...cart.value],
    total: totalPrice.value,
    type: "whatsapp",
    customer: { ...customerForm.value }
  });

  // Small delay before clearing Cart to ensure window opens without issues
  setTimeout(() => {
    clearCart();
    showWhatsappCheckout.value = false;
    emit("close");
  }, 200);
};

const closeCashierModal = () => {
  showCashierModal.value = false;
  orderNumber.value = "";
};

const whatsappLink = computed(() => {
  const items = cart.value
    .map(
      (i, index) => {
        let text = `${index + 1}. ${i.name} ${i.size ? `(${i.size})` : ''} x ${i.quantity} = ${i.price * i.quantity} ${t("currency")}`;
        if (i.notes) text += `\n  - ملاحظات: ${i.notes}`;
        return text;
      }
    )
    .join("\n");
    
  let header = t("cart.whatsapp_msg_header");
  if (!header || header === "cart.whatsapp_msg_header") {
    header = "طلب جديد";
  }

  let msgText = `${header}

الاسم: ${customerForm.value.name || "غير محدد"}
الهاتف: ${customerForm.value.phone || "غير محدد"}

تفاصيل الطلب:
${items}
`;

  const baseTotal = totalPrice.value;
  let finalTotalText = `${baseTotal} ${t("admin.currency")}`;

  if (customerForm.value.method === "توصيل" && selectedDeliveryArea.value) {
    msgText += `
📍 الاستلام: توصيل (${selectedDeliveryArea.value.name})
🚚 تكلفة التوصيل: ${selectedDeliveryArea.value.price} ${t("admin.currency")}

💰 الإجمالي النهائي (مع التوصيل): *${baseTotal + Number(selectedDeliveryArea.value.price)} ${t("admin.currency")}*`;
  } else {
    msgText += `
📍 الاستلام: ${customerForm.value.method}

💰 الإجمالي: *${finalTotalText}*`;
  }

  // Use api.whatsapp.com as it is more stable for Web and desktop
  let phoneStr = props.whatsappNumber || '';
  if (phoneStr.startsWith('0') && phoneStr.length === 11) {
    phoneStr = '2' + phoneStr; // Auto append Egypt country code if missing
  }
  phoneStr = phoneStr.replace(/\+/g, '').replace(/\s+/g, '');

  return `https://api.whatsapp.com/send?phone=${phoneStr}&text=${encodeURIComponent(msgText)}`;
});
</script>
