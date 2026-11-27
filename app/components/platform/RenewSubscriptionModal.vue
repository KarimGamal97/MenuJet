<template>
  <BaseModal
    :isOpen="open"
    :title="$t('platform.renew_title')"
    :subtitle="displayName"
    icon="crown"
    iconColor="bg-orange-50 text-orange-600"
    maxWidth="max-w-lg"
    @close="emit('close')"
  >
    <div class="space-y-5 mt-2" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
      <!-- Plan Selection -->
      <div>
        <label class="block text-xs font-black text-gray-700 mb-2">
          {{ $t("platform.select_plan") }}
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="plan in planOptions"
            :key="plan.id"
            type="button"
            @click="form.plan_id = plan.id"
            :class="[
              'py-2.5 px-3 rounded-2xl border text-xs font-black transition-all cursor-pointer text-center',
              form.plan_id === plan.id
                ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
            ]"
          >
            {{ plan.label }}
          </button>
        </div>
      </div>

      <!-- Subscription Status -->
      <div>
        <label class="block text-xs font-black text-gray-700 mb-2">
          {{ $t("platform.select_status") }}
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            v-for="st in statusOptions"
            :key="st.id"
            type="button"
            @click="form.subscription_status = st.id"
            :class="[
              'py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center',
              form.subscription_status === st.id
                ? st.activeClass
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
            ]"
          >
            {{ st.label }}
          </button>
        </div>
      </div>

      <!-- Quick Extend Presets -->
      <div>
        <label class="block text-xs font-black text-gray-700 mb-2">
          {{ $t("platform.quick_duration") }}
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in durationPresets"
            :key="preset.days"
            type="button"
            @click="applyDuration(preset.days)"
            class="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-orange-100 hover:text-orange-700 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
          >
            {{ preset.label }}
          </button>
          <button
            type="button"
            @click="form.endDateInput = ''"
            class="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold transition-colors cursor-pointer"
          >
            {{ $t("platform.no_end_date") }}
          </button>
        </div>
      </div>

      <!-- Exact End Date Picker -->
      <div>
        <label class="block text-xs font-black text-gray-700 mb-1.5">
          {{ $t("platform.end_date_label") }}
        </label>
        <input
          v-model="form.endDateInput"
          type="date"
          dir="ltr"
          class="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        />
      </div>

      <!-- Visibility & Demo Flags -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <label
          :class="[
            'flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-colors',
            form.is_demo ? 'opacity-50 pointer-events-none bg-gray-50 border-gray-200' :
            form.show_in_clients ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
          ]"
        >
          <input
            v-model="form.show_in_clients"
            type="checkbox"
            :disabled="form.is_demo"
            class="w-4 h-4 accent-emerald-600 rounded"
          />
          <span class="text-xs font-bold leading-snug">{{ $t("platform.modal_show_in_clients") }}</span>
        </label>

        <label
          :class="[
            'flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-colors',
            form.is_demo ? 'border-purple-500 bg-purple-50 text-purple-800' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
          ]"
        >
          <input
            v-model="form.is_demo"
            type="checkbox"
            class="w-4 h-4 accent-purple-600 rounded"
          />
          <span class="text-xs font-bold leading-snug">{{ $t("platform.modal_is_demo") }}</span>
        </label>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
        <button
          type="button"
          @click="emit('close')"
          class="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
        >
          {{ $t("common.cancel") }}
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="saving"
          class="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/15 transition-all disabled:opacity-50 cursor-pointer"
        >
          {{ saving ? $t("platform.saving") : $t("platform.save_changes") }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { PlatformRestaurant } from "~/composables/usePlatformRestaurants";
import { resolvePlanId } from "~/utils/helpers";

const { t } = useI18n();

const props = defineProps<{
  open: boolean;
  saving: boolean;
  restaurant: PlatformRestaurant | null;
  displayName: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "save",
    payload: {
      plan_id: string;
      subscription_status: string;
      subscription_end_date: string | null;
      show_in_clients: boolean;
      is_demo: boolean;
    },
  ): void;
}>();

const form = reactive({
  plan_id: "basic",
  subscription_status: "active",
  endDateInput: "",
  show_in_clients: false,
  is_demo: false,
});

const planOptions = computed(() => [
  { id: "basic", label: t("plans.basic_name") },
  { id: "pro", label: t("plans.pro_name") },
]);

const statusOptions = computed(() => [
  {
    id: "active",
    label: t("platform.status_active"),
    activeClass: "border-emerald-500 bg-emerald-50 text-emerald-700 font-black",
  },
  {
    id: "trial",
    label: t("platform.status_trial"),
    activeClass: "border-blue-500 bg-blue-50 text-blue-700 font-black",
  },
  {
    id: "expired",
    label: t("platform.status_expired"),
    activeClass: "border-red-500 bg-red-50 text-red-700 font-black",
  },
  {
    id: "inactive",
    label: t("platform.status_inactive"),
    activeClass: "border-gray-500 bg-gray-100 text-gray-800 font-black",
  },
]);

const durationPresets = computed(() => [
  { days: 14, label: t("platform.preset_14d") },
  { days: 30, label: t("platform.preset_1m") },
  { days: 90, label: t("platform.preset_3m") },
  { days: 365, label: t("platform.preset_1y") },
]);

const toDateInput = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0] || "";
};

watch(
  () => props.restaurant,
  (r) => {
    if (!r) return;
    form.plan_id = resolvePlanId(r);
    form.subscription_status = r.subscription_status || "active";
    form.endDateInput = toDateInput(r.subscription_end_date);
    form.show_in_clients = Boolean(r.show_in_clients);
    form.is_demo = Boolean(r.is_demo);
  },
  { immediate: true },
);

watch(
  () => form.is_demo,
  (isDemo) => {
    if (isDemo) {
      form.show_in_clients = false;
    }
  },
);

const applyDuration = (days: number) => {
  // Extend from existing end date if still in the future; otherwise from today
  const currentEnd = form.endDateInput ? new Date(form.endDateInput).getTime() : 0;
  const baseMs = currentEnd > Date.now() ? currentEnd : Date.now();
  const target = new Date(baseMs + days * 24 * 60 * 60 * 1000);
  form.endDateInput = target.toISOString().split("T")[0] || "";
  if (form.subscription_status === "expired" || form.subscription_status === "inactive") {
    form.subscription_status = "active";
  }
};

const handleSubmit = () => {
  const endDateIso = form.endDateInput
    ? `${form.endDateInput}T23:59:59+00:00`
    : null;

  emit("save", {
    plan_id: form.plan_id,
    subscription_status: form.subscription_status,
    subscription_end_date: endDateIso,
    show_in_clients: form.is_demo ? false : form.show_in_clients,
    is_demo: form.is_demo,
  });
};
</script>
