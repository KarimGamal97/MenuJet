<template>
  <section id="clients" class="py-16 sm:py-24 bg-slate-50/70 dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800 relative overflow-hidden transition-colors duration-300" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    
    <!-- Decorative background glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100/40 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 dark:bg-orange-500/15 dark:border dark:border-orange-500/25 text-orange-700 dark:text-orange-300 text-xs font-black mb-4 shadow-2xs">
          <span>{{ $t('clients.badge') }}</span>
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.45] mb-4">
          {{ $t('clients.title_part1') }} 
          <span class="relative inline-block py-1 text-orange-600 dark:text-orange-400">
            {{ $t('clients.title_part2') }}
            <svg
              class="absolute -bottom-2 left-0 w-full h-3 text-orange-300 dark:text-orange-500/60 pointer-events-none"
              viewBox="0 0 200 14"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M3 10.5C52 3.5 142 2.5 197 9.5"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </h2>
        <p class="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {{ $t('clients.subtitle') }}
        </p>
      </div>

      <!-- Mobile Slider (2 logos per view, seamless infinite loop + arrows) -->
      <div
        class="sm:hidden relative w-full py-4 px-8"
        dir="ltr"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <button
          type="button"
          @click="prevSlide"
          aria-label="Previous"
          class="absolute left-0 top-1/2 -translate-y-7 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs text-slate-600 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 flex items-center justify-center transition-colors cursor-pointer"
        >
          <BaseIcon name="chevron-left" class="w-4 h-4 stroke-[2.5]" />
        </button>

        <div class="overflow-hidden w-full">
          <div
            :class="['flex', isTransitioning ? 'transition-transform duration-500 ease-out' : 'transition-none']"
            :style="{ transform: `translateX(-${slideOffset * 50}%)` }"
            @transitionend="onTrackTransitionEnd"
          >
            <div
              v-for="(client, idx) in mobileTrackClients"
              :key="'m-' + client.slug + '-' + idx"
              class="w-1/2 shrink-0 flex items-center justify-center px-2"
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
                  class="w-20 h-20 object-contain rounded-2xl dark:bg-white/95 dark:p-1.5 dark:shadow-lg dark:shadow-black/30 transition-transform duration-300"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>

        <button
          type="button"
          @click="nextSlide"
          aria-label="Next"
          class="absolute right-0 top-1/2 -translate-y-7 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs text-slate-600 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 flex items-center justify-center transition-colors cursor-pointer"
        >
          <BaseIcon name="chevron-right" class="w-4 h-4 stroke-[2.5]" />
        </button>

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
              activeDotIndex === idx
                ? 'w-6 bg-orange-500'
                : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
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
            class="w-24 h-24 object-contain rounded-2xl dark:bg-white/95 dark:p-2 dark:shadow-lg dark:shadow-black/30 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </a>
      </div>

      <!-- Desktop Case 2: 4 or more logos -> Infinite moving Carousel / Marquee -->
      <div v-else class="hidden sm:block relative w-full overflow-hidden py-4">
        
        <!-- Left & Right Fade Masks -->
        <div class="pointer-events-none absolute inset-y-0 start-0 w-16 sm:w-32 bg-gradient-to-r rtl:bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10"></div>
        <div class="pointer-events-none absolute inset-y-0 end-0 w-16 sm:w-32 bg-gradient-to-l rtl:bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10"></div>

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
                  class="w-24 h-24 object-contain rounded-2xl dark:bg-white/95 dark:p-2 dark:shadow-lg dark:shadow-black/30 transition-transform duration-300 group-hover:scale-105"
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
                  class="w-24 h-24 object-contain rounded-2xl dark:bg-white/95 dark:p-2 dark:shadow-lg dark:shadow-black/30 transition-transform duration-300 group-hover:scale-105"
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

const slideOffset = ref(0)
const isTransitioning = ref(true)
let slideTimer = null
let touchStartX = 0

const mobileTrackClients = computed(() => [...clientsList, ...clientsList])
const activeDotIndex = computed(() => ((slideOffset.value % clientsList.length) + clientsList.length) % clientsList.length)

const nextSlide = () => {
  if (!isTransitioning.value) isTransitioning.value = true
  slideOffset.value += 1
  startAutoSlide()
}

const prevSlide = () => {
  if (slideOffset.value <= 0) {
    isTransitioning.value = false
    slideOffset.value = clientsList.length
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isTransitioning.value = true
        slideOffset.value = clientsList.length - 1
      })
    })
  } else {
    isTransitioning.value = true
    slideOffset.value -= 1
  }
  startAutoSlide()
}

const onTrackTransitionEnd = () => {
  if (slideOffset.value >= clientsList.length) {
    isTransitioning.value = false
    slideOffset.value = slideOffset.value % clientsList.length
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isTransitioning.value = true
      })
    })
  }
}

const startAutoSlide = () => {
  stopAutoSlide()
  slideTimer = setInterval(() => {
    if (!isTransitioning.value) isTransitioning.value = true
    slideOffset.value += 1
  }, 3000)
}

const stopAutoSlide = () => {
  if (slideTimer) {
    clearInterval(slideTimer)
    slideTimer = null
  }
}

const goToSlide = (idx) => {
  isTransitioning.value = true
  slideOffset.value = idx
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
      nextSlide()
    } else {
      prevSlide()
    }
    return
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
