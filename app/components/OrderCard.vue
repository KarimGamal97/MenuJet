<template>
  <div
    :class="[
      'p-6 rounded-3xl border-2 transition-all duration-500 flex flex-col h-full',
      order.status === 'pending'
        ? 'bg-white border-orange-200 shadow-xl shadow-orange-100'
        : 'bg-green-50/10 border-green-500/20 opacity-80 shadow-none',
    ]"
  >
    <div class="flex justify-between items-start mb-4">
      <div>
        <span
          class="text-[10px] uppercase tracking-wider font-bold text-gray-400"
          >{{ $t("admin.order_id") || "Order ID" }}</span
        >
        <div class="flex items-center gap-2">
          <h3 class="text-2xl font-bold text-orange-600">
            #{{ (order.order_number || order.id).toString().padStart(4, "0") }}
          </h3>
          <div
            v-if="order.status === 'pending'"
            class="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-orange-100 uppercase tracking-tighter"
          >
            {{ $t("admin.order_status_pending") }}
          </div>
        </div>
        <div v-if="order.customer_phone" class="mt-1.5 flex items-center gap-1.5 w-fit bg-gray-100/50 px-2.5 py-1 rounded-lg border border-gray-200">
          <BaseIcon name="phone" class="w-3.5 h-3.5 text-gray-500" />
          <span class="text-xs font-black text-gray-600" dir="ltr">{{ order.customer_phone }}</span>
        </div>
        <div class="flex gap-2 mt-1.5 flex-wrap">
          <div v-if="order.table_number" class="flex items-center gap-1.5 w-fit bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
            <span class="text-xs font-black text-blue-600">ترابيزة {{ order.table_number }}</span>
          </div>
          <div v-if="order.queue_number" class="flex items-center gap-1.5 w-fit bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
            <span class="text-xs font-black text-purple-600">{{ order.queue_number }}</span>
          </div>
        </div>
      </div>
      <div class="text-left flex flex-col items-end">
        <span
          class="text-[10px] uppercase tracking-wider font-bold text-gray-400"
          >{{ $t("admin.order_time") || "Time" }}</span
        >
        <p class="text-sm font-bold text-gray-600">
          {{
            new Date(order.created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          }}
        </p>
        <div class="flex items-center gap-2 mt-1">
          <button 
            @click="printOrder"
            class="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors"
            title="طباعة الطلب"
          >
            <BaseIcon name="print" class="w-4 h-4" />
          </button>
          <span v-if="order.status === 'pending'" class="text-[9px] font-black text-white bg-orange-500 px-2 py-0.5 rounded-lg shadow-sm shadow-orange-100 animate-pulse">
            {{ timeAgo === 'الآن' ? 'الآن' : 'منذ ' + timeAgo }}
          </span>
        </div>
      </div>
    </div>

    <!-- Items List -->
    <div class="space-y-2 mb-6 flex-grow">
      <div
        v-for="item in order.items"
        :key="item.id"
        class="flex justify-between items-center bg-gray-50/50 p-3 rounded-2xl"
      >
        <div class="flex items-center gap-2">
          <span
            class="w-6 h-6 flex items-center justify-center bg-orange-100 text-orange-600 rounded-lg text-xs font-bold"
          >
            {{ item.quantity }}
          </span>
          <span class="flex flex-col leading-tight">
            <span v-if="item.category" class="text-[10px] text-gray-400 font-bold">{{ item.category }}</span>
            <span class="font-bold text-gray-700 text-sm">{{ item.name }}<span v-if="item.size"> ({{ item.size }})</span></span>
            <div v-if="item.selectedExtras?.length" class="flex flex-wrap gap-1 mt-1">
              <span v-for="ex in item.selectedExtras" :key="ex.name" class="bg-blue-50 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded-lg border border-blue-100 ">
                + {{ ex.name }}
              </span>
            </div>
            <span v-if="item.notes" class="text-[10px] text-orange-600 font-bold mt-1 bg-orange-100 px-2 py-0.5 rounded-md self-start border border-orange-200">{{ item.notes }}</span>
          </span>
        </div>
        <span class="font-bold text-gray-900 text-sm">
          {{ (item.basePrice || item.price) * item.quantity }}<span v-if="item.selectedExtras?.length" class="text-orange-600"> + {{ (item.price - (item.basePrice || item.price)) * item.quantity }}</span>
          <small class="text-[10px]">{{ $t("currency") }}</small>
        </span>
      </div>
    </div>

    <!-- Footer Action -->
    <div
      class="flex justify-between items-center border-t border-gray-100 pt-4"
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

const timeAgo = ref("");

const calculateTimeAgo = () => {
  const diff = Math.floor(
    (new Date().getTime() - new Date(props.order.created_at).getTime()) / 60000
  );
  if (diff < 1) timeAgo.value = "الآن";
  else if (diff === 1) timeAgo.value = "دقيقة واحدة";
  else if (diff === 2) timeAgo.value = "دقيقتين";
  else if (diff <= 10) timeAgo.value = `${diff} دقائق`;
  else timeAgo.value = `${diff} دقيقة`;
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
  const orderData = props.order;
  const orderNumber = (orderData.order_number || orderData.id).toString().padStart(4, "0");
  const orderTime = new Date(orderData.created_at).toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  
  const itemsHtml = orderData.items.map(item => `
    <div style="border-bottom: 1px dashed #eee; padding: 8px 0;">
      <div style="display: flex; justify-content: space-between; font-weight: bold;">
        <span>${item.quantity}x ${item.name} ${item.size ? `(${item.size})` : ''}</span>
        <span>${(item.basePrice || item.price) * item.quantity} جنيه</span>
      </div>
      ${item.selectedExtras?.length ? `
        <div style="font-size: 11px; color: #666; margin-top: 2px;">
          ${item.selectedExtras.map(ex => `+ ${ex.name}`).join(', ')}
        </div>
      ` : ''}
      ${item.notes ? `
        <div style="font-size: 11px; color: #e67e22; background: #fffcf0; padding: 2px 5px; margin-top: 4px; border-radius: 4px;">
          ملاحظة: ${item.notes}
        </div>
      ` : ''}
    </div>
  `).join('');

  const html = `
    <html dir="rtl">
    <head>
      <title>طلب #${orderNumber}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; line-height: 1.4; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 15px; }
        .order-id { font-size: 24px; font-weight: 900; margin: 5px 0; }
        .info { display: flex; justify-content: space-between; font-size: 13px; color: #666; margin-bottom: 5px; }
        .total { margin-top: 15px; padding-top: 10px; border-top: 2px solid #333; font-size: 20px; font-weight: 900; display: flex; justify-content: space-between; }
        .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #999; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="font-size: 14px; font-weight: bold; color: #e67e22;">MenuJet</div>
        <div class="order-id">رقم الطلب #${orderNumber}</div>
        <div class="info">
          <span>الوقت: ${orderTime}</span>
          ${orderData.customer_phone ? `<span>الهاتف: ${orderData.customer_phone}</span>` : ''}
        </div>
        ${orderData.table_number ? `<div style="font-weight: bold; margin-top: 5px;">طاولة رقم: ${orderData.table_number}</div>` : ''}
      </div>
      
      <div class="items">
        ${itemsHtml}
      </div>
      
      <div class="total">
        <span>الإجمالي:</span>
        <span>${orderData.total_price} جنيه</span>
      </div>
      
      <div class="footer">
        طُبع بواسطة MenuJet
      </div>
      
      <script>
        window.onload = () => {
          window.print();
        };
      <\/script>
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
};
</script>
