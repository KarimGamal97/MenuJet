<template>
  <nav 
    class="fixed w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-xs transition-all duration-300" 
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="container relative mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
      
      <!-- Right Side (Logo) -->
      <NuxtLink to="/" class="flex items-center gap-2 group shrink-0">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
          ⚡
        </div>
        <span class="text-2xl font-black bg-gradient-to-r from-slate-950 via-slate-800 to-orange-600 bg-clip-text text-transparent tracking-tight">
          MenuJet
        </span>
      </NuxtLink>
      
      <!-- Center (Desktop Nav Links) -->
      <div class="hidden lg:flex items-center gap-8 text-sm font-bold absolute left-1/2 -translate-x-1/2">
        <a 
          href="#features" 
          @click.prevent="scrollToSection('features')"
          :class="[
            'relative py-1 transition-colors cursor-pointer',
            activeSection === 'features' ? 'text-orange-600' : 'text-slate-600 hover:text-orange-600'
          ]"
        >
          {{ $t('nav.features') }}
          <span 
            :class="[
              'absolute -bottom-1 right-0 h-0.5 bg-orange-600 transition-all duration-200',
              activeSection === 'features' ? 'w-full' : 'w-0 hover:w-full'
            ]"
          ></span>
        </a>
        <a 
          href="#faqs" 
          @click.prevent="scrollToSection('faqs')"
          :class="[
            'relative py-1 transition-colors cursor-pointer',
            activeSection === 'faqs' ? 'text-orange-600' : 'text-slate-600 hover:text-orange-600'
          ]"
        >
          {{ $t('nav.faqs') }}
          <span 
            :class="[
              'absolute -bottom-1 right-0 h-0.5 bg-orange-600 transition-all duration-200',
              activeSection === 'faqs' ? 'w-full' : 'w-0 hover:w-full'
            ]"
          ></span>
        </a>

        <a 
          href="#pricing" 
          @click.prevent="scrollToSection('pricing')"
          :class="[
            'relative py-1 transition-colors cursor-pointer',
            activeSection === 'pricing' ? 'text-orange-600' : 'text-slate-600 hover:text-orange-600'
          ]"
        >
          {{ $t('nav.pricing') }}
          <span 
            :class="[
              'absolute -bottom-1 right-0 h-0.5 bg-orange-600 transition-all duration-200',
              activeSection === 'pricing' ? 'w-full' : 'w-0 hover:w-full'
            ]"
          ></span>
        </a>

        <a 
          href="#contact" 
          @click.prevent="scrollToSection('contact')"
          :class="[
            'relative py-1 transition-colors cursor-pointer',
            activeSection === 'contact' ? 'text-orange-600' : 'text-slate-600 hover:text-orange-600'
          ]"
        >
          {{ $t('nav.contact') }}
          <span 
            :class="[
              'absolute -bottom-1 right-0 h-0.5 bg-orange-600 transition-all duration-200',
              activeSection === 'contact' ? 'w-full' : 'w-0 hover:w-full'
            ]"
          ></span>
        </a>
      </div>

      <!-- Left Side (Language Switcher + Login + Start Now) -->
      <div class="hidden sm:flex items-center gap-3">
        
        <!-- Language Switcher Pill Button -->
        <button
          type="button"
          @click="toggleLanguage"
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50/90 hover:bg-slate-100 text-slate-700 text-xs font-black transition-all cursor-pointer shadow-2xs"
          :title="locale === 'ar' ? 'Switch to English' : 'التحويل للعربية'"
        >
          <span>{{ locale === 'ar' ? 'English' : 'العربية' }}</span>
          <svg class="w-4 h-4 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </button>

        <!-- Login Button -->
        <NuxtLink
          to="/login"
          class="px-5 py-2.5 rounded-2xl border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-slate-800 hover:text-orange-600 text-sm font-black transition-all duration-200 cursor-pointer text-center"
        >
          {{ $t('nav.login') }}
        </NuxtLink>

        <!-- Start Free CTA Button -->
        <NuxtLink
          to="#pricing"
          class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-sm font-black shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 transform active:scale-95 cursor-pointer text-center"
        >
          {{ $t('nav.start_free') }}
        </NuxtLink>

      </div>

      <!-- Mobile Right Controls (Lang + Toggle Hamburger) -->
      <div class="flex items-center gap-2 sm:hidden">
        <button
          type="button"
          @click="toggleLanguage"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs font-black cursor-pointer"
        >
          <span>{{ locale === 'ar' ? 'English' : 'العربية' }}</span>
          <svg class="w-3.5 h-3.5 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </button>

        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen" 
          class="p-2 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-slate-100 focus:outline-none transition-colors"
        >
          <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

    </div>

    <!-- Mobile Menu Dropdown -->
    <div 
      v-show="isMobileMenuOpen" 
      class="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-2xl py-5 px-6 flex flex-col gap-3 text-center origin-top transition-all"
    >
      <a 
        href="#features" 
        @click.prevent="scrollToSection('features')" 
        :class="['font-black py-2.5 rounded-xl transition cursor-pointer text-sm', activeSection === 'features' ? 'text-orange-600 bg-orange-50' : 'text-slate-700 hover:bg-slate-50']"
      >
        {{ $t('nav.features') }}
      </a>
      <a 
        href="#how-it-works" 
        @click.prevent="scrollToSection('how-it-works')" 
        :class="['font-black py-2.5 rounded-xl transition cursor-pointer text-sm', activeSection === 'how-it-works' ? 'text-orange-600 bg-orange-50' : 'text-slate-700 hover:bg-slate-50']"
      >
        {{ $t('nav.how_it_works') }}
      </a>
      <a 
        href="#faqs" 
        @click.prevent="scrollToSection('faqs')" 
        :class="['font-black py-2.5 rounded-xl transition cursor-pointer text-sm', activeSection === 'faqs' ? 'text-orange-600 bg-orange-50' : 'text-slate-700 hover:bg-slate-50']"
      >
        {{ $t('nav.faqs') }}
      </a>
      <a 
        href="#pricing" 
        @click.prevent="scrollToSection('pricing')" 
        :class="['font-black py-2.5 rounded-xl transition cursor-pointer text-sm', activeSection === 'pricing' ? 'text-orange-600 bg-orange-50' : 'text-slate-700 hover:bg-slate-50']"
      >
        {{ $t('nav.pricing') }}
      </a>
      <a 
        href="#contact" 
        @click.prevent="scrollToSection('contact')" 
        :class="['font-black py-2.5 rounded-xl transition cursor-pointer text-sm', activeSection === 'contact' ? 'text-orange-600 bg-orange-50' : 'text-slate-700 hover:bg-slate-50']"
      >
        {{ $t('nav.contact') }}
      </a>
      
      <hr class="border-slate-100 my-2" />

      <div class="flex flex-col gap-2.5">
        <NuxtLink 
          to="/login" 
          @click="isMobileMenuOpen = false" 
          class="w-full py-3 rounded-2xl border-2 border-slate-200 text-slate-800 font-black text-sm"
        >
          {{ $t('nav.login') }}
        </NuxtLink>
        <NuxtLink 
          to="/login?mode=signup" 
          @click="isMobileMenuOpen = false" 
          class="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm shadow-md"
        >
          {{ $t('nav.start_free') }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const { locale, setLocale } = useI18n()

const isMobileMenuOpen = ref(false)
const activeSection = ref('')

const toggleLanguage = () => {
  const nextLocale = locale.value === 'ar' ? 'en' : 'ar'
  setLocale(nextLocale)
}

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
