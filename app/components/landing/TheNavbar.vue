<template>
  <nav 
    class="fixed w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-xs transition-all duration-300" 
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex items-center justify-between">
      
      <!-- Right Side (Logo) -->
      <div class="flex items-center justify-start flex-1 min-w-0">
        <NuxtLink to="/" class="flex items-center group shrink-0">
          <img
            src="~/assets/navbar-logo.webp"
            alt="MenuJet"
            class="h-16 sm:h-20 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </NuxtLink>
      </div>
      
      <!-- Center (Desktop Nav Links) -->
      <div class="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-sm font-bold shrink-0">
        <a 
          href="#clients" 
          @click.prevent="scrollToSection('clients')"
          :class="[
            'relative py-1 transition-colors cursor-pointer',
            activeSection === 'clients' ? 'text-orange-600' : 'text-slate-600 hover:text-orange-600'
          ]"
        >
          {{ $t('nav.clients') }}
          <span 
            :class="[
              'absolute -bottom-1 right-0 h-0.5 bg-orange-600 transition-all duration-200',
              activeSection === 'clients' ? 'w-full' : 'w-0 hover:w-full'
            ]"
          ></span>
        </a>
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

      <!-- Left Side (Language Switcher + Login) -->
      <div class="hidden sm:flex items-center justify-end gap-3 flex-1 min-w-0">
        
        <!-- Language Dropdown -->
        <div class="relative">
          <!-- Trigger Button -->
          <button
            type="button"
            @click="isLangDropdownOpen = !isLangDropdownOpen"
            class="h-11 inline-flex items-center gap-1.5 px-3 rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer select-none"
            :title="locale === 'ar' ? 'تغيير اللغة' : 'Change Language'"
          >
            <!-- Globe Icon -->
            <svg class="w-5 h-5 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>

            <!-- Current Active Language (AR / EN) -->
            <span class="text-sm font-bold tracking-wide uppercase">
              {{ locale === 'ar' ? 'AR' : 'EN' }}
            </span>

            <!-- Chevron Down Icon -->
            <svg 
              :class="['w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-200', isLangDropdownOpen ? 'rotate-180' : '']" 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          <!-- Backdrop to close on click outside -->
          <div 
            v-if="isLangDropdownOpen" 
            class="fixed inset-0 z-40" 
            @click="isLangDropdownOpen = false"
          ></div>

          <!-- Dropdown Menu -->
          <div
            v-if="isLangDropdownOpen"
            class="absolute end-0 top-full mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 overflow-hidden"
          >
            <!-- Arabic Option -->
            <button
              type="button"
              @click="selectLanguage('ar')"
              :class="[
                'w-full px-3.5 py-2.5 text-start text-xs flex items-center justify-between transition-colors cursor-pointer',
                locale === 'ar' ? 'text-orange-600 bg-orange-50/70 font-black' : 'text-slate-700 hover:bg-slate-50 font-bold'
              ]"
            >
              <span>العربية</span>
              <svg v-if="locale === 'ar'" class="w-4 h-4 text-orange-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>

            <!-- English Option -->
            <button
              type="button"
              @click="selectLanguage('en')"
              :class="[
                'w-full px-3.5 py-2.5 text-start text-xs flex items-center justify-between transition-colors cursor-pointer',
                locale === 'en' ? 'text-orange-600 bg-orange-50/70 font-black' : 'text-slate-700 hover:bg-slate-50 font-bold'
              ]"
            >
              <span>English</span>
              <svg v-if="locale === 'en'" class="w-4 h-4 text-orange-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Login Button (Same Height h-11) -->
        <NuxtLink
          to="/login"
          class="h-11 px-5 inline-flex items-center justify-center rounded-2xl border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-slate-800 hover:text-orange-600 text-sm font-black transition-all duration-200 cursor-pointer text-center"
        >
          {{ $t('nav.login') }}
        </NuxtLink>

      </div>

      <!-- Mobile Right Controls (Lang + Toggle Hamburger) -->
      <div class="flex items-center gap-1.5 sm:hidden">
        <div class="relative">
          <button
            type="button"
            @click="isLangDropdownOpen = !isLangDropdownOpen"
            class="h-10 inline-flex items-center gap-1.5 px-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer select-none"
            :title="locale === 'ar' ? 'تغيير اللغة' : 'Change Language'"
          >
            <svg class="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span class="text-xs font-bold tracking-wide uppercase">{{ locale === 'ar' ? 'AR' : 'EN' }}</span>
            <svg :class="['w-3 h-3 text-slate-500 shrink-0 transition-transform duration-200', isLangDropdownOpen ? 'rotate-180' : '']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          <!-- Mobile Dropdown Menu -->
          <div
            v-if="isLangDropdownOpen"
            class="absolute end-0 top-full mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 overflow-hidden"
          >
            <button
              type="button"
              @click="selectLanguage('ar')"
              :class="[
                'w-full px-3.5 py-2.5 text-start text-xs flex items-center justify-between transition-colors cursor-pointer',
                locale === 'ar' ? 'text-orange-600 bg-orange-50/70 font-black' : 'text-slate-700 hover:bg-slate-50 font-bold'
              ]"
            >
              <span>العربية</span>
              <svg v-if="locale === 'ar'" class="w-4 h-4 text-orange-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <button
              type="button"
              @click="selectLanguage('en')"
              :class="[
                'w-full px-3.5 py-2.5 text-start text-xs flex items-center justify-between transition-colors cursor-pointer',
                locale === 'en' ? 'text-orange-600 bg-orange-50/70 font-black' : 'text-slate-700 hover:bg-slate-50 font-bold'
              ]"
            >
              <span>English</span>
              <svg v-if="locale === 'en'" class="w-4 h-4 text-orange-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>
        </div>

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
        href="#clients" 
        @click.prevent="scrollToSection('clients')" 
        :class="['font-black py-2.5 rounded-xl transition cursor-pointer text-sm', activeSection === 'clients' ? 'text-orange-600 bg-orange-50' : 'text-slate-700 hover:bg-slate-50']"
      >
        {{ $t('nav.clients') }}
      </a>
      <a 
        href="#features" 
        @click.prevent="scrollToSection('features')" 
        :class="['font-black py-2.5 rounded-xl transition cursor-pointer text-sm', activeSection === 'features' ? 'text-orange-600 bg-orange-50' : 'text-slate-700 hover:bg-slate-50']"
      >
        {{ $t('nav.features') }}
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
          class="w-full py-3 rounded-2xl border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-slate-800 hover:text-orange-600 font-black text-sm transition-colors"
        >
          {{ $t('nav.login') }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const { locale, setLocale } = useI18n()

const isMobileMenuOpen = ref(false)
const isLangDropdownOpen = ref(false)
const activeSection = ref('')

const selectLanguage = (code) => {
  setLocale(code)
  isLangDropdownOpen.value = false
}

const toggleLanguage = () => {
  const nextLocale = locale.value === 'ar' ? 'en' : 'ar'
  setLocale(nextLocale)
}

const route = useRoute()

const handleScroll = () => {
  if (typeof window === 'undefined') return

  // If at bottom of page, highlight contact
  if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 70) {
    activeSection.value = 'contact'
    return
  }

  const scrollPosition = window.scrollY + 140

  const clientsEl = document.getElementById('clients')
  const featuresEl = document.getElementById('features')
  const pricingEl = document.getElementById('pricing')
  const faqsEl = document.getElementById('faqs')
  const contactEl = document.getElementById('contact')

  if (contactEl && scrollPosition >= contactEl.offsetTop) {
    activeSection.value = 'contact'
  } else if (faqsEl && scrollPosition >= faqsEl.offsetTop) {
    activeSection.value = ''
  } else if (pricingEl && scrollPosition >= pricingEl.offsetTop) {
    activeSection.value = 'pricing'
  } else if (featuresEl && scrollPosition >= featuresEl.offsetTop) {
    activeSection.value = 'features'
  } else if (clientsEl && scrollPosition >= clientsEl.offsetTop) {
    activeSection.value = 'clients'
  } else {
    activeSection.value = ''
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const scrollToSection = async (sectionId) => {
  activeSection.value = sectionId
  isMobileMenuOpen.value = false
  
  const element = document.getElementById(sectionId)
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY - 90 
    window.scrollTo({ top: y, behavior: 'smooth' })
  } else {
    await navigateTo(`/#${sectionId}`)
  }
}
</script>
