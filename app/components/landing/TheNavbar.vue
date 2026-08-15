<template>
  <nav 
    class="fixed w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm transition-all duration-300" 
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <!-- Logo -->
      <NuxtLink to="/" class="text-3xl font-black bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent hover:scale-105 transition-transform">
        MenuJet
      </NuxtLink>
      
      <!-- Desktop Menu -->
      <div class="hidden md:flex gap-8 items-center font-medium">
        <a 
          href="#features" 
          @click.prevent="scrollToSection('features')"
          :class="['relative group transition-colors cursor-pointer', activeSection === 'features' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600']"
        >
          {{ $t('nav.features') }}
          <span :class="['absolute -bottom-1 left-0 h-0.5 bg-orange-600 transition-all', activeSection === 'features' ? 'w-full' : 'w-0 group-hover:w-full']"></span>
        </a>
        <a 
          href="#pricing" 
          @click.prevent="scrollToSection('pricing')"
          :class="['relative group transition-colors cursor-pointer', activeSection === 'pricing' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600']"
        >
          {{ $t('nav.pricing') }}
          <span :class="['absolute -bottom-1 left-0 h-0.5 bg-orange-600 transition-all', activeSection === 'pricing' ? 'w-full' : 'w-0 group-hover:w-full']"></span>
        </a>
        <a 
          href="#contact" 
          @click.prevent="scrollToSection('contact')"
          :class="['relative group transition-colors cursor-pointer', activeSection === 'contact' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600']"
        >
          {{ $t('nav.contact') }}
          <span :class="['absolute -bottom-1 left-0 h-0.5 bg-orange-600 transition-all', activeSection === 'contact' ? 'w-full' : 'w-0 group-hover:w-full']"></span>
        </a>

        <!-- CTA Button -->
        <PrimaryButton to="/login" class="!px-8 !py-2.5 shadow-md">
          {{ $t('nav.login')}}
        </PrimaryButton>
      </div>

      <!-- Mobile Menu Button -->
      <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden text-gray-600 hover:text-orange-600 focus:outline-none">
        <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <div 
      v-show="isMobileMenuOpen" 
      class="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-4 px-6 flex flex-col gap-4 text-center origin-top transition-all"
    >
      <a 
        href="#features" 
        @click.prevent="scrollToSection('features')" 
        :class="['font-medium py-2 rounded-lg transition cursor-pointer', activeSection === 'features' ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600']"
      >
        {{ $t('nav.features')}}
      </a>
      <a 
        href="#pricing" 
        @click.prevent="scrollToSection('pricing')" 
        :class="['font-medium py-2 rounded-lg transition cursor-pointer', activeSection === 'pricing' ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600']"
      >
        {{ $t('nav.pricing') }}
      </a>
      <a 
        href="#contact" 
        @click.prevent="scrollToSection('contact')" 
        :class="['font-medium py-2 rounded-lg transition cursor-pointer', activeSection === 'contact' ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600']"
      >
        {{ $t('nav.contact') }}
      </a>
      <hr class="border-gray-100 my-2" />

      <PrimaryButton to="/login" @click="isMobileMenuOpen = false" class="mt-2 w-full !text-base">
        {{ $t('nav.login')}}
      </PrimaryButton>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)
const activeSection = ref('')

const scrollToSection = (sectionId) => {
  activeSection.value = sectionId
  isMobileMenuOpen.value = false
  
  const element = document.getElementById(sectionId)
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY - 80 
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}
</script>

