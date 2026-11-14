<template>
  <div class="min-h-screen bg-slate-50 flex flex-col" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <LandingTheNavbar />

    <main class="flex-grow pt-28 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header Section -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-700 text-xs font-black mb-4">
            <span>{{ $t('terms_page.badge') }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {{ $t('terms_page.title') }}
          </h1>
          <p class="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {{ $t('terms_page.subtitle') }}
          </p>
          <div class="mt-4 text-xs font-bold text-slate-400">
            {{ $t('terms_page.last_updated') }}
          </div>
        </div>

        <!-- Navigation Tabs -->
        <LandingLegalTabs />

        <!-- Content Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          <!-- 1. Acceptance -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('terms_page.sec1_title') }}
            </h2>
            <p>{{ $t('terms_page.sec1_p1') }}</p>
            <p>{{ $t('terms_page.sec1_p2') }}</p>
          </section>

          <!-- 2. Nature of Service -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('terms_page.sec2_title') }}
            </h2>
            <p>{{ $t('terms_page.sec2_p1') }}</p>
            <div class="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium">
              {{ $t('terms_page.sec2_disclaimer') }}
            </div>
          </section>

          <!-- 3. Accounts & Security -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('terms_page.sec3_title') }}
            </h2>
            <ul class="list-disc list-inside space-y-2 text-slate-600">
              <li>{{ $t('terms_page.sec3_item1') }}</li>
              <li>{{ $t('terms_page.sec3_item2') }}</li>
              <li>{{ $t('terms_page.sec3_item3') }}</li>
            </ul>
          </section>

          <!-- 4. Subscriptions & Billing -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('terms_page.sec4_title') }}
            </h2>
            <p>{{ $t('terms_page.sec4_p1') }}</p>
            <p>{{ $t('terms_page.sec4_p2') }}</p>
          </section>

          <!-- 5. Acceptable Use -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('terms_page.sec5_title') }}
            </h2>
            <p>{{ $t('terms_page.sec5_desc') }}</p>
            <ul class="list-disc list-inside space-y-2 text-slate-600">
              <li>{{ $t('terms_page.sec5_item1') }}</li>
              <li>{{ $t('terms_page.sec5_item2') }}</li>
              <li>{{ $t('terms_page.sec5_item3') }}</li>
            </ul>
          </section>

          <!-- 6. Intellectual Property -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('terms_page.sec6_title') }}
            </h2>
            <p>{{ $t('terms_page.sec6_desc') }}</p>
          </section>

          <!-- 7. Termination -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('terms_page.sec7_title') }}
            </h2>
            <p>{{ $t('terms_page.sec7_desc') }}</p>
          </section>

          <!-- 8. Updates & Governing Law -->
          <section class="space-y-3 pt-4 border-t border-slate-100">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('terms_page.sec8_title') }}
            </h2>
            <p>{{ $t('terms_page.sec8_desc') }}</p>
            <div class="pt-2">
              <a
                href="https://wa.me/201132234124"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all"
              >
                <span>{{ $t('terms_page.contact_btn') }}</span>
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
  title: computed(() => `${t('terms_page.title')} - MenuJet`),
  meta: [
    {
      name: 'description',
      content: computed(() => t('terms_page.subtitle'))
    }
  ]
})
</script>
