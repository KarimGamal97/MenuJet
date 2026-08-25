<template>
  <section id="pricing" class="py-24 bg-gray-50/50" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="container mx-auto px-6 text-center">
      <h2 class="text-4xl font-black mb-4 text-gray-900">{{ $t('pricing.title') }}</h2>
      <p class="text-gray-500 mb-16 text-lg max-w-2xl mx-auto">
        {{ $t('pricing.subtitle') }}
      </p>
      
      <div class="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch mt-12">
        
        <!-- 1. التجربة المجانية (Free Trial) -->
        <div class="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 relative flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-600 to-slate-800"></div>
          
          <div>
            <h3 class="text-3xl font-black mb-6 text-slate-900 mt-2">
              {{ $t('pricing.free_trial.title') }}
            </h3>
            
            <div class="my-6 min-h-[140px] flex flex-col justify-center">
              <div class="text-5xl font-black text-slate-900 leading-none">
                {{ $t('pricing.free_trial.price') }}
              </div>
              <div class="text-slate-500 text-sm mt-6 font-medium leading-relaxed">
                <p>{{ $t('pricing.free_trial.subtitle') }}</p>
              </div>
            </div>

            <div class="border-t border-dashed border-gray-200 my-6"></div>

            <ul class="space-y-4 text-center font-bold text-slate-700 mb-8">
              <li class="py-1">{{ $t('pricing.free_trial.feat_1') }}</li>
              <li class="border-t border-dashed border-gray-200 pt-4">{{ $t('pricing.free_trial.feat_2') }}</li>
              <li class="border-t border-dashed border-gray-200 pt-4">{{ $t('pricing.free_trial.feat_3') }}</li>
            </ul>
          </div>

          <div class="mt-4">
            <SecondaryButton href="#contact" class="w-full !rounded-2xl !py-3.5 font-bold">
              {{ $t('pricing.free_trial.cta') }}
            </SecondaryButton>
          </div>
        </div>

        <!-- 2. الباقة النصف سنوية (Semi-Annual) -->
        <div class="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 relative flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-600 to-slate-800"></div>

          <div>
            <h3 class="text-3xl font-black mb-6 text-slate-900 mt-2">
              {{ $t('pricing.plan_semi_annual.title') }}
            </h3>
            
            <div class="my-6 min-h-[140px] flex flex-col justify-center">
              <div class="text-5xl font-black text-slate-900 leading-none flex items-center justify-center gap-2">
                <span>{{ $t('pricing.plan_semi_annual.price') }}</span>
                <span class="text-3xl">{{ $t('pricing.plan_semi_annual.currency') }}</span>
              </div>
              <div class="text-slate-500 text-sm mt-4 font-medium leading-relaxed">
                <p>{{ $t('pricing.plan_semi_annual.duration') }}</p>
                <p class="font-semibold text-slate-600">{{ $t('pricing.plan_semi_annual.rate') }}</p>
              </div>
            </div>

            <div class="border-t border-dashed border-gray-200 my-6"></div>

            <ul class="space-y-4 text-center font-bold text-slate-700 mb-8">
              <li class="py-1">{{ $t('pricing.plan_semi_annual.feat_1') }}</li>
              <li class="border-t border-dashed border-gray-200 pt-4">{{ $t('pricing.plan_semi_annual.feat_2') }}</li>
              <li class="border-t border-dashed border-gray-200 pt-4">{{ $t('pricing.plan_semi_annual.feat_3') }}</li>
            </ul>
          </div>

          <div class="mt-4">
            <SecondaryButton href="#contact" class="w-full !rounded-2xl !py-3.5 font-bold">
              {{ $t('pricing.plan_semi_annual.cta') }}
            </SecondaryButton>
          </div>
        </div>

        <!-- 3. الباقة السنوية (الأفضل) (Annual / Best) -->
        <div class="bg-white rounded-[2rem] shadow-2xl border-[3px] border-orange-500 p-8 relative flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
          <div>
            <h3 class="text-3xl font-black mb-6 text-slate-900 leading-tight whitespace-pre-line">
              {{ $t('pricing.plan_annual.title') }}
            </h3>
            
            <div class="my-6 min-h-[140px] flex flex-col justify-center">
              <div class="text-5xl font-black text-slate-900 leading-none">
                {{ $t('pricing.plan_annual.price') }}
              </div>
              <div class="text-3xl font-black text-slate-900 mt-2">
                {{ $t('pricing.plan_annual.currency') }}
              </div>
              <div class="text-slate-500 text-sm mt-4 font-medium leading-relaxed">
                <p>{{ $t('pricing.plan_annual.duration') }}</p>
                <p class="font-semibold text-slate-600">{{ $t('pricing.plan_annual.rate') }}</p>
              </div>
            </div>

            <div class="border-t border-dashed border-gray-200 my-6"></div>

            <ul class="space-y-4 text-center font-bold text-slate-800 mb-6">
              <li class="py-1">{{ $t('pricing.plan_annual.feat_1') }}</li>
              <li class="border-t border-dashed border-gray-200 pt-4">{{ $t('pricing.plan_annual.feat_2') }}</li>
            </ul>
          </div>

          <div>
            <div class="bg-orange-100/70 text-orange-600 font-black py-3 px-4 rounded-xl text-center mb-6 text-base tracking-wide border border-orange-200/50">
              {{ $t('pricing.plan_annual.saving') }}
            </div>
            <PrimaryButton href="#contact" class="w-full !rounded-2xl !py-3.5 text-lg font-bold">
              {{ $t('pricing.plan_annual.cta') }}
            </PrimaryButton>
          </div>
        </div>

      </div>
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