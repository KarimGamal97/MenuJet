<template>
  <section id="faqs" class="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-300" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="container mx-auto px-4 sm:px-6 max-w-4xl">
      
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="inline-block bg-orange-100 dark:bg-orange-500/15 dark:border dark:border-orange-500/25 text-orange-700 dark:text-orange-300 text-xs font-black px-4 py-1.5 rounded-full mb-3 shadow-xs">
          {{ $t('nav.faqs') }}
        </span>
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          {{ $t('faqs.title') }}
        </h2>
        <p class="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium">
          {{ $t('faqs.subtitle') }}
        </p>
      </div>

      <!-- FAQ Accordion -->
      <div class="divide-y divide-slate-200/80 dark:divide-slate-800 border-b border-slate-200/80 dark:border-slate-800">
        <div
          v-for="(faq, index) in faqList"
          :key="index"
        >
          <button
            type="button"
            @click="toggleFaq(index)"
            class="w-full py-5 text-start flex justify-between items-center gap-4 cursor-pointer group"
            :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
          >
            <span class="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
              {{ $t(faq.qKey) }}
            </span>
            <BaseIcon
              name="chevron-down"
              class="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200"
              :class="{ 'rotate-180': openIndex === index }"
            />
          </button>

          <div
            v-show="openIndex === index"
            class="pb-5 text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base leading-relaxed"
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
