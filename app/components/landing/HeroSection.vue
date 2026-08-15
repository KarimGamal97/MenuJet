<template>
  <section 
    class="relative h-[100vh] pt-40 pb-20 flex flex-col justify-center items-center bg-gradient-to-br from-orange-50 via-white to-orange-50 w-full"
    @mousemove="onMouseMove"
  >
    
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
      <h1 class="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight drop-shadow-sm">
        {{ $t('hero.title_part1') }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">{{ $t('hero.title_part2') }}</span>
      </h1>
      <p class="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto font-medium">
        {{ $t('hero.subtitle') }}
      </p>
      <div class="flex flex-col md:flex-row gap-6 justify-center items-center">
        <PrimaryButton href="#contact" @click.prevent="scrollToSection('contact')" class="!px-10 !py-4">
          {{ $t('hero.cta_start') }}
        </PrimaryButton>
        <SecondaryButton href="#demo" @click.prevent="scrollToSection('demo')" class="!px-10 !py-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ $t('hero.cta_demo') }}
        </SecondaryButton>
        <button
          v-if="isInstallable"
          @click="triggerInstall"
          class="bg-gray-900 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {{ $t('hero.cta_download') }}
        </button>
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
          <span>{{ $t('hero.badges.no_credit') }}</span>
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
</style>