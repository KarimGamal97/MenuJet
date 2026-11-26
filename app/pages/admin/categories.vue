<template>
  <div class="max-w-3xl mx-auto py-4 md:py-8" dir="rtl">
    <div class="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-50">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
            <BaseIcon name="list" class="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-800">
              {{ $t("admin.categories_page_title") }}
            </h2>
            <p class="text-sm text-gray-400 font-bold mt-1">
              {{ $t("admin.categories_page_subtitle") }}
            </p>
          </div>
        </div>

        <NuxtLink
          to="/admin/menu"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 text-xs font-black transition-all shrink-0"
        >
          <BaseIcon name="clipboard-list" class="w-4 h-4" />
          <span>{{ $t("admin.go_to_items") }}</span>
        </NuxtLink>
      </div>

      <!-- Auto-save hint -->
      <div class="mb-4 px-3.5 py-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-700 text-xs font-bold inline-flex items-center gap-2">
        <BaseIcon name="check-circle" solid class="w-4 h-4 text-emerald-500 shrink-0" />
        <span>{{ $t("admin.categories_autosave_note") }}</span>
      </div>

      <!-- Categories Manager -->
      <AdminSettingsCategoriesCard
        v-model:newCategory="newCategory"
        v-model:editingName="editingCategoryName"
        :categories="form.categories"
        :maxCategories="maxCategories"
        :isCategoryLimitReached="isCategoryLimitReached"
        :isPlanFree="isFree"
        :loading="profileLoading || !profile"
        :editingIndex="editingCategoryIndex"
        @add="addCategory"
        @move="moveCategory"
        @startEdit="startEditCategory"
        @saveEdit="saveCategoryName"
        @cancelEdit="cancelEditCategory"
        @remove="initiateRemoveCategory"
        @openUpgrade="openUpgradeForCategories"
      />
    </div>

    <!-- Delete Category Confirmation Modal -->
    <BaseModal
      :isOpen="showDeleteCategoryModal"
      @close="showDeleteCategoryModal = false"
      :title="$t('admin.delete_category_title')"
      :subtitle="$t('admin.delete_category_subtitle')"
      icon="trash"
      iconColor="bg-red-50 text-red-600"
      :showClose="false"
      max-width="max-w-sm"
    >
      <template #footer>
        <div class="flex gap-3">
          <BaseButton variant="secondary" fullWidth @click="showDeleteCategoryModal = false">
            {{ $t("common.cancel") }}
          </BaseButton>
          <BaseButton variant="danger" fullWidth @click="confirmRemoveCategory">
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
      :currentCount="form.categories.length"
      :maxCount="maxCategories"
      :businessName="form.business_name || profile?.business_name || ''"
      @close="showUpgradeModal = false"
    />
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin", middleware: "auth" });

const {
  profile,
  profileLoading,
  isFree,
  form,
  showUpgradeModal,
  upgradeModalConfig,
  openUpgradeForCategories,
  maxCategories,
  isCategoryLimitReached,
  newCategory,
  editingCategoryIndex,
  editingCategoryName,
  showDeleteCategoryModal,
  addCategory,
  startEditCategory,
  cancelEditCategory,
  saveCategoryName,
  moveCategory,
  initiateRemoveCategory,
  confirmRemoveCategory,
} = useSettingsForm();
</script>
