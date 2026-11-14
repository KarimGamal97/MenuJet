<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      dir="rtl"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        @click="$emit('close')"
      />

      <!-- Content Sheet / Modal -->
      <div
        class="relative w-full sm:max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 class="text-lg font-black text-gray-800 flex items-center gap-2.5">
            <div
              class="w-9 h-9 rounded-2xl flex items-center justify-center text-white"
              :style="{ backgroundColor: primaryColor }"
            >
              <BaseIcon name="store" class="w-5 h-5" />
            </div>
            <span>{{ $t("menu.restaurant_info") }}</span>
          </h2>
          <button
            @click="$emit('close')"
            class="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors font-bold"
            aria-label="Close"
          >
            <BaseIcon name="close" class="w-4 h-4" />
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <!-- Identity Section -->
          <div class="flex flex-col items-center text-center">
            <div
              class="w-20 h-20 rounded-3xl overflow-hidden p-1 shadow-md border border-gray-100 flex items-center justify-center bg-gray-50 mb-3"
            >
              <img
                v-if="restaurant?.logo"
                :src="restaurant.logo"
                :alt="restaurant.business_name"
                class="w-full h-full object-cover rounded-[1.25rem]"
              />
              <div
                v-else
                class="w-full h-full rounded-[1.25rem] flex items-center justify-center text-xl font-black text-white"
                :style="{ backgroundColor: primaryColor }"
              >
                {{ restaurant?.business_name?.charAt(0) || "M" }}
              </div>
            </div>

            <h3 class="text-xl font-black text-gray-900 mb-1">
              {{ restaurant?.business_name }}
            </h3>

            <!-- Status Badge -->
            <div
              v-if="isOpenNow"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-100 mt-1"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{{ $t("menu.open_now") }}</span>
            </div>
            <div
              v-else
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-black border border-gray-200 mt-1"
            >
              <span class="w-2 h-2 rounded-full bg-gray-400"></span>
              <span>{{ $t("menu.closed_now") }}</span>
            </div>

            <p
              v-if="restaurant?.bio || restaurant?.description"
              class="text-xs text-gray-500 font-medium mt-3 leading-relaxed max-w-xs"
            >
              {{ restaurant.bio || restaurant.description }}
            </p>
          </div>

          <!-- Working Hours Card -->
          <div
            v-if="restaurant?.automated_hours_enabled"
            class="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3.5"
          >
            <div class="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-orange-600 shrink-0">
              <BaseIcon name="clock" class="w-5 h-5" />
            </div>
            <div class="flex-1 text-sm">
              <div class="text-[11px] font-bold text-gray-400 uppercase">
                {{ $t("menu.opening_hours") }}
              </div>
              <div class="font-black text-gray-800 mt-0.5 dir-ltr text-right">
                {{ formatTime12h(restaurant.opening_time || "09:00") }} - {{ formatTime12h(restaurant.closing_time || "23:00") }}
              </div>
            </div>
          </div>

          <!-- Quick Contact Actions -->
          <div class="grid grid-cols-2 gap-3">
            <a
              v-if="restaurant?.whatsapp_number"
              :href="whatsappHref"
              target="_blank"
              class="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <BaseIcon name="whatsapp" class="w-4 h-4 fill-current" />
              <span>{{ $t("menu.whatsapp_chat") }}</span>
            </a>

            <a
              v-if="phoneNumber"
              :href="`tel:${phoneNumber}`"
              class="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-xs transition-all shadow-md active:scale-95"
            >
              <BaseIcon name="phone" class="w-4 h-4" />
              <span>{{ $t("menu.call_us") }}</span>
            </a>
          </div>

          <!-- Bio Hub Button (if allowed & enabled) -->
          <button
            v-if="isBioHubAllowed && restaurant?.bio_hub_enabled"
            type="button"
            @click="$emit('openBioHub')"
            class="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            <div class="flex items-center gap-2.5">
              <BaseIcon name="sparkles" class="w-4 h-4 text-amber-200" />
              <span>{{ $t("menu.visit_bio_hub") }}</span>
            </div>
            <BaseIcon name="chevron-left" class="w-4 h-4" />
          </button>

          <!-- Delivery Areas (if configured) -->
          <div
            v-if="deliveryAreasList.length > 0"
            class="space-y-2.5"
          >
            <div class="text-xs font-black text-gray-700 flex items-center gap-2">
              <BaseIcon name="map-pin" class="w-4 h-4 text-orange-600" />
              <span>{{ $t("menu.delivery_areas") }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto no-scrollbar">
              <div
                v-for="(area, idx) in deliveryAreasList"
                :key="idx"
                class="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs"
              >
                <span class="font-bold text-gray-700">{{ area.name }}</span>
                <span class="font-black text-orange-600">{{ area.price }} {{ $t("currency") }}</span>
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div v-if="hasSocialLinks" class="pt-2 border-t border-gray-100 text-center">
            <div class="text-[11px] font-bold text-gray-400 mb-3">
              {{ $t("menu.social_media") }}
            </div>
            <div class="flex items-center justify-center gap-3">
              <a
                v-if="restaurant?.facebook_url"
                :href="restaurant.facebook_url"
                target="_blank"
                class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs"
                aria-label="Facebook"
              >
                <BaseIcon name="facebook" class="w-5 h-5 fill-current" />
              </a>
              <a
                v-if="restaurant?.instagram_url"
                :href="restaurant.instagram_url"
                target="_blank"
                class="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs"
                aria-label="Instagram"
              >
                <BaseIcon name="instagram" class="w-5 h-5" />
              </a>
              <a
                v-if="restaurant?.tiktok_url"
                :href="restaurant.tiktok_url"
                target="_blank"
                class="w-10 h-10 rounded-2xl bg-gray-100 text-gray-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xs"
                aria-label="TikTok"
              >
                <BaseIcon name="tiktok" class="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  restaurant: { type: Object, default: () => ({}) },
  primaryColor: { type: String, default: "#ea580c" },
  isBioHubAllowed: { type: Boolean, default: false },
});

defineEmits(["close", "openBioHub"]);

const isOpenNow = computed(() => {
  return props.restaurant?.is_shop_open !== false;
});

const phoneNumber = computed(() => {
  return props.restaurant?.phone_number || props.restaurant?.phone || props.restaurant?.whatsapp_number || "";
});

const whatsappHref = computed(() => {
  const num = String(props.restaurant?.whatsapp_number || "").replace(/[^0-9]/g, "");
  return num ? `https://wa.me/${num}` : "#";
});

const deliveryAreasList = computed(() => {
  const areas = props.restaurant?.delivery_areas;
  return Array.isArray(areas) ? areas : [];
});

const hasSocialLinks = computed(() => {
  const r = props.restaurant;
  return Boolean(r?.facebook_url || r?.instagram_url || r?.tiktok_url);
});

const formatTime12h = (timeStr) => {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] || "00";
  const period = hours >= 12 ? "م" : "ص";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
</style>
