<template>
  <section id="features" class="py-20 bg-white" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="container mx-auto px-6">
      
      <!-- Section Title & Description -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-5xl font-black text-gray-900 mb-3">
          {{ $t('features.title_part1') }} 
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
            {{ $t('features.title_part2') }}
          </span>
        </h2>
        <p class="text-gray-500 text-base md:text-lg font-medium max-w-2xl mx-auto">
          {{ $t('features.subtitle') }}
        </p>
      </div>

      <!-- 4 Steps in Cards with Icons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="step in 4" 
          :key="step"
          class="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group"
        >
          <!-- Icon Box (White card with orange border & icon) -->
          <div class="w-20 h-20 mx-auto mb-6 flex justify-center items-center bg-white rounded-2xl shadow-md border border-orange-100 relative overflow-hidden group-hover:shadow-lg transition-all duration-300">
            <div class="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            
            <BaseIcon
              :name="step === 1 ? 'user-plus' : step === 2 ? 'clipboard-list' : step === 3 ? 'qr-code' : 'phone'"
              class="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          
          <h3 class="text-xl font-bold mb-3 text-gray-900">
            {{ $t(`features.step${step}.title`) }}
          </h3>
          
          <p class="text-gray-500 text-sm leading-relaxed">
            {{ $t(`features.step${step}.desc`) }}
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
h3 {
  font-family: 'Cairo', 'Tajawal', sans-serif;
}
</style>