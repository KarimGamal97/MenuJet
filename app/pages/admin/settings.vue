<template>
  <div class="max-w-3xl mx-auto py-4 md:py-8" dir="rtl">
    <div class="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-50">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
          <BaseIcon name="settings" class="w-7 h-7 text-orange-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ $t("admin.settings_title") }}</h2>
          <p class="text-sm text-gray-400 font-bold mt-1">{{ $t("admin.settings_subtitle") }}</p>
        </div>
      </div>

      <AdminSettingsPlanBannerCard
        :isFree="isFree"
        :isBasic="isBasic"
        :isPro="isPro"
        :currentPlan="currentPlan"
        @openUpgrade="openUpgradeForFeature"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminSettingsBasicIdentityCard
          :form="form"
          :logoUploading="logoUploading"
          :menuUrl="menuUrl"
          :qrUrl="qrUrl"
          @uploadLogo="uploadLogo"
          @copyUrl="copyMenuUrl"
          @downloadQr="downloadQr"
        />

        <AdminSettingsBrandingColorsCard :form="form" />

        <AdminSettingsShiftsCard
          :shifts="restaurantShiftsList"
          :newShift="newShiftForm"
          @add="handleAddNewShift"
          @remove="handleRemoveShift"
        />

        <AdminSettingsAvailabilityCard
          :form="form"
          :canAllowCustomHours="can('allow_custom_hours')"
          @openUpgrade="openUpgradeForFeature"
        />

        <AdminSettingsStoreFeaturesCard
          :form="form"
          :canAllowTables="can('allow_tables')"
          :canAllowWhatsapp="can('allow_whatsapp_orders')"
          @openUpgrade="openUpgradeForFeature"
        />

        <AdminSettingsBioHubCard
          :form="form"
          :canAllowBioHub="can('allow_bio_hub')"
          @openUpgrade="openUpgradeForFeature"
        />

        <AdminSettingsAnnouncementCard
          :form="form"
          :isPro="isPro"
          @openUpgrade="openUpgradeForFeature"
        />

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

        <AdminSettingsDeliveryAreasCard
          v-model:newArea="newDeliveryArea"
          :canAllowBranches="can('allow_branches')"
          :areas="form.delivery_areas"
          @add="addDeliveryArea"
          @remove="removeDeliveryArea"
          @openUpgrade="openUpgradeForFeature"
        />

        <AdminSettingsElectronicPaymentsCard
          v-model:allowed="form.payment_methods_allowed"
          v-model:vodafoneCashNumber="form.vodafone_cash_number"
          v-model:instapayAccount="form.instapay_account"
          :isPro="isPro"
          @openUpgrade="openUpgradeForFeature"
        />
      </div>

      <div class="mt-10">
        <BaseButton
          variant="primary"
          size="lg"
          fullWidth
          :loading="actionLoading"
          @click="saveSettings"
          class="!font-bold"
        >
          {{ $t("admin.save_settings") }}
        </BaseButton>
      </div>
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
  actionLoading,
  logoUploading,
  isFree,
  isBasic,
  isPro,
  currentPlan,
  can,
  form,
  menuUrl,
  qrUrl,
  copyMenuUrl,
  downloadQr,
  uploadLogo,
  saveSettings,
  showUpgradeModal,
  upgradeModalConfig,
  openUpgradeForCategories,
  openUpgradeForFeature,
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
  newDeliveryArea,
  addDeliveryArea,
  removeDeliveryArea,
  restaurantShiftsList,
  newShiftForm,
  handleAddNewShift,
  handleRemoveShift,
} = useSettingsForm();
</script>
