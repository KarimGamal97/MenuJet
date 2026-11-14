<template>
  <div class="min-h-screen bg-slate-50 flex flex-col" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <LandingTheNavbar />

    <main class="flex-grow pt-28 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header Section -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-700 text-xs font-black mb-4">
            <span>{{ $t('privacy_page.badge') }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {{ $t('privacy_page.title') }}
          </h1>
          <p class="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            {{ $t('privacy_page.subtitle') }}
          </p>
          <div class="mt-4 text-xs font-bold text-slate-400">
            {{ $t('privacy_page.last_updated') }}
          </div>
        </div>

        <!-- Navigation Tabs -->
        <LandingLegalTabs />

        <!-- Content Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          <!-- 1. Introduction -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('privacy_page.sec1_title') }}
            </h2>
            <p>{{ $t('privacy_page.sec1_p1') }}</p>
            <p>{{ $t('privacy_page.sec1_p2') }}</p>
          </section>

          <!-- 2. Data We Collect -->
          <section class="space-y-4">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('privacy_page.sec2_title') }}
            </h2>
            <div class="space-y-3">
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 class="font-black text-slate-900 mb-1">
                  {{ $t('privacy_page.sec2_a_title') }}
                </h3>
                <p class="text-slate-600 text-xs sm:text-sm">
                  {{ $t('privacy_page.sec2_a_desc') }}
                </p>
              </div>

              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 class="font-black text-slate-900 mb-1">
                  {{ $t('privacy_page.sec2_b_title') }}
                </h3>
                <p class="text-slate-600 text-xs sm:text-sm">
                  {{ $t('privacy_page.sec2_b_desc') }}
                </p>
              </div>

              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 class="font-black text-slate-900 mb-1">
                  {{ $t('privacy_page.sec2_c_title') }}
                </h3>
                <p class="text-slate-600 text-xs sm:text-sm">
                  {{ $t('privacy_page.sec2_c_desc') }}
                </p>
              </div>
            </div>
          </section>

          <!-- 3. How We Use Data -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('privacy_page.sec3_title') }}
            </h2>
            <ul class="list-disc list-inside space-y-2 text-slate-600">
              <li>{{ $t('privacy_page.sec3_item1') }}</li>
              <li>{{ $t('privacy_page.sec3_item2') }}</li>
              <li>{{ $t('privacy_page.sec3_item3') }}</li>
              <li>{{ $t('privacy_page.sec3_item4') }}</li>
              <li>{{ $t('privacy_page.sec3_item5') }}</li>
            </ul>
          </section>

          <!-- 4. Third-Party Services -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('privacy_page.sec4_title') }}
            </h2>
            <p>{{ $t('privacy_page.sec4_desc') }}</p>
            <ul class="list-disc list-inside space-y-2 text-slate-600">
              <li>{{ $t('privacy_page.sec4_item1') }}</li>
              <li>{{ $t('privacy_page.sec4_item2') }}</li>
              <li>{{ $t('privacy_page.sec4_item3') }}</li>
            </ul>
          </section>

          <!-- 5. Data Security -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('privacy_page.sec5_title') }}
            </h2>
            <p>{{ $t('privacy_page.sec5_desc') }}</p>
          </section>

          <!-- 6. User Rights -->
          <section class="space-y-3">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('privacy_page.sec6_title') }}
            </h2>
            <p>{{ $t('privacy_page.sec6_desc') }}</p>
          </section>

          <!-- 7. Contact -->
          <section class="space-y-3 pt-4 border-t border-slate-100">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-600"></span>
              {{ $t('privacy_page.sec7_title') }}
            </h2>
            <p>{{ $t('privacy_page.sec7_desc') }}</p>
            <div class="pt-2">
              <a
                href="https://wa.me/201132234124"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all"
              >
                <span>{{ $t('privacy_page.contact_btn') }}</span>
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
  title: computed(() => `${t('privacy_page.title')} - MenuJet`),
  meta: [
    {
      name: 'description',
      content: computed(() => t('privacy_page.subtitle'))
    }
  ]
})
</script>
