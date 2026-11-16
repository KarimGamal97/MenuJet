<template>
  <section 
    class="relative h-[100vh] pt-40 pb-20 flex flex-col justify-center items-center bg-gradient-to-br from-orange-50 via-white to-orange-50 w-full"
    @mousemove="onMouseMove"
  >
    
    <!-- WhatsApp-style Subtle Animated Food Pattern -->
    <div class="food-doodle-bg absolute inset-0 z-0 opacity-[0.1] pointer-events-none"></div>

    <!-- Animated Background Elements with Parallax -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <!-- Blob 1 -->
      <div class="absolute w-full h-full transition-transform duration-300 ease-out" :style="{ transform: `translate(${mouseX * 30}px, ${mouseY * 30}px)` }">
        <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob scale-150"></div>
      </div>
      <!-- Blob 2 -->
      <div class="absolute w-full h-full transition-transform duration-300 ease-out" :style="{ transform: `translate(${mouseX * -50}px, ${mouseY * -50}px)` }">
        <div class="absolute top-[10%] right-[-10%] w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000 scale-150"></div>
      </div>
      <!-- Blob 3 -->
      <div class="absolute w-full h-full transition-transform duration-300 ease-out" :style="{ transform: `translate(${mouseX * 20}px, ${mouseY * -20}px)` }">
        <div class="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 scale-150"></div>
      </div>
    </div>

    <div class="container mx-auto px-6 text-center z-10 relative">
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight max-w-5xl mx-auto drop-shadow-sm">
        {{ $t('hero.title_part1') }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">{{ $t('hero.title_part2') }}</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto font-medium leading-relaxed whitespace-pre-line">
        {{ $t('hero.subtitle') }}
      </p>
      <div class="flex flex-col md:flex-row gap-6 justify-center items-center">
        <PrimaryButton href="#contact" @click.prevent="scrollToSection('contact')" class="!px-10 !py-4">
          {{ $t('hero.cta_start') }}
        </PrimaryButton>
        <SecondaryButton href="#features" @click.prevent="scrollToSection('features')" class="!px-10 !py-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ $t('hero.cta_demo') }}
        </SecondaryButton>
        <!-- <button
          v-if="isInstallable"
          @click="triggerInstall"
          class="bg-gray-900 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {{ $t('hero.cta_download') }}
        </button> -->
      </div>

      <!-- Trust Badges -->
      <div class="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm sm:text-base text-gray-600 font-medium">
        <!-- Badge 1 -->
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ $t('hero.badges.setup') }}</span>
        </div>
        <!-- Badge 2 -->
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ $t('hero.badges.ui_friendly') }}</span>
        </div>
        <!-- Badge 3 -->
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ $t('hero.badges.support') }}</span>
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

.food-doodle-bg {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320' fill='none' stroke='%23ea580c' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cg transform='translate(22,22) rotate(-12 20 20)'%3E%3Cpath d='M6 18C6 11 12 7 20 7C28 7 34 11 34 18Z'/%3E%3Cpath d='M5 22C8 20 11 24 14 22C17 20 20 24 23 22C26 20 29 24 35 22'/%3E%3Crect x='6' y='25' width='28' height='5' rx='2.5'/%3E%3Cpath d='M8 30H32V32C32 34 30 35 28 35H12C10 35 8 34 8 32Z'/%3E%3C/g%3E%3Cg transform='translate(132,20) rotate(8 18 18)'%3E%3Ccircle cx='18' cy='18' r='14'/%3E%3Ccircle cx='13' cy='15' r='1.5'/%3E%3Ccircle cx='23' cy='15' r='1.5'/%3E%3Cpath d='M12 21C14 25 22 25 24 21'/%3E%3C/g%3E%3Cg transform='translate(242,26) rotate(14 18 20)'%3E%3Cpath d='M10 14H26L23 36H13Z'/%3E%3Cpath d='M8 14H28'/%3E%3Cpath d='M18 14V5L24 3'/%3E%3Ccircle cx='18' cy='25' r='2.5'/%3E%3C/g%3E%3Cg transform='translate(72,118) rotate(-8 20 20)'%3E%3Crect x='6' y='6' width='28' height='32' rx='3'/%3E%3Cpath d='M12 13H28'/%3E%3Cpath d='M12 19H24'/%3E%3Cpath d='M12 25H26'/%3E%3Cpath d='M12 31H20'/%3E%3C/g%3E%3Cg transform='translate(202,122) rotate(10 18 20)'%3E%3Cpath d='M9 18L12 36H26L29 18C24 20 14 20 9 18Z'/%3E%3Cpath d='M13 18V9H16V18'/%3E%3Cpath d='M18 18V7H21V18'/%3E%3Cpath d='M23 18V10H26V18'/%3E%3C/g%3E%3Cg transform='translate(24,220) rotate(-16 18 18)'%3E%3Cpath d='M6 10C14 5 24 5 32 10L19 35Z'/%3E%3Cpath d='M9 14C15 10 23 10 29 14'/%3E%3Ccircle cx='18' cy='19' r='2'/%3E%3Ccircle cx='22' cy='24' r='1.5'/%3E%3C/g%3E%3Cg transform='translate(136,222) rotate(10 18 18)'%3E%3Cpath d='M8 16H26V26C26 30 22 33 17 33C12 33 8 30 8 26Z'/%3E%3Cpath d='M26 18H29C31 18 32 20 32 22C32 24 31 25 29 25H26'/%3E%3Cpath d='M13 9C13 7 15 7 15 11'/%3E%3Cpath d='M19 8C19 6 21 6 21 10'/%3E%3C/g%3E%3Cg transform='translate(244,222) rotate(-10 16 16)'%3E%3Crect x='4' y='4' width='10' height='10' rx='1.5'/%3E%3Crect x='18' y='4' width='10' height='10' rx='1.5'/%3E%3Crect x='4' y='18' width='10' height='10' rx='1.5'/%3E%3Cpath d='M18 18H22V22H18Z'/%3E%3Cpath d='M24 24H28V28H24Z'/%3E%3Cpath d='M24 18H28'/%3E%3Cpath d='M18 26H22'/%3E%3C/g%3E%3Cpath d='M92 66L94 71L99 73L94 75L92 80L90 75L85 73L90 71Z'/%3E%3Cpath d='M292 154L294 158L298 160L294 162L292 166L290 162L286 160L290 158Z'/%3E%3Ccircle cx='162' cy='175' r='2'/%3E%3Ccircle cx='35' cy='145' r='1.8'/%3E%3Ccircle cx='205' cy='68' r='1.8'/%3E%3Ccircle cx='95' cy='282' r='2'/%3E%3Ccircle cx='208' cy='288' r='1.5'/%3E%3C/svg%3E");
  background-size: 320px 320px;
  animation: doodle-drift 48s linear infinite;
}

@keyframes doodle-drift {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 320px 320px;
  }
}
</style>