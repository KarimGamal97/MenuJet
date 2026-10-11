<template>
  <div
    class="min-h-screen w-full flex flex-col justify-between relative overflow-hidden bg-slate-950 text-white selection:bg-orange-500 selection:text-white"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <!-- Dynamic Ambient Background Glows -->
    <div
      class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full blur-[130px] opacity-25 transition-all duration-700"
      :style="{ backgroundColor: brandColor }"
    />
    <div
      class="pointer-events-none absolute -bottom-32 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-15"
      :style="{ backgroundColor: brandColor }"
    />

    <!-- Subtle Background Pattern Overlay -->
    <div
      class="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
    />

    <!-- Header Actions (Language Toggle) -->
    <header class="relative z-10 w-full max-w-lg mx-auto px-6 pt-6 flex items-center justify-end">
      <button
        type="button"
        @click="toggleLocale"
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md border border-white/10 text-white transition-all shadow-sm"
      >
        <BaseIcon name="globe" class="w-3.5 h-3.5 text-gray-300" />
        <span>{{ locale === 'ar' ? 'English' : 'العربية' }}</span>
      </button>
    </header>

    <!-- Main Container -->
    <main class="relative z-10 w-full max-w-md mx-auto px-5 py-6 flex-1 flex flex-col items-center justify-center">
      <!-- Restaurant Identity Card -->
      <div class="w-full flex flex-col items-center text-center mb-7">
        <!-- Logo with Glow Frame -->
        <div class="relative group mb-4">
          <div
            class="absolute -inset-1 rounded-full blur-md opacity-40 group-hover:opacity-70 transition duration-500"
            :style="{ backgroundColor: brandColor }"
          />
          <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-b from-white/20 to-white/5 border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center bg-slate-900">
            <img
              v-if="restaurant.logo"
              :src="restaurant.logo"
              :alt="displayName"
              class="w-full h-full object-cover rounded-full"
            />
            <div
              v-else
              class="w-full h-full rounded-full flex items-center justify-center text-2xl font-black uppercase text-white"
              :style="{ backgroundColor: brandColor }"
            >
              {{ displayName?.charAt(0) || 'M' }}
            </div>
          </div>
        </div>

        <!-- Business Name -->
        <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          {{ displayName }}
        </h1>

        <!-- Slogan / Tagline -->
        <p class="text-xs sm:text-sm text-gray-400 font-medium max-w-xs leading-relaxed">
          {{ $t('bio_hub.welcome_subtext') }}
        </p>
      </div>

      <!-- Hero Action: View Menu (The Highlight) -->
      <div class="w-full mb-6">
        <button
          type="button"
          @click="$emit('openMenu')"
          class="relative w-full group overflow-hidden rounded-2xl p-4 sm:p-5 flex items-center justify-between text-white font-black text-base sm:text-lg shadow-xl transition-all duration-300 active:scale-[0.98] border border-white/20 hover:brightness-110"
          :style="{ backgroundColor: brandColor }"
        >
          <!-- Shiny animation streak -->
          <div
            class="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none transition-transform"
          />

          <div class="flex items-center gap-3.5 relative z-10">
            <div class="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <BaseIcon name="food" class="w-6 h-6 text-white" />
            </div>
            <div class="flex flex-col text-right" :class="locale === 'en' ? '!text-left' : ''">
              <span class="leading-tight">{{ $t('bio_hub.browse_menu') }}</span>
              <span class="text-[11px] font-normal text-white/80 mt-0.5">{{ $t('bio_hub.browse_menu_desc') }}</span>
            </div>
          </div>

          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 relative z-10">
            <BaseIcon
              :name="locale === 'ar' ? 'chevron-left' : 'chevron-right'"
              class="w-4 h-4 text-white"
            />
          </div>
        </button>
      </div>

      <!-- Quick Action Cards (Location, Phone, WhatsApp) -->
      <div class="w-full flex flex-col gap-3 mb-6">
        <!-- Location Card -->
        <a
          v-if="restaurant.social_location"
          :href="formatUrl(restaurant.social_location)"
          rel="noopener noreferrer"
          class="w-full p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 backdrop-blur-md flex items-center justify-between transition-all duration-200 active:scale-[0.98] group"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <BaseIcon name="map-pin" class="w-5 h-5" />
            </div>
            <div class="flex flex-col text-right" :class="locale === 'en' ? '!text-left' : ''">
              <span class="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                {{ $t('bio_hub.location') }}
              </span>
              <span class="text-[11px] text-gray-400 font-medium">
                {{ $t('bio_hub.location_desc') }}
              </span>
            </div>
          </div>
          <BaseIcon
            name="arrow-up-right"
            class="w-4 h-4 text-gray-400 group-hover:text-white transition-colors shrink-0"
            :class="locale === 'ar' ? '-scale-x-100' : ''"
          />
        </a>

        <!-- Phone Call Card -->
        <a
          v-if="restaurant.social_phone"
          :href="`tel:${restaurant.social_phone}`"
          class="w-full p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 backdrop-blur-md flex items-center justify-between transition-all duration-200 active:scale-[0.98] group"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <BaseIcon name="phone" class="w-5 h-5" />
            </div>
            <div class="flex flex-col text-right" :class="locale === 'en' ? '!text-left' : ''">
              <span class="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                {{ $t('bio_hub.call_us') }}
              </span>
              <span class="text-[11px] text-gray-400 font-bold dir-ltr self-start">
                {{ restaurant.social_phone }}
              </span>
            </div>
          </div>
          <BaseIcon
            name="arrow-up-right"
            class="w-4 h-4 text-gray-400 group-hover:text-white transition-colors shrink-0"
            :class="locale === 'ar' ? '-scale-x-100' : ''"
          />
        </a>

        <!-- WhatsApp Direct Card -->
        <a
          v-if="whatsappUrl"
          :href="whatsappUrl"
          
          rel="noopener noreferrer"
          class="w-full p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 backdrop-blur-md flex items-center justify-between transition-all duration-200 active:scale-[0.98] group"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 flex items-center justify-center shrink-0">
              <BaseIcon name="whatsapp" class="w-5 h-5 fill-current" />
            </div>
            <div class="flex flex-col text-right" :class="locale === 'en' ? '!text-left' : ''">
              <span class="text-sm font-bold text-white group-hover:text-green-300 transition-colors">
                {{ $t('bio_hub.whatsapp') }}
              </span>
              <span class="text-[11px] text-gray-400 font-medium">
                {{ $t('bio_hub.whatsapp_desc') }}
              </span>
            </div>
          </div>
          <BaseIcon
            name="arrow-up-right"
            class="w-4 h-4 text-gray-400 group-hover:text-white transition-colors shrink-0"
            :class="locale === 'ar' ? '-scale-x-100' : ''"
          />
        </a>
      </div>

      <!-- Social Media Section (Instagram, Facebook, TikTok) -->
      <div
        v-if="hasAnySocial"
        class="w-full flex flex-col items-center gap-3 pt-2"
      >
        <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          {{ $t('bio_hub.follow_us') }}
        </span>

        <div class="flex items-center justify-center gap-3 flex-wrap">
          <!-- Instagram -->
          <a
            v-if="restaurant.social_instagram"
            :href="formatSocialUrl('instagram', restaurant.social_instagram)"
            
            rel="noopener noreferrer"
            class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/10 via-pink-500/10 to-purple-500/10 hover:from-amber-500/25 hover:via-pink-500/25 hover:to-purple-500/25 border border-pink-500/30 text-pink-400 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
            aria-label="Instagram"
          >
            <BaseIcon name="instagram" class="w-5 h-5" />
          </a>

          <!-- Facebook -->
          <a
            v-if="restaurant.social_facebook"
            :href="formatSocialUrl('facebook', restaurant.social_facebook)"
            
            rel="noopener noreferrer"
            class="w-12 h-12 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
            aria-label="Facebook"
          >
            <BaseIcon name="facebook" class="w-5 h-5" />
          </a>

          <!-- TikTok -->
          <a
            v-if="restaurant.social_tiktok"
            :href="formatSocialUrl('tiktok', restaurant.social_tiktok)"
            
            rel="noopener noreferrer"
            class="w-12 h-12 rounded-2xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
            aria-label="TikTok"
          >
            <BaseIcon name="tiktok" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </main>

    <!-- Footer: Powered by MenuJet -->
    <footer class="relative z-10 w-full py-5 text-center flex flex-col items-center justify-center gap-1 border-t border-white/5">
      <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
        <span>{{ $t('bio_hub.powered_by') }}</span>
        <a href="https://getmenujet.com"  rel="noopener noreferrer" class="text-white font-black tracking-wide">MenuJet</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  restaurant: {
    type: Object,
    required: true,
  },
  locale: {
    type: String,
    default: 'ar',
  },
});

defineEmits(['openMenu']);

const { locale: i18nLocale, setLocale } = useI18n();

const toggleLocale = () => {
  const next = props.locale === 'ar' ? 'en' : 'ar';
  if (setLocale) {
    setLocale(next);
  } else {
    i18nLocale.value = next;
  }
};

const brandColor = computed(() => props.restaurant?.primary_color || '#ea580c');

const displayName = computed(() => {
  if (props.locale === 'en' && props.restaurant?.business_name_en) {
    return props.restaurant.business_name_en;
  }
  return props.restaurant?.business_name || '';
});

const formatUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

const formatSocialUrl = (platform, value) => {
  if (!value) return '#';
  const clean = value.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  
  if (platform === 'instagram') {
    return `https://instagram.com/${clean.replace(/^@/, '')}`;
  }
  if (platform === 'facebook') {
    return `https://facebook.com/${clean}`;
  }
  if (platform === 'tiktok') {
    return `https://tiktok.com/@${clean.replace(/^@/, '')}`;
  }
  return formatUrl(clean);
};

const whatsappUrl = computed(() => {
  const number = props.restaurant?.whatsapp_number || props.restaurant?.social_phone;
  if (!number) return null;
  const digits = number.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}`;
});

const hasAnySocial = computed(() => {
  return Boolean(
    props.restaurant?.social_instagram ||
    props.restaurant?.social_facebook ||
    props.restaurant?.social_tiktok
  );
});
</script>
