<template>
  <div class="min-h-screen bg-slate-50 flex flex-col" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <LandingTheNavbar />

    <main class="flex-grow pt-28 pb-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header Section -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-700 text-xs font-black mb-4">
            <span>{{ $t('faq_page.badge') }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {{ $t('faq_page.title') }}
          </h1>
          <p class="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            {{ $t('faq_page.subtitle') }}
          </p>

          <!-- Navigation Tabs -->
          <LandingLegalTabs />

          <!-- Search Input -->
          <div class="relative max-w-xl mx-auto">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('faq_page.search_placeholder')"
              class="w-full py-3.5 ps-11 pe-4 bg-white rounded-2xl border border-slate-200 shadow-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-bold text-slate-800 transition-all placeholder:text-slate-400"
            />
            <div class="absolute inset-y-0 start-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''"
              class="absolute inset-y-0 end-3 flex items-center text-xs font-bold text-slate-400 hover:text-slate-700 px-2"
            >
              {{ $t('faq_page.clear') }}
            </button>
          </div>
        </div>

        <!-- Category Filters -->
        <div class="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 select-none no-scrollbar">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            @click="activeCategory = cat.id"
            :class="[
              'px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer',
              activeCategory === cat.id
                ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Questions Accordion -->
        <div class="space-y-4">
          <div
            v-for="(item, idx) in filteredQuestions"
            :key="item.id"
            class="bg-white rounded-3xl border border-slate-200/80 overflow-hidden transition-all duration-200 shadow-2xs hover:border-slate-300"
          >
            <button
              type="button"
              @click="toggleItem(idx)"
              class="w-full text-start p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full bg-orange-600 shrink-0"></span>
                <span class="font-black text-sm sm:text-base text-slate-900">
                  {{ $t(item.qKey) }}
                </span>
              </div>
              <div
                class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 transition-transform duration-200"
                :class="openIdx === idx ? 'rotate-180 bg-orange-50 text-orange-600' : ''"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </button>

            <div
              v-show="openIdx === idx"
              class="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50"
            >
              <p class="whitespace-pre-line">{{ $t(item.aKey) }}</p>
            </div>
          </div>

          <!-- Empty State when searching -->
          <div
            v-if="filteredQuestions.length === 0"
            class="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8"
          >
            <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <h3 class="text-base font-black text-slate-800 mb-1">
              {{ $t('faq_page.empty_title') }}
            </h3>
            <p class="text-slate-500 text-xs sm:text-sm mb-4">
              {{ $t('faq_page.empty_desc') }}
            </p>
            <button
              type="button"
              @click="searchQuery = ''; activeCategory = 'all'"
              class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors"
            >
              {{ $t('faq_page.show_all') }}
            </button>
          </div>
        </div>

        <!-- Help Banner at Bottom -->
        <div class="mt-14 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div class="text-center sm:text-start space-y-2">
            <h3 class="text-lg sm:text-xl font-black">
              {{ $t('faq_page.banner_title') }}
            </h3>
            <p class="text-slate-300 text-xs sm:text-sm max-w-md">
              {{ $t('faq_page.banner_desc') }}
            </p>
          </div>
          <a
            href="https://wa.me/201132234124"
            target="_blank"
            rel="noopener noreferrer"
            class="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-orange-500/20 shrink-0"
          >
            {{ $t('faq_page.banner_btn') }}
          </a>
        </div>

      </div>
    </main>

    <LandingTheFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { t } = useI18n()

const searchQuery = ref('')
const activeCategory = ref('all')
const openIdx = ref(0)

const toggleItem = (idx) => {
  openIdx.value = openIdx.value === idx ? null : idx
}

const categories = computed(() => [
  { id: 'all', label: t('faq_page.cat_all') },
  { id: 'start', label: t('faq_page.cat_start') },
  { id: 'menu', label: t('faq_page.cat_menu') },
  { id: 'qr', label: t('faq_page.cat_qr') },
  { id: 'orders', label: t('faq_page.cat_orders') },
  { id: 'pricing', label: t('faq_page.cat_pricing') }
])

const questionsList = [
  { id: 1, category: 'start', qKey: 'faq_page.q1_q', aKey: 'faq_page.q1_a' },
  { id: 2, category: 'start', qKey: 'faq_page.q2_q', aKey: 'faq_page.q2_a' },
  { id: 3, category: 'menu', qKey: 'faq_page.q3_q', aKey: 'faq_page.q3_a' },
  { id: 4, category: 'menu', qKey: 'faq_page.q4_q', aKey: 'faq_page.q4_a' },
  { id: 5, category: 'qr', qKey: 'faq_page.q5_q', aKey: 'faq_page.q5_a' },
  { id: 6, category: 'orders', qKey: 'faq_page.q6_q', aKey: 'faq_page.q6_a' },
  { id: 7, category: 'orders', qKey: 'faq_page.q7_q', aKey: 'faq_page.q7_a' },
  { id: 8, category: 'pricing', qKey: 'faq_page.q8_q', aKey: 'faq_page.q8_a' },
  { id: 9, category: 'pricing', qKey: 'faq_page.q9_q', aKey: 'faq_page.q9_a' },
  { id: 10, category: 'pricing', qKey: 'faq_page.q10_q', aKey: 'faq_page.q10_a' }
]

const filteredQuestions = computed(() => {
  return questionsList.filter((item) => {
    const matchesCat = activeCategory.value === 'all' || item.category === activeCategory.value
    if (!matchesCat) return false

    if (!searchQuery.value.trim()) return true

    const query = searchQuery.value.trim().toLowerCase()
    const qText = t(item.qKey).toLowerCase()
    const aText = t(item.aKey).toLowerCase()

    return qText.includes(query) || aText.includes(query)
  })
})

useHead({
  title: computed(() => `${t('faq_page.title')} - MenuJet`),
  meta: [
    {
      name: 'description',
      content: computed(() => t('faq_page.subtitle'))
    }
  ]
})
</script>
