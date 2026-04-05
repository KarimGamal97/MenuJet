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
            :key="item.id"
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
              </p>
              <p class="text-orange-600 font-black text-sm mt-0.5">
                {{ item.price * item.quantity }} {{ $t("currency") }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="decreaseQty(item.id)"
                class="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-500 font-black"
              >
                <BaseIcon name="minus" class="w-4 h-4 mx-auto" />
              </button>
              <span class="text-sm font-black text-gray-800 w-4 text-center">{{
                item.quantity
              }}</span>
              <button
                @click="increaseQty(item.id)"
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
            <a
              :href="whatsappLink"
              target="_blank"
              @click="handleWhatsappOrder"
              class="flex-1 flex items-center justify-center py-4 bg-green-500 text-white rounded-2xl font-black text-[12px]"
            >
              {{ $t("cart.order_whatsapp") }}
            </a>

            <button
              @click="placeCashierOrder"
              :disabled="isSubmitting"
              class="flex-1 flex items-center justify-center py-4 bg-gray-900 text-white rounded-2xl font-black disabled:opacity-50 text-[12px]"
            >
              <div
                v-if="isSubmitting"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></div>
              <span v-else>{{ $t("cart.order_cashier") }}</span>
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
</template>

<script setup>
import { toast } from "vue-sonner";

const props = defineProps({
  isOpen: Boolean,
  whatsappNumber: { type: String, default: "" },
  restaurantUserId: { type: String, default: "" },
});

const emit = defineEmits(["close"]);

const { t } = useI18n();
const { cart, increaseQty, decreaseQty, totalPrice, clearCart } = useCart();
const { addOrder } = useOrderHistory();
const client = useSupabaseClient();
const route = useRoute();

const showCashierModal = ref(false);
const isSubmitting = ref(false);
const orderNumber = ref("");

const placeCashierOrder = async () => {
  if (cart.value.length === 0 || isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    // Use passed prop if available, otherwise query by slug
    let restaurantUserId = props.restaurantUserId;

    if (!restaurantUserId) {
      const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("user_id")
        .eq("slug", route.params.slug)
        .single();

      if (profileError || !profile) throw new Error("Restaurant not found");
      restaurantUserId = profile.user_id;
    }

    // Insert the Order
    const { data: order, error: orderError } = await client
      .from("orders")
      .insert({
        user_id: restaurantUserId,
        items: cart.value,
        total_price: totalPrice.value,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    // Set the order number FIRST
    const orderNum = order.id.toString().padStart(4, "0");
    orderNumber.value = orderNum;

    // Save to local history
    addOrder({
      id: orderNum,
      items: [...cart.value],
      total: totalPrice.value,
      type: "cashier",
    });

    // Show the confirmation modal
    showCashierModal.value = true;

    // Delay closing the main cart to prevent data loss in UI
    setTimeout(() => {
      clearCart();
      emit("close");
      toast.success(t("cart.order_success"));
    }, 200);
  } catch (err) {
    console.error("Order Error:", err.message);
    toast.error(t("cart.order_error"));
  } finally {
    isSubmitting.value = false;
  }
};

const handleWhatsappOrder = () => {
  // Save to local history before clearing
  addOrder({
    id: "WA-" + Date.now().toString().slice(-4),
    items: [...cart.value],
    total: totalPrice.value,
    type: "whatsapp",
  });

  clearCart();
  emit("close");
};

const closeCashierModal = () => {
  showCashierModal.value = false;
  orderNumber.value = "";
};

const whatsappLink = computed(() => {
  const items = cart.value
    .map(
      (i) =>
        `• ${i.name} x${i.quantity} = ${i.price * i.quantity} ${t("currency")}`,
    )
    .join("\n");
  const msg = `${t("cart.whatsapp_msg_header")}:\n${items}\n\n${t("cart.total")}: ${totalPrice.value} ${t("currency")}`;
  return `https://wa.me/${props.whatsappNumber}?text=${encodeURIComponent(msg)}`;
});
</script>
