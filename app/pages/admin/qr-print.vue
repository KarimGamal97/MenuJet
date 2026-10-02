<template>
  <div
    class="h-screen w-screen overflow-hidden bg-gray-100 flex flex-col md:flex-row print:h-auto print:w-auto print:overflow-visible print:bg-white print:block"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <!-- Sidebar controls -->
    <aside
      class="w-full md:w-[380px] lg:w-[410px] bg-white border-l border-gray-200 flex flex-col h-full shrink-0 shadow-lg print:hidden text-gray-800 z-20"
    >
      <!-- Panel header -->
      <div class="p-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </div>
          <div>
            <h1 class="text-sm font-black text-gray-900 leading-tight">
              {{ $t('qr_print.title') }}
            </h1>
          </div>
        </div>

        <NuxtLink
          to="/admin/settings"
          class="text-[11px] font-bold text-gray-500 hover:text-gray-800 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          {{ $t('qr_print.exit') }}
        </NuxtLink>
      </div>

      <!-- Input fields -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar text-xs">
        <!-- Restaurant info -->
        <div class="grid grid-cols-2 gap-2.5">
          <div>
            <label class="block text-gray-700 font-bold mb-1 text-[11px]">
              {{ $t('qr_print.restaurant_name') }}
            </label>
            <input
              v-model="customData.restaurantName"
              type="text"
              :placeholder="$t('qr_print.restaurant_name_placeholder')"
              class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none text-gray-900 text-xs font-bold transition"
            />
          </div>
          <div>
            <label class="block text-gray-700 font-bold mb-1 text-[11px]">
              {{ $t('qr_print.slug') }}
            </label>
            <input
              v-model="customData.slug"
              type="text"
              :placeholder="$t('qr_print.slug_placeholder')"
              class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none text-gray-900 text-xs font-mono transition"
            />
          </div>
        </div>

        <!-- Logo upload -->
        <div>
          <label class="block text-gray-700 font-bold mb-1 text-[11px]">
            {{ $t('qr_print.logo') }}
          </label>
          <div class="flex gap-2">
            <input
              v-model="customData.logo"
              type="text"
              :placeholder="$t('qr_print.logo_placeholder')"
              class="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none text-gray-800 text-xs text-left transition"
              dir="ltr"
            />
            <label class="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl cursor-pointer text-xs font-bold transition flex items-center shrink-0">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <input type="file" accept="image/*" class="hidden" @change="onLogoFileChange" />
            </label>
            <button
              v-if="customData.logo"
              @click="customData.logo = ''"
              class="px-2.5 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition"
              :title="$t('qr_print.remove_logo')"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Phone number -->
        <div>
          <label class="block text-gray-700 font-bold mb-1 text-[11px]">
            {{ $t('qr_print.phone') }}
          </label>
          <input
            v-model="customData.phone"
            type="text"
            :placeholder="$t('qr_print.phone_placeholder')"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none text-gray-900 text-xs font-mono transition text-left"
            dir="ltr"
          />
        </div>

        <!-- Promo hook -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="text-gray-700 font-bold text-[11px]">
              {{ $t('qr_print.hook') }}
            </label>
            <span class="text-[10px] text-orange-600 font-bold">
              {{ $t('qr_print.hook_badge') }}
            </span>
          </div>
          <input
            v-model="customData.hook"
            type="text"
            :placeholder="$t('qr_print.hook_placeholder')"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none text-gray-900 text-xs font-bold mb-2 transition"
          />

          <!-- Preset buttons -->
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="preset in hookPresets"
              :key="preset"
              @click="customData.hook = preset"
              type="button"
              class="text-[10px] px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-600 transition border border-gray-200 font-bold"
            >
              {{ preset }}
            </button>
          </div>
        </div>

        <!-- Print size -->
        <div>
          <label class="block text-gray-700 font-bold mb-1.5 text-[11px]">
            {{ $t('qr_print.print_size') }}
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="printSize = 'stand'"
              :class="[
                'py-2 px-2 text-center rounded-xl font-bold text-[11px] transition border',
                printSize === 'stand'
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              ]"
            >
              {{ $t('qr_print.size_stand') }}
            </button>
            <button
              type="button"
              @click="printSize = 'full'"
              :class="[
                'py-2 px-2 text-center rounded-xl font-bold text-[11px] transition border',
                printSize === 'full'
                  ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              ]"
            >
              {{ $t('qr_print.size_poster') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Print action -->
      <div class="p-4 border-t border-gray-100 bg-white shrink-0">
        <button
          @click="printPage"
          class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-3 rounded-2xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition cursor-pointer text-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>{{ $t('qr_print.print_btn') }}</span>
        </button>
        <p class="text-[10px] text-center text-gray-400 mt-2 font-medium">
          {{ $t('qr_print.print_tip_prefix') }} <b>A4</b> {{ $t('qr_print.print_tip_suffix') }} <b>Background graphics</b>
        </p>
      </div>
    </aside>

    <!-- Stand preview -->
    <main class="flex-1 h-full overflow-hidden flex items-center justify-center p-4 md:p-6 bg-slate-200/70 print:p-0 print:m-0 print:h-auto print:w-auto print:bg-white print:overflow-visible">
      <!-- Printable stand -->
      <div
        id="printable-card"
        :class="[
          'bg-white rounded-3xl p-6 relative flex flex-col items-center text-center shadow-xl transition-all duration-200 border-2 border-orange-200 space-y-3.5 print:shadow-none print:rounded-3xl',
          printSize === 'stand'
            ? 'w-full max-w-[340px] print:w-[125mm] print:border-2 print:border-dashed print:border-gray-300 print:mx-auto print:my-10 print:p-6'
            : 'w-full max-w-[400px] print:w-[170mm] print:border-2 print:border-orange-300 print:mx-auto print:my-6 print:p-8'
        ]"
      >
        <!-- Header section -->
        <div class="w-full flex flex-col items-center justify-center border-b border-orange-100 pb-3 gap-1.5">
          <!-- Logo image -->
          <div
            v-if="customData.logo"
            class="w-16 h-16 flex items-center justify-center overflow-hidden mb-0.5"
          >
            <img :src="customData.logo" :alt="customData.restaurantName" class="w-full h-full object-contain" />
          </div>

          <!-- Restaurant name -->
          <h2 class="text-xl font-black text-gray-900 leading-tight tracking-tight text-center">
            {{ customData.restaurantName || $t('qr_print.default_restaurant_name') }}
          </h2>

          <!-- Scan badge -->
          <div class="inline-flex items-center justify-center px-3.5 py-0.5 rounded-full text-xs font-black bg-orange-50 text-orange-600 border border-orange-200/60 tracking-wide">
            {{ $t('qr_print.scan_and_order') }}
          </div>
        </div>

        <!-- Promo banner -->
        <div class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-sm shadow-orange-500/10 flex items-center justify-center gap-1.5">
          <span>{{ customData.hook || $t('qr_print.preset_discount15') }}</span>
        </div>

        <!-- QR container -->
        <div class="w-full flex flex-col items-center justify-center my-0.5">
          <div class="p-2.5 bg-white rounded-2xl shadow-sm border-2 border-orange-500 relative flex items-center justify-center">
            <!-- QR image -->
            <img
              :src="qrCodeUrl"
              alt="Scan QR"
              class="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg block"
            />

            <!-- Scan pill -->
            <div class="absolute -bottom-2.5 bg-gray-900 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-sm">
              {{ $t('qr_print.scan_me') }}
            </div>
          </div>
        </div>

        <!-- Stand footer -->
        <footer class="w-full pt-2.5 border-t border-orange-100 flex items-center justify-center">
          <div dir="ltr" class="text-xs font-bold text-gray-600 flex items-center gap-2">
            <span class="text-orange-600 font-black text-sm tracking-tight">MenuJet</span>
            <template v-if="customData.phone">
              <span class="text-gray-300 font-normal">|</span>
              <span class="font-mono text-gray-800 font-bold tracking-wider">{{ customData.phone }}</span>
            </template>
          </div>
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  layout: false
});

const { t, locale } = useI18n();
const { profile, fetchProfile } = useSettings();
const { ownerId } = useAuthUser();

// Quick presets
const hookPresets = computed(() => [
  t('qr_print.preset_discount15'),
  t('qr_print.preset_order_mobile'),
  t('qr_print.preset_today_offer'),
  t('qr_print.preset_discount20')
]);

// Print size
const printSize = ref<'stand' | 'full'>('stand');

// Stand data
const customData = ref({
  restaurantName: '',
  slug: '',
  logo: '',
  hook: '',
  phone: ''
});

// Load profile
onMounted(async () => {
  if (!customData.value.hook) {
    customData.value.hook = t('qr_print.preset_discount15');
  }

  if (ownerId.value) {
    await fetchProfile(ownerId.value);
    if (profile.value) {
      if (profile.value.business_name) customData.value.restaurantName = profile.value.business_name;
      if (profile.value.slug) customData.value.slug = profile.value.slug;
      if (profile.value.logo) customData.value.logo = profile.value.logo;
      if (profile.value.whatsapp_number) customData.value.phone = profile.value.whatsapp_number;
    }
  }
});

// QR URL
const fullMenuUrl = computed(() => {
  const cleanSlug = (customData.value.slug || '').trim().replace(/^\/+|\/+$/g, '');
  if (cleanSlug.startsWith('http://') || cleanSlug.startsWith('https://')) {
    return cleanSlug;
  }
  return `https://getmenujet.com/menu/${cleanSlug || 'demo'}`;
});

const qrCodeUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=0&data=${encodeURIComponent(fullMenuUrl.value)}`;
});

// Upload logo
const onLogoFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      customData.value.logo = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// Print action
const printPage = () => {
  window.print();
};
</script>

<style>
/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 10mm;
  }
  
  html, body {
    background: #ffffff !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    height: auto !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  #printable-card {
    box-shadow: none !important;
    page-break-inside: avoid !important;
  }
}
</style>
