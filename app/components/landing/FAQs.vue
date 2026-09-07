<template>
  <section id="faqs" class="py-24 bg-white relative overflow-hidden" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="container mx-auto px-4 sm:px-6 max-w-4xl">
      
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="inline-block bg-orange-100 text-orange-700 text-xs font-black px-4 py-1.5 rounded-full mb-3 shadow-xs">
          {{ $t('nav.faqs') }}
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          {{ $t('faqs.title') }}
        </h2>
        <p class="text-slate-500 text-base md:text-lg font-medium">
          {{ $t('faqs.subtitle') }}
        </p>
      </div>

      <!-- FAQ Accordion -->
      <div class="space-y-4">
        <div
          v-for="(faq, index) in faqList"
          :key="index"
          class="border border-slate-200/90 rounded-3xl overflow-hidden transition-all duration-300 bg-slate-50/50 hover:border-orange-200"
        >
          <button
            type="button"
            @click="toggleFaq(index)"
            class="w-full p-6 sm:p-7 text-right flex justify-between items-center gap-4 cursor-pointer"
            :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
          >
            <span class="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {{ $t(faq.qKey) }}
            </span>
            <div
              :class="[
                'w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-sm font-black transition-transform duration-300',
                openIndex === index ? 'bg-orange-600 text-white rotate-180' : 'bg-slate-200/80 text-slate-600'
              ]"
            >
              ▼
            </div>
          </button>

          <div
            v-show="openIndex === index"
            class="px-6 sm:px-7 pb-6 text-slate-600 font-medium text-sm sm:text-base leading-relaxed border-t border-slate-100/80 pt-4"
          >
            {{ $t(faq.aKey) }}
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(0)

const faqList = [
  { qKey: 'faqs.q1', aKey: 'faqs.a1' },
  { qKey: 'faqs.q2', aKey: 'faqs.a2' },
  { qKey: 'faqs.q3', aKey: 'faqs.a3' },
  { qKey: 'faqs.q4', aKey: 'faqs.a4' },
]

const toggleFaq = (idx) => {
  openIndex.value = openIndex.value === idx ? -1 : idx
}
</script>
