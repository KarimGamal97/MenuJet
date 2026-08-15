<template>
  <section id="pricing" class="py-24 bg-gray-50" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="container mx-auto px-6 text-center">
      <h2 class="text-4xl font-black mb-4 text-gray-900">{{ $t('pricing.title') }}</h2>
      <p class="text-gray-500 mb-16 text-lg max-w-2xl mx-auto">
        {{ $t('pricing.subtitle') }}
      </p>
      
      <div class="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto items-center mt-12">
        
        <!-- 1 Month Plan -->
        <div class="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 relative flex flex-col hover:-translate-y-2 transition-transform duration-300">
          <h3 class="text-xl font-bold mb-4 text-gray-700">{{ $t('pricing.plan_1.title') }}</h3>
          <div class="mb-6 h-28 flex flex-col justify-center border-b border-gray-100 pb-6">
            <div class="text-5xl font-black text-gray-900 leading-none">
              490
              <span class="text-lg text-gray-400 font-normal">{{ $t('pricing.currency_month') }}</span>
            </div>
            <p class="text-gray-400 mt-3 font-medium">{{ $t('pricing.plan_1.subtitle') }}</p>
          </div>
          <ul class="space-y-4 mb-8 text-start flex-grow">
            <li class="flex items-center gap-3">
              <span class="text-green-500 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
              <span class="text-gray-600 font-medium">{{ $t('pricing.plan_1.feat_1') }}</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-green-500 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
              <span class="text-gray-600 font-medium">{{ $t('pricing.plan_1.feat_2') }}</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-green-500 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
              <span class="text-gray-600 font-medium">{{ $t('pricing.plan_1.feat_3') }}</span>
            </li>
            <li class="flex items-center gap-3 opacity-50">
              <span class="text-gray-300 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg></span>
              <span class="text-gray-500 line-through font-medium">{{ $t('pricing.plan_1.feat_4') }}</span>
            </li>
          </ul>
          <SecondaryButton href="#contact" class="w-full !rounded-xl !py-3">
            {{ $t('pricing.plan_1.cta') }}
          </SecondaryButton>
        </div>

        <!-- 3 Months Plan (Highlighted) -->
        <div class="bg-white rounded-[2.5rem] shadow-2xl border-4 border-orange-500 p-8 md:p-10 relative flex flex-col transform lg:-translate-y-4 hover:-translate-y-6 transition-transform duration-300 z-10">
          <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white px-8 py-2.5 rounded-full text-base font-black shadow-lg whitespace-nowrap z-20 border-4 border-white">
            {{ $t('pricing.plan_3.badge') }}
          </div>
          <h3 class="text-2xl font-black mb-4 text-orange-600 mt-4">{{ $t('pricing.plan_3.title') }}</h3>
          <div class="mb-6 h-28 flex flex-col justify-center border-b border-gray-100 pb-6">
            <div class="text-6xl font-black text-gray-900 leading-none">
              450
              <span class="text-xl text-gray-400 font-normal">{{ $t('pricing.currency_month') }}</span>
            </div>
            <p class="text-green-600 mt-3 font-bold animate-pulse text-lg">{{ $t('pricing.plan_3.subtitle') }}</p>
          </div>
          <ul class="space-y-4 mb-8 text-start flex-grow">
            <li class="flex items-center gap-3">
              <span class="bg-orange-100 text-orange-600 rounded-full p-1 shrink-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
              <span class="text-gray-900 font-bold">{{ $t('pricing.plan_3.feat_1') }}</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-orange-500 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
              <span class="text-gray-600 font-medium">{{ $t('pricing.plan_3.feat_2') }}</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-orange-500 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
              <span class="text-gray-600 font-medium">{{ $t('pricing.plan_3.feat_3') }}</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-orange-500 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
              <span class="text-gray-600 font-medium">{{ $t('pricing.plan_3.feat_4') }}</span>
            </li>
          </ul>
          <PrimaryButton href="#contact" class="w-full !rounded-xl !py-4 text-xl">
            {{ $t('pricing.plan_3.cta') }}
          </PrimaryButton>
        </div>

        <!-- 6 Months Plan -->
        <div class="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 relative flex flex-col hover:-translate-y-2 transition-transform duration-300">
           <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-md whitespace-nowrap z-20 border-2 border-white">
            {{ $t('pricing.plan_6.badge') }}
          </div>
          <h3 class="text-xl font-bold mb-4 text-gray-700 mt-2">{{ $t('pricing.plan_6.title') }}</h3>
          <div class="mb-6 h-28 flex flex-col justify-center border-b border-gray-100 pb-6">
            <div class="text-5xl font-black text-gray-900 leading-none">
              390
              <span class="text-lg text-gray-400 font-normal">{{ $t('pricing.currency_month') }}</span>
            </div>
             <p class="text-green-600 mt-3 font-bold">{{ $t('pricing.plan_6.subtitle') }}</p>
          </div>
          <ul class="space-y-4 mb-8 text-start flex-grow">
            <li class="flex items-center gap-3">
              <span class="bg-green-100 text-green-600 rounded-full p-1 shrink-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
              <span class="text-gray-900 font-bold">{{ $t('pricing.plan_6.feat_1') }}</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-green-500 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
              <span class="text-gray-600 font-medium">{{ $t('pricing.plan_6.feat_2') }}</span>
            </li>
            <li class="flex items-center gap-3">
              <span class="text-green-500 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
              <span class="text-gray-600 font-medium">{{ $t('pricing.plan_6.feat_3') }}</span>
            </li>
             <li class="flex items-center gap-3">
              <span class="text-green-500 shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
              <span class="text-gray-600 font-medium">{{ $t('pricing.plan_6.feat_4') }}</span>
            </li>
          </ul>
          <SecondaryButton href="#contact" class="w-full !rounded-xl !py-3 !border-green-200 hover:!border-green-400 hover:!bg-green-50">
            {{ $t('pricing.plan_6.cta') }}
          </SecondaryButton>
        </div>

      </div>

      <p class="mt-14 text-gray-500 text-sm font-bold bg-gray-100 py-3 px-6 rounded-full inline-block">
        {{ $t('pricing.footer_note') }}
      </p>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
#pricing {
  font-family: 'Cairo', sans-serif;
}
</style>