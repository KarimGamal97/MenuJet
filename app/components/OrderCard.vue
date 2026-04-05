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
            #{{ order.id.toString().padStart(4, "0") }}
          </h3>
          <div
            v-if="order.status === 'pending'"
            class="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-orange-100 uppercase tracking-tighter"
          >
            {{ $t("admin.order_status_pending") }}
          </div>
        </div>
      </div>
      <div class="text-left">
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
          <span class="font-bold text-gray-700 text-sm">{{ item.name }}</span>
        </div>
        <span class="font-bold text-gray-900 text-sm">
          {{ item.price * item.quantity }}
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
defineProps({
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
</script>
