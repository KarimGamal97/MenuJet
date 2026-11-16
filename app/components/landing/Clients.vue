<template>
  <section id="clients" class="py-16 sm:py-24 bg-slate-50/70 border-y border-slate-200/60 relative overflow-hidden" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    
    <!-- Decorative background glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-700 text-xs font-black mb-4 shadow-2xs">
          <span>{{ $t('clients.badge') }}</span>
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
          {{ $t('clients.title_part1') }} 
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
            {{ $t('clients.title_part2') }}
          </span>
        </h2>
        <p class="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {{ $t('clients.subtitle') }}
        </p>
      </div>

      <!-- Mobile Slider with Dots -->
      <div
        class="sm:hidden relative w-full overflow-hidden py-4"
        dir="ltr"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <div
          class="flex transition-transform duration-500 ease-out"
          :style="{ transform: `translateX(-${activeSlide * 100}%)` }"
        >
          <div
            v-for="client in clientsList"
            :key="'m-' + client.slug"
            class="w-full shrink-0 flex items-center justify-center"
          >
            <a
              :href="client.url"
              target="_blank"
              rel="noopener noreferrer"
              :title="$t(client.nameKey)"
              class="group flex items-center justify-center transition-transform duration-300 hover:scale-105 cursor-pointer"
            >
              <img
                :src="client.logo"
                :alt="$t(client.nameKey)"
                class="w-20 h-20 object-contain rounded-2xl transition-transform duration-300"
                loading="lazy"
              />
            </a>
          </div>
        </div>

        <!-- Slider Dots -->
        <div class="flex items-center justify-center gap-2 mt-6">
          <button
            v-for="(client, idx) in clientsList"
            :key="'dot-' + client.slug"
            type="button"
            @click="goToSlide(idx)"
            :aria-label="$t(client.nameKey)"
            :class="[
              'h-2 rounded-full transition-all duration-300 cursor-pointer',
              activeSlide === idx
                ? 'w-6 bg-orange-500'
                : 'w-2 bg-slate-300 hover:bg-slate-400'
            ]"
          ></button>
        </div>
      </div>

      <!-- Desktop Case 1: Less than 4 logos -> Centered in one clean row -->
      <div v-if="clientsList.length < 4" class="hidden sm:flex items-center justify-center gap-14 lg:gap-20 py-4">
        <a
          v-for="client in clientsList"
          :key="client.slug"
          :href="client.url"
          target="_blank"
          rel="noopener noreferrer"
          :title="$t(client.nameKey)"
          class="group flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer"
        >
          <img
            :src="client.logo"
            :alt="$t(client.nameKey)"
            class="w-24 h-24 object-contain rounded-2xl transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </a>
      </div>

      <!-- Desktop Case 2: 4 or more logos -> Infinite moving Carousel / Marquee -->
      <div v-else class="hidden sm:block relative w-full overflow-hidden py-4">
        
        <!-- Left & Right Fade Masks -->
        <div class="pointer-events-none absolute inset-y-0 start-0 w-16 sm:w-32 bg-gradient-to-r rtl:bg-gradient-to-l from-slate-50 to-transparent z-10"></div>
        <div class="pointer-events-none absolute inset-y-0 end-0 w-16 sm:w-32 bg-gradient-to-l rtl:bg-gradient-to-r from-slate-50 to-transparent z-10"></div>

        <div class="ticker-wrapper" dir="ltr">
          <div class="ticker-track">
            
            <div class="ticker-group flex items-center gap-12 sm:gap-16 shrink-0 pr-12 sm:pr-16">
              <a
                v-for="(client, idx) in repeatedClients"
                :key="'c1-' + idx"
                :href="client.url"
                target="_blank"
                rel="noopener noreferrer"
                :title="$t(client.nameKey)"
                class="group flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer"
              >
                <img
                  :src="client.logo"
                  :alt="$t(client.nameKey)"
                  class="w-24 h-24 object-contain rounded-2xl transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </a>
            </div>

            <div class="ticker-group flex items-center gap-12 sm:gap-16 shrink-0 pr-12 sm:pr-16" aria-hidden="true">
              <a
                v-for="(client, idx) in repeatedClients"
                :key="'c2-' + idx"
                :href="client.url"
                target="_blank"
                rel="noopener noreferrer"
                :title="$t(client.nameKey)"
                tabindex="-1"
                class="group flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer"
              >
                <img
                  :src="client.logo"
                  :alt="$t(client.nameKey)"
                  class="w-24 h-24 object-contain rounded-2xl transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </a>
            </div>

          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import bgoLogo from '~/assets/logos/bgo.png'
import deltaLogo from '~/assets/logos/deltacoffee.jpg'
import tamimLogo from '~/assets/logos/tamim.jpg'

const clientsList = [
  {
    slug: 'tamim',
    nameKey: 'clients.tamim_name',
    logo: tamimLogo,
    url: 'https://getmenujet.com/menu/tamim'
  },
  {
    slug: 'bgo',
    nameKey: 'clients.bgo_name',
    logo: bgoLogo,
    url: 'https://getmenujet.com/menu/bgo'
  },
  {
    slug: 'delta-coffee',
    nameKey: 'clients.delta_name',
    logo: deltaLogo,
    url: 'https://getmenujet.com/menu/delta-coffee'
  }
]

const activeSlide = ref(0)
let slideTimer = null
let touchStartX = 0

const startAutoSlide = () => {
  stopAutoSlide()
  slideTimer = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % clientsList.length
  }, 3000)
}

const stopAutoSlide = () => {
  if (slideTimer) {
    clearInterval(slideTimer)
    slideTimer = null
  }
}

const goToSlide = (idx) => {
  activeSlide.value = idx
  startAutoSlide()
}

const onTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
  stopAutoSlide()
}

const onTouchEnd = (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX
  if (Math.abs(diff) > 40) {
    if (diff > 0) {
      activeSlide.value = (activeSlide.value + 1) % clientsList.length
    } else {
      activeSlide.value = (activeSlide.value - 1 + clientsList.length) % clientsList.length
    }
  }
  startAutoSlide()
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})

// Used only if clients count >= 4 on desktop
const repeatedClients = computed(() => {
  if (clientsList.length < 4) return []
  return [...clientsList, ...clientsList]
})
</script>

<style scoped>
.ticker-wrapper {
  display: flex;
  width: 100%;
  overflow: hidden;
  user-select: none;
}

.ticker-track {
  display: flex;
  width: max-content;
  animation: scrollTicker 30s linear infinite;
  will-change: transform;
}

.ticker-track:hover {
  animation-play-state: paused;
}

@keyframes scrollTicker {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
