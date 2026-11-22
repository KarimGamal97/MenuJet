<template>
  <div class="space-y-6" dir="rtl">
    <!-- Skeleton -->
    <template v-if="itemsPending">
      <AdminSkeleton />
    </template>

    <!-- Dashboard Content  -->
    <template v-else>
      <!-- Delete Confirmation Modal -->
      <BaseModal
        :isOpen="showDeleteModal"
        @close="showDeleteModal = false"
        :title="$t('admin.delete_confirm_title')"
        :subtitle="$t('admin.delete_confirm_msg')"
        icon="trash"
        iconColor="bg-red-50 text-red-600"
        :showClose="false"
        max-width="max-w-sm"
      >
        <template #footer>
          <div class="flex gap-3">
            <BaseButton
              variant="secondary"
              fullWidth
              @click="showDeleteModal = false"
            >
              {{ $t("common.cancel") }}
            </BaseButton>
            <BaseButton variant="danger" fullWidth @click="confirmDelete">
              {{ $t("common.confirm_delete") }}
            </BaseButton>
          </div>
        </template>
      </BaseModal>

      <!-- Upgrade Plan Modal -->
      <UpgradeModal
        :isOpen="showUpgradeModal"
        :limitType="upgradeModalConfig.limitType"
        :title="upgradeModalConfig.title"
        :badgeText="upgradeModalConfig.badgeText"
        :message="upgradeModalConfig.message"
        :currentCount="items?.length || 0"
        :maxCount="maxItems"
        :businessName="profile?.business_name || profile?.business_name_ar || ''"
        @close="showUpgradeModal = false"
      />

      <div
        class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 md:p-6 rounded-3xl shadow-sm gap-4"
      >
        <div class="flex items-center gap-3">
          <h2 class="text-xl md:text-2xl font-bold text-gray-800">
            {{ $t("admin.menu_title") }}
            <span
              class="text-orange-600 bg-orange-50 px-3 py-1 rounded-xl text-sm md:text-base ml-2 font-black"
            >
              {{ items?.length || 0 }} / {{ maxItems === -1 ? '∞' : maxItems }}
            </span>
          </h2>

          <button
            v-if="isItemLimitReached || isPlanFree"
            @click="showUpgradeModal = true"
            class="inline-flex items-center gap-1 text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <BaseIcon name="bolt" class="w-3.5 h-3.5" />
            {{ $t("plans.upgrade_btn") }}
          </button>
        </div>

        <div class="flex gap-3 w-full sm:w-auto">
          <BaseButton
            variant="primary"
            icon="plus"
            @click="openAddModal"
            class="flex-1 sm:flex-none sm:w-auto"
          >
            {{ $t("admin.add_item") }}
          </BaseButton>
          <BaseButton
            v-if="profile?.slug"
            variant="outline"
            icon="journal"
            @click="navigateToMenu"
            class="flex-1 sm:flex-none sm:w-auto"
          >
            {{ $t("admin.view_menu") }}
          </BaseButton>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="flex flex-col gap-4">
        <div class="relative w-full">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('admin.search_placeholder')"
            class="w-full p-4 pr-12 bg-white rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
          />
          <BaseIcon
            name="search"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30"
          />
        </div>

        <!-- Categories Row with Navigation Arrows -->
        <div class="flex items-center gap-2 w-full">
          <!-- Scroll Arrow Right (Scrolls back right in RTL) -->
          <button
            v-if="hasScrollOverflow"
            type="button"
            @click="scrollCategories('right')"
            :disabled="!canScrollRight"
            :class="[
              'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all border shadow-xs',
              canScrollRight
                ? 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border-gray-100 cursor-pointer active:scale-95'
                : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed opacity-40'
            ]"
            aria-label="Scroll right"
          >
            <BaseIcon name="chevron-right" class="w-4 h-4" />
          </button>

          <!-- Categories Container -->
          <div
            ref="categoriesContainer"
            @scroll="checkCategoryScroll"
            class="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1 px-1 min-w-0 scroll-smooth"
          >
            <!-- Skeleton Loading for Categories (Shown while loading OR before profile exists) -->
            <template v-if="profileLoading || !profile">
              <div
                v-for="i in 4"
                :key="i"
                class="w-24 h-12 bg-gray-200 animate-pulse rounded-2xl shrink-0"
              ></div>
            </template>

            <template v-else>
              <button
                v-for="(cat, index) in dynamicCategories"
                :key="index"
                @click="selectCategory(cat, $event)"
                :class="[
                  'px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap text-sm md:text-base shrink-0 cursor-pointer active:scale-95',
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-100'
                    : 'bg-white text-gray-400 hover:bg-orange-50 hover:text-orange-600',
                ]"
              >
                {{ cat }}
              </button>
            </template>
          </div>

          <!-- Scroll Arrow Left (Scrolls forward left in RTL) -->
          <button
            v-if="hasScrollOverflow"
            type="button"
            @click="scrollCategories('left')"
            :disabled="!canScrollLeft"
            :class="[
              'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all border shadow-xs',
              canScrollLeft
                ? 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border-gray-100 cursor-pointer active:scale-95'
                : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed opacity-40'
            ]"
            aria-label="Scroll left"
          >
            <BaseIcon name="chevron-left" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Items List / Skeleton -->
      <template v-if="itemsPending">
        <div class="flex flex-row flex-wrap gap-4">
          <div
            v-for="i in 6"
            :key="i"
            class="w-full md:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] h-32 bg-white rounded-3xl border border-gray-100 p-4 flex items-center gap-4 animate-pulse"
          >
            <div class="w-20 h-20 bg-gray-100 rounded-2xl shrink-0"></div>
            <div class="flex-1 space-y-3">
              <div class="h-4 bg-gray-100 rounded-full w-3/4"></div>
              <div class="h-3 bg-gray-100 rounded-full w-1/2"></div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="filteredItems.length > 0">
        <div class="flex flex-row flex-wrap gap-4">
          <MenuItemCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            :is-admin="true"
            :user-role="userRole"
            @edit="openEditModal"
            @delete="canManageRestaurantRole(userRole) ? initiateDelete($event) : null"
            class="w-full md:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
          />
        </div>
      </template>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-100"
      >
        <div class="mb-4 flex justify-center">
          <BaseIcon name="boxes" class="w-16 h-16 opacity-10" />
        </div>
        <p class="text-gray-400 font-bold">{{ $t("admin.no_results") }}</p>
      </div>
    </template>

    <!-- Add / Edit Item Modal -->
    <AdminMenuItemFormModal
      :isOpen="isModalOpen"
      :editingId="editingId"
      :item="newItem"
      :availableCategories="availableCategories"
      :imageUrl="imageUrl"
      :imageUploading="imageUploading"
      :actionLoading="actionLoading"
      :canAllowExtras="can('allow_extras')"
      @close="isModalOpen = false"
      @save="handleSaveItem"
      @uploadFile="handleFileUpload"
      @addExtra="addExtraField"
      @openUpgradeForExtras="openUpgradeForExtras"
    />
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin", middleware: "auth" });

const {
  userRole,
  items,
  itemsPending,
  actionLoading,
  imageUploading,
  profile,
  profileLoading,
  isPlanFree,
  can,
  showUpgradeModal,
  upgradeModalConfig,
  openUpgradeForExtras,
  maxItems,
  isItemLimitReached,
  isModalOpen,
  showDeleteModal,
  editingId,
  imageUrl,
  newItem,
  searchQuery,
  selectedCategory,
  availableCategories,
  dynamicCategories,
  categoriesContainer,
  canScrollLeft,
  canScrollRight,
  hasScrollOverflow,
  scrollCategories,
  checkCategoryScroll,
  selectCategory,
  filteredItems,
  navigateToMenu,
  handleFileUpload,
  openAddModal,
  addExtraField,
  openEditModal,
  handleSaveItem,
  initiateDelete,
  confirmDelete,
} = useAdminMenuPage();
</script>
