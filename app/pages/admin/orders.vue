<template>
  <div class="p-6 space-y-6" dir="rtl">
    <!-- Skeleton while loading -->
    <template v-if="loading">
      <OrdersSkeleton />
    </template>

    <template v-else>
      <div
        class="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center"
          >
            <BaseIcon name="cart" class="w-7 h-7 text-orange-600" />
          </div>
          <h1 class="text-xl font-bold text-gray-800">
            {{ $t("admin.live_orders") }}
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <BaseButton
            v-if="userRole === 'super_admin'"
            variant="ghost"
            icon="trash"
            @click="showCleanupModal = true"
            class="w-11 h-11 !rounded-xl !bg-red-50 !text-red-500 hover:!bg-red-500 hover:!text-white"
          />
        </div>
      </div>

      <!-- Cleanup Center Modal -->
      <BaseModal
        :isOpen="showCleanupModal"
        @close="showCleanupModal = false"
        :title="$t('admin.cleanup_title')"
        :subtitle="$t('admin.cleanup_subtitle')"
      >
        <div class="space-y-3">
          <button
            v-for="opt in cleanupOptions"
            :key="opt.type"
            @click="selectedCleanupType = opt.type"
            :class="[
              'w-full p-4 rounded-2xl border-2 transition-all text-right group flex items-center justify-between',
              selectedCleanupType === opt.type
                ? 'border-orange-500 bg-orange-50/50'
                : 'border-gray-50 bg-gray-50 hover:border-gray-200',
            ]"
          >
            <div>
              <p class="font-bold text-sm text-gray-800">
                {{ $t(opt.labelKey) }}
              </p>
              <p class="text-[10px] text-gray-400 font-bold mt-0.5">
                {{ $t(opt.descKey) }}
              </p>
            </div>
            <div
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
              :class="
                selectedCleanupType === opt.type
                  ? 'border-orange-500 bg-orange-500'
                  : 'border-gray-200 bg-white'
              "
            >
              <div
                v-if="selectedCleanupType === opt.type"
                class="w-2 h-2 bg-white rounded-full"
              ></div>
            </div>
          </button>
        </div>

        <p class="mt-6 text-[10px] text-red-500 font-bold px-1 text-center">
          {{ $t("admin.cleanup_confirm") }}
        </p>

        <template #footer>
          <div class="flex gap-3">
            <BaseButton
              variant="secondary"
              fullWidth
              @click="showCleanupModal = false"
            >
              {{ $t("admin.cancel") }}
            </BaseButton>
            <BaseButton
              variant="danger"
              fullWidth
              :loading="isCleaning"
              :disabled="!selectedCleanupType"
              @click="handleCleanup"
            >
              {{ $t("admin.cleanup_btn") }}
            </BaseButton>
          </div>
        </template>
      </BaseModal>

      <div
        v-if="orders.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100"
      >
        <div class="mb-6 text-gray-100">
          <BaseIcon name="boxes" class="w-20 h-20" />
        </div>
        <p class="text-gray-400 font-bold opacity-60">
          {{ $t("admin.no_orders") }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OrderCard
          v-for="order in orders"
          :key="order.id"
          :order="order"
          @update-status="updateOrderStatus"
        />
      </div>

      <!-- Pagination Controls -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-center gap-4 pt-10"
      >
        <BaseButton
          variant="outline"
          size="sm"
          icon="chevron-right"
          :disabled="page === 1"
          @click="changePage(page - 1)"
          class="w-12 h-12 !p-0 !rounded-2xl"
        />

        <div class="flex items-center gap-2">
          <span class="text-sm font-black text-gray-800">{{ page }}</span>
          <span class="text-xs font-bold text-gray-400">/</span>
          <span class="text-sm font-black text-gray-400">{{ totalPages }}</span>
        </div>

        <BaseButton
          variant="outline"
          size="sm"
          icon="chevron-left"
          :disabled="page >= totalPages"
          @click="changePage(page + 1)"
          class="w-12 h-12 !p-0 !rounded-2xl"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin", middleware: "auth" });

const { ownerId, userRole } = useAuthUser();

// Cleanup State
const showCleanupModal = ref(false);
const selectedCleanupType = ref(null);

const cleanupOptions = [
  {
    type: "completed",
    labelKey: "admin.cleanup_completed",
    descKey: "admin.cleanup_subtitle",
  },
  {
    type: "old",
    labelKey: "admin.cleanup_older_than_7",
    descKey: "admin.cleanup_subtitle",
  },
  {
    type: "all",
    labelKey: "admin.cleanup_all",
    descKey: "admin.cleanup_confirm",
  },
];

// Pagination State
const page = ref(1);
const pageSize = ref(15);

const {
  orders,
  totalOrders,
  loading,
  fetchOrders,
  updateOrderStatus,
  cleanupOrders,
  setupRealtimeOrders,
  stopRealtimeOrders,
} = useOrders();

const totalPages = computed(() =>
  Math.ceil(totalOrders.value / pageSize.value),
);

const changePage = (newPage) => {
  page.value = newPage;
  if (ownerId.value) fetchOrders(ownerId.value, page.value, pageSize.value);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Handle Cleanup
const handleCleanup = async () => {
  if (!ownerId.value || !selectedCleanupType.value) return;

  const success = await cleanupOrders(ownerId.value, selectedCleanupType.value);
  if (success) {
    showCleanupModal.value = false;
    page.value = 1;
    await fetchOrders(ownerId.value, page.value, pageSize.value);
  }
};

const playNotificationSound = () => {
  const audio = new Audio("/notification.mp3");
  audio.play().catch((e) => console.warn("🔊 Sound blocked by browser"));
};

// 3. The Activation Logic
watch(
  ownerId,
  async (newId) => {
    if (newId) {
      await fetchOrders(newId, page.value, pageSize.value);
      setupRealtimeOrders(newId, playNotificationSound);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  stopRealtimeOrders();
});
</script>
