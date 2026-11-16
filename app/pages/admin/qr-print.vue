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
            <BaseIcon name="print" class="w-5 h-5" />
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
        <div>
          <label class="block text-gray-700 font-bold mb-1 text-[11px]">
            {{ $t('qr_print.restaurant_name') }} <span class="text-red-500 font-bold">*</span>
          </label>
          <input
            v-model="customData.restaurantName"
            type="text"
            required
            :placeholder="$t('qr_print.restaurant_name_placeholder')"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 outline-none text-gray-900 text-xs font-bold transition"
            :class="{ 'border-red-400': !customData.restaurantName?.trim() }"
          />
          <p v-if="!customData.restaurantName?.trim()" class="text-[10px] text-red-500 mt-1 font-bold">
            {{ locale === 'ar' ? 'اسم المطعم مطلوب' : 'Restaurant name is required' }}
          </p>
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
              <BaseIcon name="upload" class="w-4 h-4 text-gray-600" />
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
          <BaseIcon name="print" class="w-5 h-5" />
          <span>{{ $t('qr_print.print_btn') }}</span>
        </button>
      </div>
    </aside>

    <!-- Stand preview -->
    <AdminQrPrintQrCardPreview
      :print-size="printSize"
      :custom-data="customData"
      :qr-code-url="qrCodeUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

definePageMeta({
  layout: false
});

const route = useRoute();
const { t, locale } = useI18n();
const { profile, fetchProfile } = useSettings();
const { ownerId } = useAuthUser();
const { $toast } = useNuxtApp();

// Quick presets
const hookPresets = computed(() => [
  t('qr_print.preset_discount15'),
  t('qr_print.preset_order_mobile'),
  t('qr_print.preset_today_offer'),
  t('qr_print.preset_discount20')
]);

// Print size
const printSize = ref<'stand' | 'full'>('full');

// Stand data
const customData = ref({
  restaurantName: '',
  logo: '',
  hook: '',
  phone: ''
});

// Load profile & slug
watch(
  ownerId,
  async (newId) => {
    if (newId) {
      const data = await fetchProfile(newId);
      if (data) {
        if (data.business_name && !customData.value.restaurantName) {
          customData.value.restaurantName = data.business_name;
        }
        if (data.logo && !customData.value.logo) {
          customData.value.logo = data.logo;
        }
        if (data.whatsapp_number && !customData.value.phone) {
          customData.value.phone = data.whatsapp_number;
        }
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (!customData.value.hook) {
    customData.value.hook = t('qr_print.preset_discount15');
  }
});

// QR URL
const fullMenuUrl = computed(() => {
  const rawSlug = (route.query.slug as string) || profile.value?.slug || '';
  if (!rawSlug) return 'https://getmenujet.com/menu';
  const cleanSlug = rawSlug
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');
  return `https://getmenujet.com/menu/${cleanSlug}`;
});

const qrCodeUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&margin=0&data=${encodeURIComponent(fullMenuUrl.value)}`;
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
  if (!customData.value.restaurantName?.trim()) {
    $toast.error(locale.value === 'ar' ? 'يرجى إدخال اسم المطعم أولاً' : 'Please enter restaurant name first');
    return;
  }
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
    margin: 8mm;
  }
  
  html, body {
    background: #ffffff !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    height: 100% !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  main {
    min-height: calc(297mm - 16mm) !important;
    height: calc(297mm - 16mm) !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    margin: 0 auto !important;
    padding: 0 !important;
    box-sizing: border-box !important;
  }

  #printable-card {
    box-shadow: none !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    margin: auto !important;
  }
}
</style>
