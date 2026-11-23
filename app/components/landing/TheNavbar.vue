<template>
  <nav 
    class="fixed w-full z-50 bg-white dark:bg-slate-950/95 dark:backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-all duration-300" 
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex items-center justify-between">
      
      <!-- Right Side (Logo) -->
      <div class="flex items-center justify-start flex-1 min-w-0">
        <NuxtLink to="/" class="flex items-center group shrink-0">
          <img
            :src="isDark ? navbarLogoDark : navbarLogoLight"
            alt="MenuJet"
            :class="[
              'h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform',
              isDark ? '' : 'mix-blend-multiply'
            ]"
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
            activeSection === 'clients' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400'
          ]"
        >
          {{ $t('nav.clients') }}
          <span 
            :class="[
              'absolute -bottom-1 right-0 h-0.5 bg-orange-600 dark:bg-orange-400 transition-all duration-200',
              activeSection === 'clients' ? 'w-full' : 'w-0 hover:w-full'
            ]"
          ></span>
        </a>
        <a 
          href="#features" 
          @click.prevent="scrollToSection('features')"
          :class="[
            'relative py-1 transition-colors cursor-pointer',
            activeSection === 'features' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400'
          ]"
        >
          {{ $t('nav.features') }}
          <span 
            :class="[
              'absolute -bottom-1 right-0 h-0.5 bg-orange-600 dark:bg-orange-400 transition-all duration-200',
              activeSection === 'features' ? 'w-full' : 'w-0 hover:w-full'
            ]"
          ></span>
        </a>

        <a 
          href="#pricing" 
          @click.prevent="scrollToSection('pricing')"
          :class="[
            'relative py-1 transition-colors cursor-pointer',
            activeSection === 'pricing' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400'
          ]"
        >
          {{ $t('nav.pricing') }}
          <span 
            :class="[
              'absolute -bottom-1 right-0 h-0.5 bg-orange-600 dark:bg-orange-400 transition-all duration-200',
              activeSection === 'pricing' ? 'w-full' : 'w-0 hover:w-full'
            ]"
          ></span>
        </a>

        <a 
          href="#contact" 
          @click.prevent="scrollToSection('contact')"
          :class="[
            'relative py-1 transition-colors cursor-pointer',
            activeSection === 'contact' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400'
          ]"
        >
          {{ $t('nav.contact') }}
          <span 
            :class="[
              'absolute -bottom-1 right-0 h-0.5 bg-orange-600 dark:bg-orange-400 transition-all duration-200',
              activeSection === 'contact' ? 'w-full' : 'w-0 hover:w-full'
            ]"
          ></span>
        </a>
      </div>

      <!-- Left Side (Theme + Language Switcher + Login) -->
      <div class="hidden sm:flex items-center justify-end gap-2.5 flex-1 min-w-0">
        <!-- Theme Toggle Button -->
        <button
          type="button"
          @click="toggleTheme"
          class="h-11 w-11 inline-flex items-center justify-center rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-amber-400 transition-colors cursor-pointer shrink-0"
          :title="isDark ? $t('nav.theme_light') : $t('nav.theme_dark')"
          :aria-label="isDark ? $t('nav.theme_light') : $t('nav.theme_dark')"
        >
          <BaseIcon :name="isDark ? 'sun' : 'moon'" class="w-5 h-5 stroke-[2]" />
        </button>

        <!-- Language Dropdown -->
        <div class="relative">
          <!-- Trigger Button -->
          <button
            type="button"
            @click="isLangDropdownOpen = !isLangDropdownOpen"
            class="h-11 inline-flex items-center gap-1.5 px-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer select-none"
            :title="locale === 'ar' ? 'تغيير اللغة' : 'Change Language'"
          >
            <!-- Globe Icon -->
            <BaseIcon name="globe" class="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 stroke-[2]" />

            <!-- Current Active Language (AR / EN) -->
            <span class="text-sm font-bold tracking-wide uppercase">
              {{ locale === 'ar' ? 'AR' : 'EN' }}
            </span>

            <!-- Chevron Down Icon -->
            <BaseIcon
              name="chevron-down"
              :class="['w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 stroke-[2.5]', isLangDropdownOpen ? 'rotate-180' : '']"
            />
          </button>

          <!-- Backdrop to close on click outside -->
          <div 
            v-if="isLangDropdownOpen" 
            class="fixed inset-0 z-40" 
            @click="isLangDropdownOpen = false"
          ></div>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition duration-200 ease-out origin-top"
            enter-from-class="opacity-0 -translate-y-2 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-150 ease-in origin-top"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 -translate-y-2 scale-95"
          >
            <div
              v-if="isLangDropdownOpen"
              class="absolute end-0 top-full mt-1.5 w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 overflow-hidden"
            >
              <!-- Arabic Option -->
              <button
                type="button"
                @click="selectLanguage('ar')"
                :class="[
                  'w-full px-3.5 py-2.5 text-start text-xs flex items-center justify-between transition-colors cursor-pointer',
                  locale === 'ar' ? 'text-orange-600 dark:text-orange-400 bg-orange-50/70 dark:bg-orange-500/15 font-black' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold'
                ]"
              >
                <span>العربية</span>
                <BaseIcon v-if="locale === 'ar'" name="check" class="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 stroke-[2.5]" />
              </button>

              <!-- English Option -->
              <button
                type="button"
                @click="selectLanguage('en')"
                :class="[
                  'w-full px-3.5 py-2.5 text-start text-xs flex items-center justify-between transition-colors cursor-pointer',
                  locale === 'en' ? 'text-orange-600 dark:text-orange-400 bg-orange-50/70 dark:bg-orange-500/15 font-black' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold'
                ]"
              >
                <span>English</span>
                <BaseIcon v-if="locale === 'en'" name="check" class="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 stroke-[2.5]" />
              </button>
            </div>
          </Transition>
        </div>

        <!-- Login Button (Same Height h-11) -->
        <NuxtLink
          to="/login"
          class="h-11 px-5 inline-flex items-center justify-center rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-slate-800 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400 text-sm font-black transition-all duration-200 cursor-pointer text-center"
        >
          {{ $t('nav.login') }}
        </NuxtLink>

      </div>

      <!-- Mobile Right Controls (Theme + Lang + Toggle Hamburger) -->
      <div class="flex items-center gap-1 sm:hidden">
        <button
          type="button"
          @click="toggleTheme"
          class="h-10 w-10 inline-flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-amber-400 transition-colors cursor-pointer"
          :title="isDark ? $t('nav.theme_light') : $t('nav.theme_dark')"
          :aria-label="isDark ? $t('nav.theme_light') : $t('nav.theme_dark')"
        >
          <BaseIcon :name="isDark ? 'sun' : 'moon'" class="w-4 h-4 stroke-[2]" />
        </button>

        <div class="relative">
          <button
            type="button"
            @click="toggleLangDropdown"
            class="h-10 inline-flex items-center gap-1.5 px-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer select-none"
            :title="locale === 'ar' ? 'تغيير اللغة' : 'Change Language'"
          >
            <BaseIcon name="globe" class="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 stroke-[2]" />
            <span class="text-xs font-bold tracking-wide uppercase">{{ locale === 'ar' ? 'AR' : 'EN' }}</span>
            <BaseIcon
              name="chevron-down"
              :class="['w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 stroke-[2.5]', isLangDropdownOpen ? 'rotate-180' : '']"
            />
          </button>

          <!-- Mobile Language Backdrop -->
          <div
            v-if="isLangDropdownOpen"
            class="fixed inset-0 z-40"
            @click="isLangDropdownOpen = false"
          ></div>

          <!-- Mobile Language Dropdown -->
          <Transition
            enter-active-class="transition duration-200 ease-out origin-top"
            enter-from-class="opacity-0 -translate-y-2 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-150 ease-in origin-top"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 -translate-y-2 scale-95"
          >
            <div
              v-if="isLangDropdownOpen"
              class="absolute end-0 top-full mt-1.5 w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 overflow-hidden"
            >
              <button
                type="button"
                @click="selectLanguage('ar')"
                :class="[
                  'w-full px-3.5 py-2.5 text-start text-xs flex items-center justify-between transition-colors cursor-pointer',
                  locale === 'ar' ? 'text-orange-600 dark:text-orange-400 bg-orange-50/70 dark:bg-orange-500/15 font-black' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold'
                ]"
              >
                <span>العربية</span>
                <BaseIcon v-if="locale === 'ar'" name="check" class="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 stroke-[2.5]" />
              </button>
              <button
                type="button"
                @click="selectLanguage('en')"
                :class="[
                  'w-full px-3.5 py-2.5 text-start text-xs flex items-center justify-between transition-colors cursor-pointer',
                  locale === 'en' ? 'text-orange-600 dark:text-orange-400 bg-orange-50/70 dark:bg-orange-500/15 font-black' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold'
                ]"
              >
                <span>English</span>
                <BaseIcon v-if="locale === 'en'" name="check" class="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 stroke-[2.5]" />
              </button>
            </div>
          </Transition>
        </div>

        <button 
          type="button"
          @click="toggleMobileMenu" 
          class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors cursor-pointer"
        >
          <BaseIcon
            :name="isMobileMenuOpen ? 'close' : 'menu'"
            :class="['h-6 w-6 stroke-[2.5] transition-transform duration-300', isMobileMenuOpen ? 'rotate-90' : 'rotate-0']"
          />
        </button>
      </div>

    </div>

    <!-- Mobile Menu Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden absolute top-full left-0 w-full h-screen bg-slate-900/20 dark:bg-black/50 backdrop-blur-[2px] z-40"
        @click="isMobileMenuOpen = false"
      ></div>
    </Transition>

    <!-- Mobile Menu Dropdown -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out origin-top"
      enter-from-class="opacity-0 -translate-y-4 scale-y-95"
      enter-to-class="opacity-100 translate-y-0 scale-y-100"
      leave-active-class="transition-all duration-200 ease-in origin-top"
      leave-from-class="opacity-100 translate-y-0 scale-y-100"
      leave-to-class="opacity-0 -translate-y-4 scale-y-95"
    >
      <div 
        v-if="isMobileMenuOpen" 
        class="lg:hidden absolute top-full left-0 w-full z-50 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 rounded-b-3xl shadow-2xl py-5 px-6 flex flex-col gap-2 text-center"
      >
        <a 
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`" 
          @click.prevent="scrollToSection(item.id)" 
          :class="[
            'font-black py-3 rounded-2xl transition-colors cursor-pointer text-sm',
            activeSection === item.id
              ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/15'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
          ]"
        >
          {{ item.label }}
        </a>
        
        <hr class="border-slate-100 dark:border-slate-800 my-1.5" />

        <div class="flex flex-col gap-2.5">
          <NuxtLink 
            to="/login" 
            @click="isMobileMenuOpen = false" 
            class="w-full py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-slate-800 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400 font-black text-sm transition-colors"
          >
            {{ $t('nav.login') }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import navbarLogoLight from '~/assets/navbar-logo.svg'
import navbarLogoDark from '~/assets/navbar-logo-white.svg'

const { locale, setLocale, t } = useI18n()
const { isDark, toggleTheme } = useTheme()

const isMobileMenuOpen = ref(false)
const isLangDropdownOpen = ref(false)
const activeSection = ref('')

const navItems = computed(() => [
  { id: 'clients', label: t('nav.clients') },
  { id: 'features', label: t('nav.features') },
  { id: 'pricing', label: t('nav.pricing') },
  { id: 'contact', label: t('nav.contact') },
])

const toggleMobileMenu = () => {
  isLangDropdownOpen.value = false
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleLangDropdown = () => {
  isMobileMenuOpen.value = false
  isLangDropdownOpen.value = !isLangDropdownOpen.value
}

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
