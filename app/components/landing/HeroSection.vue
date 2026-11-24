<template>
  <section
    class="relative min-h-[calc(100vh-1rem)] pt-28 pb-16 lg:pt-32 lg:pb-20 flex items-center bg-gradient-to-br from-orange-50/40 via-white to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 w-full overflow-hidden transition-colors duration-300"
    @mousemove="onMouseMove"
  >
    <!-- WhatsApp-style Subtle Animated Food Pattern -->
    <div class="food-doodle-bg absolute inset-0 z-0 opacity-[.1] dark:opacity-[0.1] pointer-events-none"></div>

    <!-- Animated Background Elements with Parallax -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <!-- Blob 1 -->
      <div class="absolute w-full h-full transition-transform duration-300 ease-out" :style="{ transform: `translate(${mouseX * 30}px, ${mouseY * 30}px)` }">
        <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-200 dark:bg-orange-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-15 dark:opacity-10 animate-blob scale-150"></div>
      </div>
      <!-- Blob 2 -->
      <div class="absolute w-full h-full transition-transform duration-300 ease-out" :style="{ transform: `translate(${mouseX * -50}px, ${mouseY * -50}px)` }">
        <div class="absolute top-[10%] right-[-10%] w-96 h-96 bg-amber-100 dark:bg-amber-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000 scale-150"></div>
      </div>
      <!-- Blob 3 -->
      <div class="absolute w-full h-full transition-transform duration-300 ease-out" :style="{ transform: `translate(${mouseX * 20}px, ${mouseY * -20}px)` }">
        <div class="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-orange-200 dark:bg-orange-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-10 dark:opacity-10 animate-blob animation-delay-4000 scale-150"></div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative">
      <div class="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8">
        <!-- Content Column (Start / Right in RTL, Left in LTR) -->
        <div class="lg:col-span-6 text-center lg:text-start">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-orange-200/80 dark:border-slate-700 shadow-xs text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{{ $t('hero.eyebrow') }}</span>
          </div>

          <h1 class="text-3xl sm:text-4xl md:text-5xl xl:text-[3.35rem] font-extrabold text-gray-900 dark:text-white mb-5 leading-[1.35] drop-shadow-sm">
            {{ $t('hero.title_part1') }}
            <span class="whitespace-nowrap inline-block py-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
              {{ $t('hero.title_part2') }}
            </span>
          </h1>

          <p class="text-base sm:text-lg md:text-xl text-gray-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed whitespace-pre-line">
            {{ $t('hero.subtitle') }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
            <PrimaryButton href="#contact" @click.prevent="scrollToSection('contact')" class="w-full sm:w-auto !px-8 !py-3.5">
              {{ $t('hero.cta_start') }}
            </PrimaryButton>
            <SecondaryButton href="#features" @click.prevent="scrollToSection('features')" class="w-full sm:w-auto !px-8 !py-3.5">
              <BaseIcon name="play-circle" class="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform" />
              {{ $t('hero.cta_demo') }}
            </SecondaryButton>
          </div>

          <!-- Trust Badges -->
          <div class="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-5 sm:gap-6 text-sm sm:text-base text-gray-600 dark:text-slate-300 font-medium">
            <div class="flex items-center gap-2">
              <BaseIcon name="check-circle" solid class="w-5 h-5 text-orange-500 shrink-0" />
              <span class="leading-none">{{ $t('hero.badges.setup') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <BaseIcon name="check-circle" solid class="w-5 h-5 text-orange-500 shrink-0" />
              <span class="leading-none">{{ $t('hero.badges.ui_friendly') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <BaseIcon name="check-circle" solid class="w-5 h-5 text-orange-500 shrink-0" />
              <span class="leading-none">{{ $t('hero.badges.support') }}</span>
            </div>
          </div>
        </div>

        <!-- Interactive Visual Column (End / Left in RTL, Right in LTR) -->
        <div class="lg:col-span-6 w-full">
          <LandingHeroShowcase :mouse-x="mouseX" :mouse-y="mouseY" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const { isInstallable, triggerInstall } = usePwaInstall()

const mouseX = ref(0)
const mouseY = ref(0)

const onMouseMove = (e) => {
  if (window.innerWidth < 768) return 
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 2
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY - 80 
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>