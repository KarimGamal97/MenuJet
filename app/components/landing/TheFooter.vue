<template>
  <footer class="bg-white border-t border-slate-200/80 text-slate-600 select-none" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
        
        <!-- Brand Info (2 columns on large) -->
        <div class="lg:col-span-2 space-y-4">
          <NuxtLink to="/" class="flex items-center group inline-flex">
            <img
              src="~/assets/navbar-logo.webp"
              alt="MenuJet"
              class="h-20 sm:h-24 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </NuxtLink>
          <p class="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
            {{ $t('landing_footer.desc') }}
          </p>
          <div class="flex items-center gap-2 pt-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200/60">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {{ $t('landing_footer.badge_commission') }}
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-black border border-orange-200/60">
              {{ $t('landing_footer.badge_support') }}
            </span>
          </div>
        </div>

        <!-- Col 1: Platform Links -->
        <div class="space-y-3">
          <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">
            {{ $t('landing_footer.col_platform') }}
          </h4>
          <ul class="space-y-1.5 text-xs sm:text-sm">
            <li>
              <NuxtLink
                to="/#features"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/#features') 
                  ? 'bg-orange-50 text-orange-600 font-black shadow-2xs' 
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50 font-bold'"
              >
                <span v-if="isCurrentRoute('/#features')" class="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0"></span>
                <span>{{ $t('landing_footer.link_features') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/#pricing"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/#pricing') 
                  ? 'bg-orange-50 text-orange-600 font-black shadow-2xs' 
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50 font-bold'"
              >
                <span v-if="isCurrentRoute('/#pricing')" class="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0"></span>
                <span>{{ $t('landing_footer.link_pricing') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/faq"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/faq') 
                  ? 'bg-orange-50 text-orange-600 font-black shadow-2xs' 
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50 font-bold'"
              >
                <span v-if="isCurrentRoute('/faq')" class="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0"></span>
                <span>{{ $t('landing_footer.link_faq') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/#contact"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/#contact') 
                  ? 'bg-orange-50 text-orange-600 font-black shadow-2xs' 
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50 font-bold'"
              >
                <span v-if="isCurrentRoute('/#contact')" class="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0"></span>
                <span>{{ $t('landing_footer.link_demo') }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 2: Legal & Trust -->
        <div class="space-y-3">
          <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">
            {{ $t('landing_footer.col_legal') }}
          </h4>
          <ul class="space-y-1.5 text-xs sm:text-sm">
            <li>
              <NuxtLink
                to="/privacy"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/privacy') 
                  ? 'bg-orange-50 text-orange-600 font-black shadow-2xs' 
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50 font-bold'"
              >
                <span v-if="isCurrentRoute('/privacy')" class="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0"></span>
                <span>{{ $t('landing_footer.link_privacy') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/terms"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/terms') 
                  ? 'bg-orange-50 text-orange-600 font-black shadow-2xs' 
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50 font-bold'"
              >
                <span v-if="isCurrentRoute('/terms')" class="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0"></span>
                <span>{{ $t('landing_footer.link_terms') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/refund"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/refund') 
                  ? 'bg-orange-50 text-orange-600 font-black shadow-2xs' 
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50 font-bold'"
              >
                <span v-if="isCurrentRoute('/refund')" class="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0"></span>
                <span>{{ $t('landing_footer.link_refund') }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 3: Support & Access -->
        <div class="space-y-3">
          <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider">
            {{ $t('landing_footer.col_support') }}
          </h4>
          <ul class="space-y-1.5 text-xs sm:text-sm">
            <li>
              <NuxtLink
                to="/login"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all"
                :class="isCurrentRoute('/login') 
                  ? 'bg-orange-50 text-orange-600 font-black shadow-2xs' 
                  : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50 font-bold'"
              >
                <span v-if="isCurrentRoute('/login')" class="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0"></span>
                <span>{{ $t('landing_footer.link_login') }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/login?mode=signup"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all text-slate-600 hover:text-orange-600 hover:bg-slate-50 font-bold"
              >
                <span>{{ $t('landing_footer.link_register') }}</span>
              </NuxtLink>
            </li>
            <li>
              <a
                href="https://wa.me/201132234124"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 py-1 px-2.5 -mx-2.5 rounded-xl transition-all text-slate-600 hover:text-orange-600 hover:bg-slate-50 font-bold"
              >
                <span>{{ $t('landing_footer.link_whatsapp') }}</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
        <div>
          © {{ new Date().getFullYear() }} MenuJet. {{ $t('landing_footer.all_rights') }}
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <NuxtLink
            to="/privacy"
            class="transition-colors py-1 px-2.5 rounded-lg text-xs"
            :class="isCurrentRoute('/privacy') ? 'text-orange-600 font-black bg-orange-50' : 'text-slate-400 hover:text-slate-700'"
          >
            {{ $t('landing_footer.link_privacy') }}
          </NuxtLink>
          <span>•</span>
          <NuxtLink
            to="/terms"
            class="transition-colors py-1 px-2.5 rounded-lg text-xs"
            :class="isCurrentRoute('/terms') ? 'text-orange-600 font-black bg-orange-50' : 'text-slate-400 hover:text-slate-700'"
          >
            {{ $t('landing_footer.link_terms') }}
          </NuxtLink>
          <span>•</span>
          <NuxtLink
            to="/refund"
            class="transition-colors py-1 px-2.5 rounded-lg text-xs"
            :class="isCurrentRoute('/refund') ? 'text-orange-600 font-black bg-orange-50' : 'text-slate-400 hover:text-slate-700'"
          >
            {{ $t('landing_footer.link_refund') }}
          </NuxtLink>
          <span>•</span>
          <NuxtLink
            to="/faq"
            class="transition-colors py-1 px-2.5 rounded-lg text-xs"
            :class="isCurrentRoute('/faq') ? 'text-orange-600 font-black bg-orange-50' : 'text-slate-400 hover:text-slate-700'"
          >
            {{ $t('landing_footer.link_faq') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const route = useRoute()

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
