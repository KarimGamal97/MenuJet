<template>
  <section id="pricing" class="py-24 bg-gradient-to-b from-slate-50/70 via-white to-orange-50/20 relative overflow-hidden" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="container mx-auto px-4 sm:px-6">
      
      <!-- Main Header -->
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          {{ $t('pricing.title') }}
        </h2>
        <p class="text-slate-600 text-lg md:text-xl font-medium">
          {{ $t('pricing.subtitle') }}
        </p>
      </div>

      <!-- Controls: Currency Selector & Billing Cycle Toggle -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        
        <!-- Currency Selector (Egypt / Saudi Arabia) -->
        <div class="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 gap-1.5 shadow-inner">
          <button
            type="button"
            @click="selectedCurrency = 'EGP'"
            :class="[
              'py-2 px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer',
              selectedCurrency === 'EGP'
                ? 'bg-white text-slate-900 shadow-md shadow-slate-900/10 border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            <svg class="w-5 h-3.5 rounded-xs shadow-xs shrink-0 border border-slate-200/60" viewBox="0 0 30 20" fill="none">
              <rect width="30" height="6.66" fill="#C8102E"/>
              <rect y="6.66" width="30" height="6.66" fill="#FFFFFF"/>
              <rect y="13.33" width="30" height="6.67" fill="#000000"/>
              <circle cx="15" cy="10" r="1.8" fill="#C69214"/>
            </svg>
            <span>{{ $t('pricing.currency_egp') }}</span>
          </button>

          <button
            type="button"
            @click="selectedCurrency = 'SAR'"
            :class="[
              'py-2 px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer',
              selectedCurrency === 'SAR'
                ? 'bg-white text-slate-900 shadow-md shadow-slate-900/10 border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            <svg class="w-5 h-3.5 rounded-xs shadow-xs shrink-0" viewBox="0 0 30 20" fill="none">
              <rect width="30" height="20" fill="#006C35"/>
              <path d="M8 12.5H22V13.5H8V12.5Z" fill="#FFFFFF"/>
              <path d="M10 9.5H20V11H10V9.5Z" fill="#FFFFFF" opacity="0.85"/>
            </svg>
            <span>{{ $t('pricing.currency_sar') }}</span>
          </button>
        </div>

        <!-- Monthly / Yearly Toggle -->
        <div class="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 gap-1.5 shadow-inner">
          <button
            type="button"
            @click="billingCycle = 'monthly'"
            :class="[
              'py-2 px-5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer',
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-md shadow-slate-900/10'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            {{ $t('pricing.monthly') }}
          </button>

          <button
            type="button"
            @click="billingCycle = 'yearly'"
            :class="[
              'py-2 px-5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex items-center gap-2 cursor-pointer',
              billingCycle === 'yearly'
                ? 'bg-white text-slate-900 shadow-md shadow-slate-900/10'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            <span>{{ $t('pricing.yearly') }}</span>
            <span class="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">
              {{ $t('pricing.save_badge') }}
            </span>
          </button>
        </div>

      </div>

      <!-- Plans Grid (2 Cards) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto items-stretch">

        <!-- 1. Basic Plan -->
        <div class="bg-white rounded-[2.5rem] p-8 sm:p-10 border-2 border-slate-200/80 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between relative group">
          <div>
            <!-- Icon -->
            <div class="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <BaseIcon name="briefcase" class="w-7 h-7 text-amber-600" />
            </div>

            <!-- Title & Description -->
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              {{ $t('pricing.basic.title') }}
            </h3>
            <p class="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              {{ $t('pricing.basic.desc') }}
            </p>

            <!-- Price -->
            <div class="mb-8 pb-6 border-b border-slate-100">
              <div class="flex items-baseline gap-1.5">
                <span class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {{ currentPrices.basic[billingCycle].price.toLocaleString() }}
                </span>
                <span class="text-slate-600 text-base font-bold">{{ currencySymbol }}</span>
                <span class="text-slate-400 text-sm font-bold">/ {{ billingCycle === 'yearly' ? $t('pricing.per_year') : $t('pricing.per_month') }}</span>
              </div>
              <p v-if="billingCycle === 'yearly'" class="text-xs text-emerald-600 font-bold mt-1.5">
                {{ basicYearlyNote }}
              </p>
            </div>

            <!-- Features List -->
            <ul class="space-y-4 mb-8 text-sm font-bold text-slate-700">
              <li v-for="featKey in basicFeatures" :key="featKey" class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <BaseIcon name="check" class="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span>{{ $t(featKey) }}</span>
              </li>
            </ul>
          </div>

          <!-- Subscribe Button -->
          <div>
            <NuxtLink
              to="/login?mode=signup"
              class="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl text-center shadow-lg transition-all duration-200 transform active:scale-98 text-base block cursor-pointer"
            >
              {{ $t('pricing.cta_start') }}
            </NuxtLink>
          </div>
        </div>

        <!-- 2. Pro Plan -->
        <div class="bg-white rounded-[2.5rem] p-8 sm:p-10 border-2 border-orange-500/90 shadow-2xl shadow-orange-500/10 hover:shadow-orange-500/15 transition-all duration-300 flex flex-col justify-between relative group">
          
          <!-- Most Popular Badge -->
          <div class="absolute -top-4 right-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md shadow-orange-500/20 flex items-center gap-1.5">
            <span>{{ $t('pricing.pro.popular_badge') }}</span>
          </div>

          <div>
            <!-- Icon -->
            <div class="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <BaseIcon name="bolt" class="w-7 h-7 text-orange-600" />
            </div>

            <!-- Title & Description -->
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              {{ $t('pricing.pro.title') }}
            </h3>
            <p class="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              {{ $t('pricing.pro.desc') }}
            </p>

            <!-- Price -->
            <div class="mb-8 pb-6 border-b border-slate-100">
              <div class="flex items-baseline gap-1.5">
                <span class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {{ currentPrices.pro[billingCycle].price.toLocaleString() }}
                </span>
                <span class="text-slate-600 text-base font-bold">{{ currencySymbol }}</span>
                <span class="text-slate-400 text-sm font-bold">/ {{ billingCycle === 'yearly' ? $t('pricing.per_year') : $t('pricing.per_month') }}</span>
              </div>
              <p v-if="billingCycle === 'yearly'" class="text-xs text-emerald-600 font-bold mt-1.5">
                {{ proYearlyNote }}
              </p>
            </div>

            <!-- Basic Features Included Badge -->
            <div class="bg-orange-50 border border-orange-200/70 text-orange-800 text-xs font-black p-2.5 rounded-xl text-center mb-6 flex items-center justify-center gap-1.5">
              <span>{{ $t('pricing.pro.includes_basic') }}</span>
            </div>

            <!-- Pro Extra Features List -->
            <ul class="space-y-4 mb-8 text-sm font-bold text-slate-700">
              <li v-for="featKey in proFeatures" :key="featKey" class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <BaseIcon name="check" class="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span>{{ $t(featKey) }}</span>
              </li>
            </ul>
          </div>

          <!-- Pro Subscribe Button -->
          <div>
            <NuxtLink
              to="/login?mode=signup"
              class="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-4 rounded-2xl text-center shadow-lg shadow-orange-500/25 transition-all duration-200 transform active:scale-98 text-base block cursor-pointer"
            >
              {{ $t('pricing.cta_start') }}
            </NuxtLink>
          </div>
        </div>

      </div>

      <!-- Footer Note (Guarantee & 14-day Free Trial) -->
      <div class="mt-16 text-center max-w-2xl mx-auto flex flex-col items-center gap-5">
        <div class="flex items-center justify-center gap-2 text-slate-500 text-sm md:text-base font-medium">
          <BaseIcon name="shield-check" class="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{{ $t('pricing.footer.guarantee') }}</span>
        </div>

        <NuxtLink
          to="/login?mode=signup"
          class="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-black text-base md:text-lg py-4 px-10 rounded-2xl shadow-xl shadow-slate-900/10 transition-all duration-300 transform hover:-translate-y-1 active:scale-98 cursor-pointer"
        >
          <BaseIcon name="bolt" solid class="w-5 h-5 text-amber-400 shrink-0" />
          <span>{{ $t('pricing.footer.trial_cta') }}</span>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const { t } = useI18n()

const selectedCurrency = ref('EGP')
const billingCycle = ref('monthly')

const basicFeatures = [
  'pricing.basic.feat_unlimited',
  'pricing.basic.feat_search',
  'pricing.basic.feat_shifts',
  'pricing.basic.feat_variants',
  'pricing.basic.feat_out_of_stock',
  'pricing.basic.feat_branding',
  'pricing.basic.feat_reports_archive',
  'pricing.basic.feat_alerts_edit',
  'pricing.basic.feat_qr_studio',
]

const proFeatures = [
  'pricing.pro.feat_bio_hub',
  'pricing.pro.feat_announcement_banner',
  'pricing.pro.feat_staff',
  'pricing.pro.feat_whatsapp',
  'pricing.pro.feat_delivery',
  'pricing.pro.feat_hours',
  'pricing.pro.feat_analytics_charts',
  'pricing.pro.feat_payments',
  'pricing.pro.feat_tables_queue',
]

const pricingData = {
  SAR: {
    basic: {
      monthly: { price: 20 },
      yearly: { price: 200 }
    },
    pro: {
      monthly: { price: 40 },
      yearly: { price: 400 }
    }
  },
  EGP: {
    basic: {
      monthly: { price: 250 },
      yearly: { price: 2500 }
    },
    pro: {
      monthly: { price: 500 },
      yearly: { price: 5000 }
    }
  }
}

const currencySymbol = computed(() => {
  return t(`pricing.symbol_${selectedCurrency.value.toLowerCase()}`)
})

const currentPrices = computed(() => pricingData[selectedCurrency.value])

const basicYearlyNote = computed(() => {
  return t(`pricing.basic.yearly_note_${selectedCurrency.value.toLowerCase()}`)
})

const proYearlyNote = computed(() => {
  return t(`pricing.pro.yearly_note_${selectedCurrency.value.toLowerCase()}`)
})

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}
</script>

<style scoped>
#pricing {
  font-family: 'Cairo', 'Tajawal', sans-serif;
}
</style>
