<template>
  <div
    :class="[
      'p-5 md:p-6 rounded-3xl border-2 transition-all duration-500 flex flex-col h-[470px]',
      order.status === 'pending'
        ? 'bg-white border-orange-200 shadow-xl shadow-orange-100'
        : 'bg-green-50/10 border-green-500/20 opacity-80 shadow-none',
    ]"
  >
    <!-- 1. Header: Order ID + Status + Time + Actions -->
    <div class="flex justify-between items-center pb-2.5 border-b border-gray-100/80 mb-2.5 shrink-0 gap-3">
      <!-- Order ID & Pending Status -->
      <div class="flex items-center gap-2">
        <h3 class="text-2xl font-black text-orange-600 leading-none">
          #{{ formatOrderNumber(order.order_number || order.id) }}
        </h3>
        <div
          v-if="order.status === 'pending'"
          class="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-orange-100 uppercase tracking-tighter shrink-0"
        >
          {{ $t("admin.order_status_pending") }}
        </div>
      </div>

      <!-- Time & Quick Actions -->
      <div class="flex items-center gap-1.5 shrink-0">
        <span
          v-if="order.status === 'pending' && !isOldOrder"
          class="text-[10px] font-black text-white px-2.5 py-1 rounded-full shadow-xs whitespace-nowrap shrink-0 inline-flex items-center justify-center leading-none bg-orange-500 shadow-orange-100 animate-pulse"
        >
          {{ timeAgo }}
        </span>
        <span
          v-else-if="order.status === 'pending'"
          class="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0"
        >
          {{ formattedOrderTime }}
        </span>
        <button 
          @click="printOrder"
          class="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors shrink-0"
          title="طباعة الطلب"
        >
          <BaseIcon name="print" class="w-4 h-4" />
        </button>
        <button
          v-if="order.status === 'pending'"
          @click="openEditModal"
          class="p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors shrink-0"
          :title="$t('admin.edit_order_btn')"
        >
          <BaseIcon name="edit" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- 2. Compact Metadata Section (Two badges per row) -->
    <div class="space-y-1.5 mb-3 shrink-0 text-xs">
      <!-- Row 1: Order Type + Payment Method -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Order type badge -->
        <div
          :class="[
            'text-[10px] font-black px-2.5 py-1 rounded-xl border flex items-center gap-1 shrink-0',
            orderTypeBadge.classes,
          ]"
        >
          <BaseIcon
            v-if="orderTypeBadge.icon"
            :name="orderTypeBadge.icon"
            class="w-3 h-3 fill-current"
          />
          <span>{{ orderTypeBadge.label }}</span>
        </div>

        <!-- Online payment method badge -->
        <div
          v-if="paymentBadge"
          :class="[
            'text-[10px] font-black px-2.5 py-1 rounded-xl border flex items-center gap-1 shrink-0',
            paymentBadge.classes,
          ]"
        >
          <span>💳 {{ paymentBadge.label }}</span>
        </div>

        <!-- Table or floor number if provided -->
        <div v-if="order.table_number" class="flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100 text-[10px] font-black text-blue-600 shrink-0">
          <span>ترابيزة {{ order.table_number }}</span>
        </div>
        <div v-if="order.queue_number" class="flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-100 text-[10px] font-black text-purple-600 shrink-0">
          <span>{{ order.queue_number }}</span>
        </div>
      </div>

      <!-- Row 2: Customer Name + Phone Number -->
      <div v-if="order.customer_name || order.customer_phone" class="flex items-center gap-2 flex-wrap">
        <div
          v-if="order.customer_name"
          class="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 shrink-0 max-w-[55%] truncate"
        >
          <span class="text-gray-400 font-normal">العميل:</span>
          <span class="truncate">{{ order.customer_name }}</span>
        </div>

        <div
          v-if="order.customer_phone"
          class="flex items-center gap-1.5 bg-gray-100/60 px-2.5 py-1 rounded-xl border border-gray-200 text-xs font-black text-gray-700 shrink-0"
        >
          <BaseIcon name="phone" class="w-3.5 h-3.5 text-gray-500" />
          <span dir="ltr">{{ order.customer_phone }}</span>
        </div>
      </div>

      <!-- Row 3: Delivery Address -->
      <div
        v-if="order.delivery_address"
        class="flex items-center gap-1.5 bg-amber-50/80 px-2.5 py-1 rounded-xl border border-amber-200/70 text-[11px] font-bold text-amber-800 w-full"
      >
        <BaseIcon name="map-pin" class="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span class="truncate flex-1">العنوان: {{ order.delivery_address }}</span>
      </div>
    </div>

    <!-- Items List -->
    <div class="space-y-2 mb-3 overflow-y-auto flex-1 pe-1 custom-scrollbar min-h-0">
      <div
        v-for="item in order.items"
        :key="item.id"
        class="flex justify-between items-center bg-gray-50/70 p-3 rounded-2xl border border-gray-100/60 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <span
            class="w-7 h-7 flex items-center justify-center bg-orange-500 text-white rounded-xl text-xs font-black shadow-xs shrink-0"
          >
            {{ item.quantity }}
          </span>
          <span class="flex flex-col leading-tight min-w-0 flex-1">
            <span v-if="item.category" class="text-[10px] text-gray-400 font-bold truncate">{{ item.category }}</span>
            <span class="font-bold text-gray-800 text-sm truncate">
              {{ item.name }}
              <span v-if="item.size" class="text-orange-600 font-semibold text-xs"> ({{ cleanSize(item.size) }})</span>
            </span>
            <div v-if="item.selectedExtras?.length" class="flex flex-wrap gap-1 mt-1">
              <span v-for="ex in item.selectedExtras" :key="ex.name" class="bg-blue-50 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded-lg border border-blue-100">
                + {{ ex.name }}
              </span>
            </div>
            <span v-if="item.notes" class="text-[10px] text-orange-600 font-bold mt-1 bg-orange-100 px-2 py-0.5 rounded-md self-start border border-orange-200">{{ item.notes }}</span>
          </span>
        </div>
        <span class="font-black text-gray-900 text-sm shrink-0 ms-2">
          {{ (item.basePrice || item.price) * item.quantity }}<span v-if="item.selectedExtras?.length" class="text-orange-600"> + {{ (item.price - (item.basePrice || item.price)) * item.quantity }}</span>
          <small class="text-[10px] ms-1 text-gray-500 font-normal">{{ $t("currency") }}</small>
        </span>
      </div>
    </div>

    <!-- Footer Action -->
    <div
      class="flex justify-between items-center border-t border-gray-100 pt-4 shrink-0 mt-auto"
    >
      <div>
        <span class="text-[10px] font-bold text-gray-400 block">{{
          $t("admin.order_total") || "Total Amount"
        }}</span>
        <div class="text-xl font-bold text-gray-800">
          {{ order.total_price }}
          <small class="text-xs">{{ $t("currency") }}</small>
        </div>
      </div>

      <div class="flex gap-2">
        <BaseButton
          v-if="order.status === 'pending'"
          @click="emit('update-status', order.id, 'completed')"
          variant="primary"
          class="!bg-yellow-500 hover:!bg-yellow-600 !shadow-yellow-100"
          icon="chevron-right"
          :loading="loading"
        >
          {{ $t("admin.order_confirm_btn") || "Complete" }}
        </BaseButton>
        <span
          v-else
          class="text-green-600 font-bold bg-green-50 px-5 py-2.5 rounded-2xl text-sm border border-green-100/50"
        >
          {{ $t("admin.order_status_completed") || "Completed" }}
        </span>
      </div>
    </div>

    <!-- Edit Order Modal for Restaurant Owner -->
    <AdminOrdersEditOrderModal
      :open="showEditModal"
      :order="order"
      @close="showEditModal = false"
      @saved="handleOrderSaved"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update-status"]);

const cleanSize = cleanOrderSize;

const orderTypeBadge = computed(() => {
  const method = props.order?.payment_method || "";
  if (method.startsWith("whatsapp_delivery")) {
    return {
      label: "واتساب توصيل",
      icon: "whatsapp",
      classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }
  if (method.startsWith("whatsapp_pickup") || method === "whatsapp") {
    return {
      label: "واتساب كاشير",
      icon: "whatsapp",
      classes: "bg-teal-50 text-teal-700 border-teal-200",
    };
  }
  return {
    label: "كاشير",
    icon: null,
    classes: "bg-gray-100 text-gray-700 border-gray-200",
  };
});

const paymentBadge = computed(() => {
  const method = props.order?.payment_method || "";
  if (method.includes("vodafone")) {
    return {
      label: "فودافون كاش",
      classes: "bg-red-50 text-red-700 border-red-200",
    };
  }
  if (method.includes("instapay")) {
    return {
      label: "إنستا باي",
      classes: "bg-purple-50 text-purple-700 border-purple-200",
    };
  }
  return null;
});

const formattedOrderTime = computed(() => {
  if (!props.order?.created_at) return "";
  const date = new Date(props.order.created_at);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeStr = date.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return timeStr;
  }

  const dateStr = `${date.getDate()}/${date.getMonth() + 1}`;
  return `${dateStr} • ${timeStr}`;
});

const timeAgo = ref("");
const isOldOrder = ref(false);

const calculateTimeAgo = () => {
  const diffMinutes = Math.floor(
    (new Date().getTime() - new Date(props.order.created_at).getTime()) / 60000
  );

  if (diffMinutes < 1) {
    timeAgo.value = "الآن";
    isOldOrder.value = false;
  } else if (diffMinutes === 1) {
    timeAgo.value = "منذ دقيقة";
    isOldOrder.value = false;
  } else if (diffMinutes === 2) {
    timeAgo.value = "منذ دقيقتين";
    isOldOrder.value = false;
  } else if (diffMinutes <= 10) {
    timeAgo.value = `منذ ${diffMinutes} دقائق`;
    isOldOrder.value = false;
  } else if (diffMinutes < 60) {
    timeAgo.value = `منذ ${diffMinutes} دقيقة`;
    isOldOrder.value = false;
  } else {
    const hours = Math.floor(diffMinutes / 60);
    const remMinutes = diffMinutes % 60;

    if (hours >= 3) {
      timeAgo.value = "";
      isOldOrder.value = true;
    } else if (hours === 1) {
      timeAgo.value = remMinutes > 0 ? `منذ ساعة و ${remMinutes} د` : "منذ ساعة";
      isOldOrder.value = false;
    } else if (hours === 2) {
      timeAgo.value = remMinutes > 0 ? `منذ ساعتين و ${remMinutes} د` : "منذ ساعتين";
      isOldOrder.value = false;
    }
  }
};

let timer;
onMounted(() => {
  calculateTimeAgo();
  timer = setInterval(calculateTimeAgo, 60000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const printOrder = () => {
  printOrderReceipt(props.order, orderTypeBadge.value.label, paymentBadge.value?.label);
};

const showEditModal = ref(false);

const openEditModal = () => {
  showEditModal.value = true;
};

const handleOrderSaved = ({ items, total_price }) => {
  props.order.items = items;
  props.order.total_price = total_price;
};
</script>
