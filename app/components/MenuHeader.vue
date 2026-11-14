<template>
  <header
    class="sticky top-0 z-50 bg-orange-600 backdrop-blur-xl transition-all duration-300 h-20"
    :style="restaurant?.primary_color ? { backgroundColor: restaurant.primary_color } : {}"
  >
    <div
      class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center h-full"
    >
      <!-- Brand Logo & Status -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- Client Logo if uploaded -->
        <div
          v-if="restaurant?.logo"
          class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-white/15 p-0.5 border border-white/30 shadow-md shrink-0 flex items-center justify-center transition-transform hover:scale-105"
        >
          <img
            :src="restaurant.logo"
            :alt="restaurant.business_name"
            class="w-full h-full object-cover rounded-[14px]"
          />
        </div>

        <div class="flex flex-col items-start shrink-0">
          <div
            class="flex items-center justify-center overflow-hidden transition-transform mb-1"
          >
            <span class="text-white font-black capitalize text-lg sm:text-xl leading-none">
              {{ restaurant.business_name }}
            </span>
          </div>

          <!-- Status Badge below Logo -->
          <div
            v-if="isOpen !== false"
            class="flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full"
          >
            <span class="relative flex h-1.5 w-1.5">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"
              ></span>
            </span>
            <span
              class="text-[9px] font-black text-green-600 whitespace-nowrap uppercase tracking-tight"
            >
              {{ $t("admin.status_available") }}
            </span>
          </div>
          <div
            v-else
            class="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full opacity-70"
          >
            <span class="inline-flex rounded-full h-1.5 w-1.5 bg-gray-300"></span>
            <span
              class="text-[9px] font-black text-gray-400 whitespace-nowrap uppercase tracking-tight"
            >
              {{ $t("admin.status_closed") }}
            </span>
          </div>
        </div>
      </div>

      <!-- MenuJet Brand Link to Landing (Aligned on the same row as cafe logo/name) -->
      <div class="flex flex-col items-center shrink-0">
        <div class="flex items-center justify-center mb-1">
          <NuxtLink
            to="/"
            dir="ltr"
            class="text-white font-black text-xl sm:text-2xl tracking-tight hover:opacity-90 transition-all active:scale-95 select-none leading-none inline-block"
            title="MenuJet"
          >
            <span class="text-orange-400">M</span>enu<span class="text-orange-400">J</span>et
          </NuxtLink>
        </div>
        <!-- Spacer matching badge height so MenuJet is on the exact same row as restaurant name -->
        <div class="h-[21px] invisible select-none pointer-events-none" aria-hidden="true"></div>
      </div>

      <!-- Previous Orders Button (Commented out from top header as requested) -->
      <!--
      <button
        @click="showHistory = true"
        class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50/40 hover:bg-orange-50 rounded-2xl transition-all active:scale-95 group border border-gray-100/50 shadow-sm pr-1.5"
        aria-label="Previous Orders"
      >
        <div
          class="w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
        >
          <BaseIcon name="history" class="w-4 h-4 text-orange-600" />
        </div>
        <div class="flex gap-1 items-start leading-none ml-1">
          <span class="text-[10px] font-black text-gray-800">
            {{ $t("history.title") }}
          </span>
        </div>
      </button>
      -->
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  restaurant: { type: Object, default: () => ({}) },
  locale: { type: String, default: "ar" },
  isOpen: { type: Boolean, default: true },
  isBioHubAllowed: { type: Boolean, default: false },
});

const emit = defineEmits(["openBioHub"]);
</script>
