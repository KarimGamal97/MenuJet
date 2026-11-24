<template>
  <footer class="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 select-none transition-colors duration-300" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 pb-5">
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8 lg:gap-12">
        
        <!-- Brand Info (2 columns on large) -->
        <div class="col-span-2 space-y-4">
          <NuxtLink to="/" class="flex items-center group inline-flex">
            <img
              :src="navbarLogo"
              alt="MenuJet"
              :class="[
                'h-20 sm:h-24 w-auto object-contain group-hover:scale-105 transition-transform',
                isDark ? '' : 'mix-blend-multiply'
              ]"
            />
          </NuxtLink>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
            {{ $t('landing_footer.desc') }}
          </p>
          <div class="flex items-center gap-2 pt-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-200/60 dark:border-emerald-500/30">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {{ $t('landing_footer.badge_commission') }}
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300 text-xs font-black border border-orange-200/60 dark:border-orange-500/30">
              {{ $t('landing_footer.badge_support') }}
            </span>
          </div>

          <div class="flex items-center gap-2.5 pt-1">
            <a
              v-for="social in socialButtons"
              :key="social.key"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.label"
              :title="social.label"
              :class="[
                'w-10 h-10 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer',
                social.hoverClass,
              ]"
            >
              <BaseIcon :name="social.icon" class="w-5 h-5 stroke-[1.9]" />
            </a>
          </div>
        </div>

        <!-- Col 1: Platform Links -->
        <div class="space-y-3">
          <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {{ $t('landing_footer.col_platform') }}
          </h4>
          <ul class="space-y-1.5 text-xs sm:text-sm">
            <li>
              <NuxtLink
                to="/#features"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/#features') 
                  ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 font-black shadow-2xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold'"
              >
                <span v-if="isCurrentRoute('/#features')" class="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0"></span>
                <span>{{ $t('landing_footer.link_features') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/#clients"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/#clients') 
                  ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 font-black shadow-2xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold'"
              >
                <span v-if="isCurrentRoute('/#clients')" class="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0"></span>
                <span>{{ $t('landing_footer.link_clients') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/#pricing"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/#pricing') 
                  ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 font-black shadow-2xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold'"
              >
                <span v-if="isCurrentRoute('/#pricing')" class="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0"></span>
                <span>{{ $t('landing_footer.link_pricing') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/faq"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/faq') 
                  ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 font-black shadow-2xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold'"
              >
                <span v-if="isCurrentRoute('/faq')" class="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0"></span>
                <span>{{ $t('landing_footer.link_faq') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/#contact"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/#contact') 
                  ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 font-black shadow-2xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold'"
              >
                <span v-if="isCurrentRoute('/#contact')" class="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0"></span>
                <span>{{ $t('landing_footer.link_demo') }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 2: Legal & Trust -->
        <div class="space-y-3">
          <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {{ $t('landing_footer.col_legal') }}
          </h4>
          <ul class="space-y-1.5 text-xs sm:text-sm">
            <li>
              <NuxtLink
                to="/privacy"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/privacy') 
                  ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 font-black shadow-2xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold'"
              >
                <span v-if="isCurrentRoute('/privacy')" class="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0"></span>
                <span>{{ $t('landing_footer.link_privacy') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/terms"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/terms') 
                  ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 font-black shadow-2xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold'"
              >
                <span v-if="isCurrentRoute('/terms')" class="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0"></span>
                <span>{{ $t('landing_footer.link_terms') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/refund"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/refund') 
                  ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 font-black shadow-2xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold'"
              >
                <span v-if="isCurrentRoute('/refund')" class="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0"></span>
                <span>{{ $t('landing_footer.link_refund') }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 3: Support & Access -->
        <div class="space-y-3">
          <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {{ $t('landing_footer.col_support') }}
          </h4>
          <ul class="space-y-1.5 text-xs sm:text-sm">
            <li>
              <NuxtLink
                to="/login"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/login') 
                  ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 font-black shadow-2xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold'"
              >
                <span v-if="isCurrentRoute('/login')" class="w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0"></span>
                <span>{{ $t('landing_footer.link_login') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/login?mode=signup"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold"
              >
                <span>{{ $t('landing_footer.link_register') }}</span>
              </NuxtLink>
            </li>
            <li>
              <a
                :href="getSupportWhatsAppUrl()"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold"
              >
                <span>{{ $t('landing_footer.link_whatsapp') }}</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="mt-10 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-center text-xs font-bold text-slate-400 dark:text-slate-500">
        <div>
          © {{ new Date().getFullYear() }} MenuJet. {{ $t('landing_footer.all_rights') }}
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import navbarLogo from '~/assets/navbar-logo.svg'

const route = useRoute()
const { t } = useI18n()
const { isDark } = useTheme()

const socialButtons = computed(() => [
  {
    key: 'facebook',
    icon: 'facebook',
    href: SOCIAL_LINKS.facebook,
    label: t('landing_footer.social_facebook'),
    hoverClass: 'hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/40 hover:bg-blue-50 dark:hover:bg-blue-500/15',
  },
  {
    key: 'instagram',
    icon: 'instagram',
    href: SOCIAL_LINKS.instagram,
    label: t('landing_footer.social_instagram'),
    hoverClass: 'hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-200 dark:hover:border-pink-500/40 hover:bg-pink-50 dark:hover:bg-pink-500/15',
  },
])

const isCurrentRoute = (targetPath) => {
  if (!targetPath) return false
  const current = route.path.replace(/\/+$/, '') || '/'
  const target = targetPath.replace(/\/+$/, '') || '/'

  // Clean localized prefix (e.g. /en/privacy -> /privacy)
  const cleanCurrent = current.replace(/^\/(ar|en)(?=\/|$)/, '') || '/'
  const cleanTarget = target.replace(/^\/(ar|en)(?=\/|$)/, '') || '/'

  if (target.includes('#')) {
    const hash = target.substring(target.indexOf('#'))
    return route.hash === hash && cleanCurrent === '/'
  }

  return cleanCurrent === cleanTarget
}
</script>
