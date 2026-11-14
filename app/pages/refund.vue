<template>
  <div class="min-h-screen bg-slate-50 flex flex-col" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <LandingTheNavbar />

    <main class="flex-grow pt-28 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header Section -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-black mb-4">
            <span>{{ $t('refund_page.badge') }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {{ $t('refund_page.title') }}
          </h1>
          <p class="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {{ $t('refund_page.subtitle') }}
          </p>
          <div class="mt-4 text-xs font-bold text-slate-400">
            {{ $t('refund_page.last_updated') }}
          </div>
        </div>

        <!-- Navigation Tabs -->
        <LandingLegalTabs />

        <!-- Content Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          <!-- 1. Free Trial -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('refund_page.sec1_title') }}
            </h2>
            <p>{{ $t('refund_page.sec1_desc') }}</p>
          </section>

          <!-- 2. Non-Refundable Policy -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('refund_page.sec2_title') }}
            </h2>
            <p>{{ $t('refund_page.sec2_desc') }}</p>
          </section>

          <!-- 3. Cancellation Procedure -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('refund_page.sec3_title') }}
            </h2>
            <p>{{ $t('refund_page.sec3_desc') }}</p>
            <ul class="list-disc list-inside space-y-2 text-slate-600">
              <li>
                <span>{{ $t('refund_page.sec3_item1_prefix') }}</span>
                <a
                  href="https://wa.me/201132234124"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-orange-600 hover:text-orange-700 underline font-black transition-colors inline-block"
                  dir="ltr"
                >
                  01132234124
                </a>
              </li>
              <li>{{ $t('refund_page.sec3_item2') }}</li>
            </ul>
            <p class="text-xs sm:text-sm text-slate-500">
              {{ $t('refund_page.sec3_note') }}
            </p>
          </section>

          <!-- 4. Contact Support -->
          <section class="space-y-3 pt-4 border-t border-slate-100">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('refund_page.sec4_title') }}
            </h2>
            <p>{{ $t('refund_page.sec4_desc') }}</p>
            <div class="pt-2">
              <a
                href="https://wa.me/201132234124"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-orange-500/20"
              >
                <span>{{ $t('refund_page.contact_btn') }}</span>
              </a>
            </div>
          </section>

        </div>

      </div>
    </main>

    <LandingTheFooter />
  </div>
</template>

<script setup>
const { t } = useI18n()

useHead({
  title: computed(() => `${t('refund_page.title')} - MenuJet`),
  meta: [
    {
      name: 'description',
      content: computed(() => t('refund_page.subtitle'))
    }
  ]
})
</script>
