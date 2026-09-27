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
            
            <!-- Step 1: User Plus (أنشئ حسابك) -->
            <svg v-if="step === 1" class="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>

            <!-- Step 2: Add Menu Items (أضف الأصناف) -->
            <svg v-else-if="step === 2" class="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>

            <!-- Step 3: QR Code (اطبع رمز QR) -->
            <svg v-else-if="step === 3" class="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>

            <!-- Step 4: Customers Scan on Mobile (العملاء يمسحون) -->
            <svg v-else class="w-10 h-10 text-orange-500 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
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