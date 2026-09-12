<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        @click="$emit('close')"
      ></div>

      <!-- Modal Dialog -->
      <div
        class="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full relative z-[110] shadow-2xl border border-orange-100 animate-in zoom-in-95 duration-200"
      >
        <!-- Close Button -->
        <button
          @click="$emit('close')"
          class="absolute top-6 left-6 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          ✕
        </button>

        <!-- Header Icon & Badge -->
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 mx-auto bg-gradient-to-tr from-orange-500 to-amber-400 text-white rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-orange-500/25 mb-4"
          >
            🚀
          </div>

          <span
            class="inline-block bg-orange-100 text-orange-700 text-xs font-black px-4 py-1.5 rounded-full mb-2"
          >
            {{ badgeText || $t("plans.reached_limit") }}
          </span>

          <h3 class="text-2xl sm:text-3xl font-black text-slate-900">
            {{ title || $t("plans.modal_default_title") }}
          </h3>
          
          <p class="text-slate-500 text-sm sm:text-base mt-2 font-medium">
            <template v-if="message">
              {{ message }}
            </template>
            <template v-else-if="limitType === 'items'">
              {{ $t("plans.items_limit_msg", { current: currentCount, max: maxCount }) }}
            </template>
            <template v-else-if="limitType === 'categories'">
              {{ $t("plans.cats_limit_msg", { current: currentCount, max: maxCount }) }}
            </template>
            <template v-else>
              {{ $t("plans.general_upgrade_msg") }}
            </template>
          </p>
        </div>

        <!-- Plan Advantages Cards -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-6 space-y-3">
          <h4 class="text-xs font-black text-slate-400 uppercase tracking-wider">
            {{ $t("plans.what_you_get") }}
          </h4>
          
          <ul class="space-y-2.5 text-sm text-slate-700 font-bold">
            <li class="flex items-center gap-2.5">
              <span class="text-emerald-500 text-lg">✓</span>
              <span>{{ $t("plans.feat_unlimited") }}</span>
            </li>
            <li class="flex items-center gap-2.5">
              <span class="text-emerald-500 text-lg">✓</span>
              <span>{{ $t("plans.feat_whatsapp") }}</span>
            </li>
            <li class="flex items-center gap-2.5">
              <span class="text-emerald-500 text-lg">✓</span>
              <span>{{ $t("plans.feat_analytics") }}</span>
            </li>
            <li class="flex items-center gap-2.5">
              <span class="text-emerald-500 text-lg">✓</span>
              <span>{{ $t("plans.feat_branding") }}</span>
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="openWhatsAppUpgrade"
            class="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black py-4 px-6 rounded-2xl text-center shadow-xl shadow-orange-500/25 transition-all duration-300 transform active:scale-98 text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💬</span>
            <span>{{ $t("plans.whatsapp_upgrade_btn") }}</span>
          </button>

          <button
            @click="$emit('close')"
            class="w-full py-3 text-slate-500 hover:text-slate-800 font-bold text-sm text-center transition-colors cursor-pointer"
          >
            {{ $t("plans.close_btn") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const { t } = useI18n();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  limitType: {
    type: String,
    default: "items", // 'items' | 'categories' | 'general'
  },
  badgeText: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  currentCount: {
    type: [Number, String],
    default: 0,
  },
  maxCount: {
    type: [Number, String],
    default: 20,
  },
  businessName: {
    type: String,
    default: "",
  },
});

defineEmits(["close"]);

const openWhatsAppUpgrade = () => {
  // Support WhatsApp number
  const whatsappNumber = "201026046778";
  const restaurant = props.businessName || t("plans.my_restaurant");
  const message = encodeURIComponent(
    t("plans.whatsapp_upgrade_text", { restaurant })
  );
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
};
</script>
