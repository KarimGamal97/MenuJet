<template>
  <div class="space-y-4">
    <!-- Compact 3-Step Indicator -->
    <div class="flex items-center justify-between gap-2 px-1">
      <div
        v-for="(label, idx) in stepLabels"
        :key="idx"
        class="flex-1 flex flex-col items-center gap-1.5"
      >
        <div class="w-full flex items-center gap-1.5">
          <div
            :class="[
              'h-1.5 w-full rounded-full transition-all duration-300',
              currentStep > idx + 1
                ? 'bg-emerald-500'
                : currentStep === idx + 1
                  ? 'bg-orange-600'
                  : 'bg-gray-200',
            ]"
          />
        </div>
        <span
          :class="[
            'text-[11px] font-black transition-colors truncate max-w-full',
            currentStep === idx + 1
              ? 'text-orange-600'
              : currentStep > idx + 1
                ? 'text-emerald-600'
                : 'text-gray-400',
          ]"
        >
          {{ idx + 1 }}. {{ label }}
        </span>
      </div>
    </div>

    <!-- Step 1: Owner & Contact Details -->
    <form v-if="currentStep === 1" @submit.prevent="goToStep2" class="space-y-3">
      <BaseInput
        v-model="form.ownerName"
        type="text"
        :placeholder="$t('login.owner_name_placeholder')"
        :error="stepErrors.ownerName"
        class="bg-white"
      />

      <BaseInput
        v-model="form.businessName"
        type="text"
        :placeholder="$t('login.business_name_placeholder')"
        :error="stepErrors.businessName"
        class="bg-white"
      />

      <BaseInput
        v-model="form.whatsappNumber"
        type="tel"
        :dir="form.whatsappNumber ? 'ltr' : undefined"
        :placeholder="$t('login.whatsapp_placeholder')"
        :error="stepErrors.whatsappNumber"
        :class="['bg-white', locale === 'ar' ? 'text-right' : 'text-left']"
      />

      <BaseButton type="submit" variant="primary" size="lg" fullWidth>
        {{ $t("login.next_step") }}
      </BaseButton>
    </form>

    <!-- Step 2: Quick Menu Setup -->
    <form v-else-if="currentStep === 2" @submit.prevent="currentStep = 3" class="space-y-3.5">
      <!-- Business Category Presets -->
      <div>
        <label class="block text-xs font-black text-gray-700 mb-1.5">
          {{ $t("login.activity_type_label") }}
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="preset in categoryPresets"
            :key="preset.id"
            type="button"
            @click="selectedPresetId = preset.id"
            :class="[
              'p-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer text-center',
              selectedPresetId === preset.id
                ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
            ]"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <!-- Brand Color -->
      <div>
        <label class="block text-xs font-black text-gray-700 mb-1.5">
          {{ $t("login.menu_color_label") }}
        </label>
        <div class="flex items-center gap-2.5 bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5">
          <button
            v-for="color in colorSwatches"
            :key="color"
            type="button"
            @click="form.primaryColor = color"
            :style="{ backgroundColor: color }"
            :class="[
              'w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center',
              form.primaryColor === color ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-105',
            ]"
          >
            <BaseIcon v-if="form.primaryColor === color" name="check" class="w-4 h-4 text-white stroke-[3]" />
          </button>
        </div>
      </div>

      <!-- Ordering Mode -->
      <div>
        <label class="block text-xs font-black text-gray-700 mb-1.5">
          {{ $t("login.order_mode_label") }}
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="form.whatsappOrderingEnabled = true"
            :class="[
              'p-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer text-center',
              form.whatsappOrderingEnabled
                ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
            ]"
          >
            {{ $t("login.mode_orders") }}
          </button>
          <button
            type="button"
            @click="form.whatsappOrderingEnabled = false"
            :class="[
              'p-2.5 rounded-2xl border text-xs font-black transition-all cursor-pointer text-center',
              !form.whatsappOrderingEnabled
                ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
            ]"
          >
            {{ $t("login.mode_browse") }}
          </button>
        </div>
      </div>

      <div class="flex gap-2.5 pt-1">
        <button
          type="button"
          @click="currentStep = 1"
          class="px-5 py-3.5 rounded-2xl bg-gray-200/80 hover:bg-gray-200 text-gray-700 font-black text-sm transition-colors cursor-pointer"
        >
          {{ $t("login.prev_step") }}
        </button>
        <BaseButton type="submit" variant="primary" size="lg" fullWidth>
          {{ $t("login.next_step") }}
        </BaseButton>
      </div>
    </form>

    <!-- Step 3: Account Credentials -->
    <form v-else @submit.prevent="submitAll" class="space-y-3">
      <div class="bg-white border border-orange-200/80 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-2 text-xs">
        <span class="font-black text-gray-800 truncate">{{ form.businessName }}</span>
        <span class="font-bold text-orange-600 shrink-0" dir="ltr">{{ form.whatsappNumber }}</span>
      </div>

      <BaseInput
        v-model="form.email"
        type="email"
        :placeholder="$t('login.email_optional_placeholder')"
        :error="stepErrors.email"
        class="bg-white"
      />

      <BaseInput
        v-model="form.password"
        type="password"
        :placeholder="$t('login.password_placeholder')"
        :error="stepErrors.password"
        class="bg-white"
      />

      <div class="flex gap-2.5 pt-1">
        <button
          type="button"
          @click="currentStep = 2"
          :disabled="loading"
          class="px-5 py-3.5 rounded-2xl bg-gray-200/80 hover:bg-gray-200 text-gray-700 font-black text-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          {{ $t("login.prev_step") }}
        </button>
        <BaseButton type="submit" variant="primary" size="lg" fullWidth :loading="loading">
          <template v-if="loading">{{ $t("login.loading") }}</template>
          <template v-else>{{ $t("login.signup_submit") }}</template>
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();

defineProps<{
  loading: boolean;
}>();

const emit = defineEmits<{
  (
    e: "submit",
    payload: {
      ownerName: string;
      businessName: string;
      whatsappNumber: string;
      primaryColor: string;
      categories: string[];
      whatsappOrderingEnabled: boolean;
      email: string;
      password: string;
    },
  ): void;
}>();

const currentStep = ref(1);
const selectedPresetId = ref("grill");

const form = reactive({
  ownerName: "",
  businessName: "",
  whatsappNumber: "",
  primaryColor: "#ea580c",
  whatsappOrderingEnabled: true,
  email: "",
  password: "",
});

const stepErrors = reactive({
  ownerName: "",
  businessName: "",
  whatsappNumber: "",
  email: "",
  password: "",
});

const stepLabels = computed(() => [
  t("login.step_contact"),
  t("login.step_setup"),
  t("login.step_account"),
]);

const colorSwatches = ["#ea580c", "#dc2626", "#059669", "#2563eb", "#111827"];

const categoryPresets = computed(() => [
  {
    id: "grill",
    label: t("login.preset_grill"),
    categories: ["وجبات رئيسية", "مشويات", "مقبلات وسلطات", "مشروبات"],
  },
  {
    id: "burger",
    label: t("login.preset_burger"),
    categories: ["برجر لحم", "برجر فراخ", "بطاطس ومقبلات", "مشروبات"],
  },
  {
    id: "cafe",
    label: t("login.preset_cafe"),
    categories: ["قهوة ساخنة", "مشروبات مثلجة", "حلويات", "سندوتشات"],
  },
  {
    id: "sweets",
    label: t("login.preset_sweets"),
    categories: ["حلويات شرقية", "تورت وجاتوه", "وافل وكريب", "مشروبات"],
  },
]);

const goToStep2 = () => {
  stepErrors.ownerName = form.ownerName.trim() ? "" : t("login.error_required");
  stepErrors.businessName = form.businessName.trim()
    ? ""
    : t("login.error_business_name_required");

  const cleanPhone = form.whatsappNumber.replace(/[\s()-]/g, "");
  if (!cleanPhone) {
    stepErrors.whatsappNumber = t("login.error_required");
  } else if (!/^\+?\d{10,15}$/.test(cleanPhone)) {
    stepErrors.whatsappNumber = t("login.error_phone_invalid");
  } else {
    stepErrors.whatsappNumber = "";
  }

  if (
    !stepErrors.ownerName &&
    !stepErrors.businessName &&
    !stepErrors.whatsappNumber
  ) {
    currentStep.value = 2;
  }
};

const submitAll = () => {
  const trimmedEmail = form.email.trim();
  stepErrors.email =
    trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
      ? t("login.error_email")
      : "";
  stepErrors.password =
    form.password.length >= 6 ? "" : t("login.error_password_min");

  if (stepErrors.email || stepErrors.password) return;

  const chosenPreset = categoryPresets.value.find(
    (p) => p.id === selectedPresetId.value,
  );

  emit("submit", {
    ownerName: form.ownerName.trim(),
    businessName: form.businessName.trim(),
    whatsappNumber: form.whatsappNumber.trim(),
    primaryColor: form.primaryColor,
    categories: chosenPreset?.categories || ["وجبات رئيسية", "مشروبات", "حلويات"],
    whatsappOrderingEnabled: form.whatsappOrderingEnabled,
    email: trimmedEmail,
    password: form.password,
  });
};
</script>
