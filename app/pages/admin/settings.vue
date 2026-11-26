<template>
  <div class="max-w-3xl mx-auto py-4 md:py-8 pb-24" dir="rtl">
    <div class="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-50">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-6">
        <div class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
          <BaseIcon :name="currentSection.icon" class="w-7 h-7 text-orange-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ $t(currentSection.labelKey) }}</h2>
          <p class="text-sm text-gray-400 font-bold mt-1">{{ $t(currentSection.subtitleKey) }}</p>
        </div>
      </div>

      <AdminSettingsPlanBannerCard
        :isFree="isFree"
        :isBasic="isBasic"
        :isPro="isPro"
        :currentPlan="currentPlan"
        @openUpgrade="openUpgradeForFeature"
      />

      <!-- Tab 1: Brand & Look -->
      <div v-show="activeTab === 'identity'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <AdminSettingsAnnouncementCard
          :form="form"
          :isPro="isPro"
          @openUpgrade="openUpgradeForFeature"
        />
      </div>

      <!-- Tab 2: Operations & Orders -->
      <div v-show="activeTab === 'operations'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <AdminSettingsShiftsCard
          :shifts="restaurantShiftsList"
          :newShift="newShiftForm"
          @add="handleAddNewShift"
          @remove="handleRemoveShift"
        />
      </div>

      <!-- Tab 3: Delivery & Payments -->
      <div v-show="activeTab === 'delivery'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <!-- Tab 4: Bio Hub & Contact -->
      <div v-show="activeTab === 'biohub'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminSettingsBioHubCard
          :form="form"
          :canAllowBioHub="can('allow_bio_hub')"
          @openUpgrade="openUpgradeForFeature"
        />
      </div>

      <!-- Sticky Save Bar -->
      <div class="sticky bottom-3 z-30 mt-8 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl border border-gray-100 shadow-lg shadow-slate-900/5">
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

<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "auth" });

const route = useRoute();

const settingsTabs = [
  {
    key: "identity",
    icon: "sparkles",
    labelKey: "admin.settings_tab_identity",
    subtitleKey: "admin.settings_subtitle_identity",
  },
  {
    key: "operations",
    icon: "clock",
    labelKey: "admin.settings_tab_operations",
    subtitleKey: "admin.settings_subtitle_operations",
  },
  {
    key: "delivery",
    icon: "wallet",
    labelKey: "admin.settings_tab_delivery",
    subtitleKey: "admin.settings_subtitle_delivery",
  },
  {
    key: "biohub",
    icon: "link",
    labelKey: "admin.settings_tab_biohub",
    subtitleKey: "admin.settings_subtitle_biohub",
  },
];

const activeTab = computed(() => {
  const q = typeof route.query.tab === "string" ? route.query.tab : "";
  return settingsTabs.some((t) => t.key === q) ? q : "identity";
});

const currentSection = computed(
  () => settingsTabs.find((t) => t.key === activeTab.value) ?? settingsTabs[0]!
);

const {
  profile,
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
  openUpgradeForFeature,
  maxCategories,
  newDeliveryArea,
  addDeliveryArea,
  removeDeliveryArea,
  restaurantShiftsList,
  newShiftForm,
  handleAddNewShift,
  handleRemoveShift,
} = useSettingsForm();
</script>
