<template>
  <div class="space-y-6" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Page Header -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 md:p-6 rounded-[2rem] shadow-xs border border-gray-100 gap-4"
    >
      <div class="flex items-center gap-3.5">
        <div
          class="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
        >
          <BaseIcon name="crown" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl md:text-2xl font-black text-gray-900">
            {{ $t("platform.title") }}
          </h1>
          <p class="text-gray-400 text-xs md:text-sm font-medium mt-0.5">
            {{ $t("platform.subtitle") }}
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="fetchRestaurants"
        :disabled="loading"
        class="px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50"
      >
        {{ loading ? $t("platform.refreshing") : $t("platform.refresh") }}
      </button>
    </div>

    <!-- Stats Summary -->
    <PlatformStatsRow :stats="stats" />

    <!-- Restaurants Management Table -->
    <PlatformRestaurantsTable
      v-model:searchQuery="searchQuery"
      v-model:statusFilter="statusFilter"
      v-model:planFilter="planFilter"
      :restaurants="filteredRestaurants"
      :loading="loading"
      :saving="saving"
      :getDaysRemaining="getDaysRemaining"
      :getRestaurantStatus="getRestaurantStatus"
      :getDisplayName="getDisplayName"
      @renew="openRenewModal"
      @toggle-active="toggleActiveStatus"
      @toggle-clients="toggleShowInClients"
      @toggle-demo="toggleIsDemo"
      @delete="openDeleteModal"
    />

    <!-- Renew / Edit Subscription Modal -->
    <PlatformRenewSubscriptionModal
      :open="showRenewModal"
      :saving="saving"
      :restaurant="selectedRestaurant"
      :displayName="getDisplayName(selectedRestaurant)"
      @close="showRenewModal = false"
      @save="handleSaveSubscription"
    />

    <!-- Reuse Delete Confirmation Modal -->
    <AdminUsersDeleteUserModal
      :show="showDeleteModal"
      :deleting="deleting"
      :displayName="getDisplayName(restaurantToDelete)"
      @close="showDeleteModal = false"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { PlatformRestaurant } from "~/composables/usePlatformRestaurants";

definePageMeta({
  middleware: "superadmin",
  layout: "admin",
});

const {
  filteredRestaurants,
  stats,
  loading,
  saving,
  deleting,
  searchQuery,
  statusFilter,
  planFilter,
  getDaysRemaining,
  getRestaurantStatus,
  getDisplayName,
  fetchRestaurants,
  updateSubscription,
  toggleActiveStatus,
  toggleShowInClients,
  toggleIsDemo,
  deleteRestaurant,
} = usePlatformRestaurants();

const showRenewModal = ref(false);
const selectedRestaurant = ref<PlatformRestaurant | null>(null);

const showDeleteModal = ref(false);
const restaurantToDelete = ref<PlatformRestaurant | null>(null);

const openRenewModal = (r: PlatformRestaurant) => {
  selectedRestaurant.value = r;
  showRenewModal.value = true;
};

const handleSaveSubscription = async (payload: {
  plan_id: string;
  subscription_status: string;
  subscription_end_date: string | null;
  show_in_clients: boolean;
  is_demo: boolean;
}) => {
  if (!selectedRestaurant.value) return;
  const ok = await updateSubscription(selectedRestaurant.value.id, payload);
  if (ok) {
    showRenewModal.value = false;
  }
};

const openDeleteModal = (r: PlatformRestaurant) => {
  restaurantToDelete.value = r;
  showDeleteModal.value = true;
};

const handleConfirmDelete = async () => {
  if (!restaurantToDelete.value) return;
  const ok = await deleteRestaurant(restaurantToDelete.value.id);
  if (ok) {
    showDeleteModal.value = false;
    restaurantToDelete.value = null;
  }
};

onMounted(() => {
  fetchRestaurants();
});
</script>
