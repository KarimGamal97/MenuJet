<template>
  <div
    ref="stageRef"
    class="relative mx-auto w-full max-w-[540px] h-[500px] sm:h-[560px] flex items-center justify-center select-none"
    @mousemove="onStageMouseMove"
    @mouseenter="isHovered = true"
    @mouseleave="onStageLeave"
  >
    <!-- Soft Ambient Halo Behind Phone (No Rings) -->
    <div
      class="absolute inset-8 rounded-full bg-gradient-to-tr from-orange-300/25 via-amber-200/20 to-orange-400/15 dark:from-orange-500/15 dark:via-amber-500/10 dark:to-orange-600/15 blur-3xl pointer-events-none transition-transform duration-500 ease-out"
      :style="parallaxStyle(10)"
    ></div>

    <!-- 3D Interactive iPhone Mockup -->
    <div
      class="relative z-20 transition-all duration-300 ease-out will-change-transform"
      :style="phoneTransformStyle"
    >
      <!-- Outer Chassis -->
      <div
        class="relative w-[248px] sm:w-[274px] rounded-[44px] bg-slate-900 dark:bg-slate-800 p-2.5 shadow-[0_28px_55px_-15px_rgba(15,23,42,0.34)] dark:shadow-[0_28px_60px_-12px_rgba(0,0,0,0.75)] ring-1 ring-white/15"
      >
        <!-- Subtle Glossy Hover Sheen -->
        <div
          class="pointer-events-none absolute inset-0 rounded-[44px] bg-gradient-to-tr from-transparent via-white/10 to-white/25 transition-opacity duration-500"
          :class="isHovered ? 'opacity-90' : 'opacity-35'"
        ></div>

        <!-- Hardware Side Buttons -->
        <span class="hidden sm:block absolute -start-[3px] top-24 w-[3px] h-7 rounded-s bg-slate-700"></span>
        <span class="hidden sm:block absolute -start-[3px] top-36 w-[3px] h-8 rounded-s bg-slate-700"></span>
        <span class="hidden sm:block absolute -end-[3px] top-28 w-[3px] h-12 rounded-e bg-slate-700"></span>

        <!-- Screen -->
        <div
          class="relative overflow-hidden rounded-[36px] bg-[#F7F5F2] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-3"
        >
          <!-- Dynamic Island & Status Bar -->
          <div class="bg-[#16161A] dark:bg-slate-900 text-white px-4 pt-2.5 pb-3.5 rounded-b-2xl">
            <div class="flex items-center justify-between text-[10px] font-bold opacity-90 mb-2.5" dir="ltr">
              <span>9:41</span>
              <span class="w-16 h-4 rounded-full bg-black border border-white/10"></span>
              <span class="inline-flex items-center gap-1">
                <span class="w-4 h-2.5 rounded-[3px] border border-white/80 p-[1.5px] flex items-center">
                  <span class="w-full h-full bg-white rounded-[1px]"></span>
                </span>
              </span>
            </div>

            <!-- Restaurant Header -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-2 min-w-0">
                <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center p-1 shrink-0 shadow-sm">
                  <img :src="burgerIcon" alt="" class="w-full h-full object-contain" />
                </div>
                <div class="min-w-0 text-start">
                  <p class="text-xs font-extrabold leading-tight truncate">
                    {{ $t('hero.showcase.restaurant_name') }}
                  </p>
                  <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 text-[9px] font-bold mt-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {{ $t('hero.showcase.open_now') }}
                  </span>
                </div>
              </div>
              <span class="text-xs font-black tracking-tight shrink-0" dir="ltr">
                Menu<span class="text-orange-500">Jet</span>
              </span>
            </div>

            <!-- Search Pill -->
            <div class="bg-white dark:bg-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-300 shadow-xs">
              <span>{{ $t('hero.showcase.search_placeholder') }}</span>
              <BaseIcon name="search" class="w-3.5 h-3.5 text-slate-500 dark:text-slate-300 shrink-0" />
            </div>
          </div>

          <!-- Category Pills -->
          <div class="px-3 pt-2.5 pb-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              v-for="cat in categories"
              :key="cat.key"
              type="button"
              @click="activeCategory = cat.key"
              :class="[
                'px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer',
                activeCategory === cat.key
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-orange-300'
              ]"
            >
              {{ $t(cat.labelKey) }}
            </button>
          </div>

          <!-- Menu Cards -->
          <div class="px-3 space-y-2 mt-1 min-h-[246px] sm:min-h-[264px]">
            <div
              v-for="item in visibleItems"
              :key="item.id"
              class="group/card flex items-center gap-2.5 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs hover:border-orange-200 dark:hover:border-orange-500/40 transition-all"
            >
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-50/90 dark:bg-slate-800 p-1.5 shrink-0 flex items-center justify-center group-hover/card:scale-105 transition-transform">
                <img :src="item.icon" :alt="$t(item.nameKey)" class="w-full h-full object-contain" />
              </div>

              <div class="flex-1 min-w-0 text-start">
                <p class="text-[11px] sm:text-xs font-extrabold text-slate-900 dark:text-white truncate">
                  {{ $t(item.nameKey) }}
                </p>
                <p class="text-[9px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {{ $t(item.descKey) }}
                </p>
                <p class="text-[11px] font-black text-orange-700 dark:text-orange-400 mt-1">
                  {{ item.price }} {{ $t('hero.showcase.currency') }}
                </p>
              </div>

              <button
                type="button"
                @click="addToDemoCart"
                class="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-90 text-white flex items-center justify-center shadow-sm shadow-orange-500/30 transition-all shrink-0 cursor-pointer"
                aria-label="Add item"
              >
                <BaseIcon name="plus" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Mini Bottom Nav -->
          <div class="mx-3 mt-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-3 py-2 flex items-center justify-around shadow-sm">
            <div class="flex flex-col items-center gap-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
              <BaseIcon name="history" class="w-3.5 h-3.5" />
              <span>{{ $t('hero.showcase.nav_orders') }}</span>
            </div>
            <div class="relative flex flex-col items-center gap-0.5 text-[9px] font-extrabold text-orange-600 dark:text-orange-400">
              <BaseIcon name="cart" class="w-4 h-4" />
              <span>{{ $t('hero.showcase.nav_cart') }}</span>
              <span
                class="absolute -top-1.5 -end-2.5 min-w-[16px] h-4 px-1 rounded-full bg-slate-900 dark:bg-orange-500 text-white text-[9px] font-black flex items-center justify-center transition-transform"
                :class="cartPulse ? 'scale-125' : 'scale-100'"
              >
                {{ cartCount }}
              </span>
            </div>
            <div class="flex flex-col items-center gap-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
              <BaseIcon name="store" class="w-3.5 h-3.5" />
              <span>{{ $t('hero.showcase.nav_about') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Food Icons (Burger, Pizza, Coffee, Fries — Calm Depth) -->
    <!-- 1. Burger (Top Start) -->
    <div
      class="hidden sm:flex absolute top-14 start-6 z-30 transition-transform duration-300 ease-out pointer-events-none"
      :style="parallaxStyle(16)"
    >
      <div class="hero-float hero-float-1 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-orange-100/90 dark:border-slate-700 p-2 shadow-lg shadow-slate-900/10 dark:shadow-black/35 -rotate-6">
        <img :src="burgerIcon" alt="" class="w-full h-full object-contain drop-shadow-xs" />
      </div>
    </div>

    <!-- 2. Coffee (Mid End) -->
    <div
      class="hidden sm:flex absolute top-44 end-2 sm:end-4 z-10 transition-transform duration-300 ease-out pointer-events-none"
      :style="parallaxStyle(-14)"
    >
      <div class="hero-float hero-float-2 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-orange-100/90 dark:border-slate-700 p-2 shadow-lg shadow-slate-900/10 dark:shadow-black/35 rotate-6">
        <img :src="coffeeIcon" alt="" class="w-full h-full object-contain drop-shadow-xs" />
      </div>
    </div>

    <!-- 3. Fries (Mid Start) -->
    <div
      class="hidden sm:flex absolute bottom-40 start-3 sm:start-5 z-10 transition-transform duration-300 ease-out pointer-events-none"
      :style="parallaxStyle(14)"
    >
      <div class="hero-float hero-float-3 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-orange-100/90 dark:border-slate-700 p-2 shadow-lg shadow-slate-900/10 dark:shadow-black/35 rotate-6">
        <img :src="friesIcon" alt="" class="w-full h-full object-contain drop-shadow-xs" />
      </div>
    </div>

    <!-- 4. Pizza (Bottom End) -->
    <div
      class="hidden sm:flex absolute bottom-12 end-4 sm:end-7 z-30 transition-transform duration-300 ease-out pointer-events-none"
      :style="parallaxStyle(-16)"
    >
      <div class="hero-float hero-float-4 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-orange-100/90 dark:border-slate-700 p-2 shadow-lg shadow-slate-900/10 dark:shadow-black/35 -rotate-3">
        <img :src="pizzaIcon" alt="" class="w-full h-full object-contain drop-shadow-xs" />
      </div>
    </div>

    <!-- 2 Clean MenuJet-Focused Floating Badges -->
    <!-- Badge 1: WhatsApp Order (Top End) -->
    <div
      class="absolute top-4 end-1 sm:top-9 sm:end-4 z-30 transition-transform duration-300 ease-out"
      :style="parallaxStyle(-20)"
    >
      <div class="hero-float hero-float-2 flex items-center gap-2.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-emerald-100 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 shadow-xl shadow-slate-900/10 dark:shadow-black/40">
        <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <BaseIcon name="whatsapp" solid class="w-5 h-5" />
        </div>
        <div class="text-start">
          <p class="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
            {{ $t('hero.showcase.notif1_title') }}
          </p>
          <p class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            {{ $t('hero.showcase.notif1_sub') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Badge 2: Instant QR & Price Updates (Bottom Start) -->
    <div
      class="absolute bottom-4 start-1 sm:bottom-10 sm:start-2 z-30 transition-transform duration-300 ease-out"
      :style="parallaxStyle(20)"
    >
      <div class="hero-float hero-float-1 flex items-center gap-2.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-orange-100 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 shadow-xl shadow-slate-900/10 dark:shadow-black/40">
        <div class="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
          <BaseIcon name="qr-code" class="w-5 h-5" />
        </div>
        <div class="text-start">
          <p class="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
            {{ $t('hero.showcase.notif2_title') }}
          </p>
          <p class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            {{ $t('hero.showcase.notif2_sub') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import burgerIcon from '~/assets/hero/MenuJet_Icon_burger.svg'
import coffeeIcon from '~/assets/hero/MenuJet_Icon_coffee.svg'
import pizzaIcon from '~/assets/hero/MenuJet_Icon_pizza.svg'
import friesIcon from '~/assets/hero/MenuJet_Icon_fries.svg'

const props = defineProps({
  mouseX: {
    type: Number,
    default: 0,
  },
  mouseY: {
    type: Number,
    default: 0,
  },
})

const { locale } = useI18n()

const stageRef = ref(null)
const isHovered = ref(false)
const localX = ref(0)
const localY = ref(0)
const activeCategory = ref('all')
const cartCount = ref(2)
const cartPulse = ref(false)

const categories = [
  { key: 'all', labelKey: 'hero.showcase.cat_all' },
  { key: 'burger', labelKey: 'hero.showcase.cat_burger' },
  { key: 'pizza', labelKey: 'hero.showcase.cat_pizza' },
  { key: 'coffee', labelKey: 'hero.showcase.cat_coffee' },
]

const menuItems = [
  {
    id: 1,
    category: 'burger',
    icon: burgerIcon,
    nameKey: 'hero.showcase.item1_name',
    descKey: 'hero.showcase.item1_desc',
    price: 185,
  },
  {
    id: 2,
    category: 'pizza',
    icon: pizzaIcon,
    nameKey: 'hero.showcase.item2_name',
    descKey: 'hero.showcase.item2_desc',
    price: 210,
  },
  {
    id: 3,
    category: 'burger',
    icon: friesIcon,
    nameKey: 'hero.showcase.item3_name',
    descKey: 'hero.showcase.item3_desc',
    price: 65,
  },
  {
    id: 4,
    category: 'coffee',
    icon: coffeeIcon,
    nameKey: 'hero.showcase.item4_name',
    descKey: 'hero.showcase.item4_desc',
    price: 85,
  },
]

const visibleItems = computed(() => {
  if (activeCategory.value === 'all') {
    return menuItems.slice(0, 3)
  }
  return menuItems.filter((item) => item.category === activeCategory.value)
})

const onStageMouseMove = (e) => {
  if (!stageRef.value || window.innerWidth < 768) return
  const rect = stageRef.value.getBoundingClientRect()
  localX.value = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  localY.value = ((e.clientY - rect.top) / rect.height - 0.5) * 2
}

const onStageLeave = () => {
  isHovered.value = false
  localX.value = 0
  localY.value = 0
}

const activeX = computed(() => (isHovered.value ? localX.value : props.mouseX * 0.4))
const activeY = computed(() => (isHovered.value ? localY.value : props.mouseY * 0.4))

const phoneTransformStyle = computed(() => {
  const restTiltZ = locale.value === 'ar' ? 2 : -2
  const rotY = activeX.value * (isHovered.value ? 9 : 3.5)
  const rotX = -activeY.value * (isHovered.value ? 7.5 : 2.5)
  const liftY = isHovered.value ? -4 : 0
  const liftScale = isHovered.value ? 1.025 : 1
  const rotZ = isHovered.value ? restTiltZ * 0.35 : restTiltZ

  return {
    transform: `perspective(1200px) translateY(${liftY}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ}deg) scale(${liftScale})`,
  }
})

const parallaxStyle = (strength) => {
  const factor = isHovered.value ? 1.15 : 0.45
  const tx = activeX.value * strength * factor
  const ty = activeY.value * strength * factor
  return {
    transform: `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`,
  }
}

const addToDemoCart = () => {
  cartCount.value += 1
  cartPulse.value = true
  setTimeout(() => {
    cartPulse.value = false
  }, 240)
}
</script>

<style scoped>
@keyframes heroFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-7px);
  }
}

.hero-float {
  animation: heroFloat 5.8s ease-in-out infinite;
}

.hero-float-1 {
  animation-duration: 5.5s;
  animation-delay: 0s;
}

.hero-float-2 {
  animation-duration: 6.4s;
  animation-delay: -1.6s;
}

.hero-float-3 {
  animation-duration: 6s;
  animation-delay: -3s;
}

.hero-float-4 {
  animation-duration: 6.8s;
  animation-delay: -1s;
}

@media (prefers-reduced-motion: reduce) {
  .hero-float {
    animation: none;
  }
}
</style>
