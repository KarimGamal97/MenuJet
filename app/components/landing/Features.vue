<template>
  <section id="features" class="py-20 bg-white" dir="rtl">
    <div class="container mx-auto px-6">
      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(feature, index) in featuresList" :key="index" 
             class="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 text-center group">
          
          <div class="w-20 h-20 mx-auto mb-6 flex justify-center items-center bg-white rounded-2xl shadow-md border border-orange-100 relative overflow-hidden group-hover:shadow-lg transition-all duration-300">
            <div class="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            
            <!-- Lightning SVG (Instant Edit) -->
            <svg v-if="index === 0" class="w-10 h-10 text-orange-500 animate-pulse-soft group-hover:scale-110 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>

            <!-- Camera SVG (Attractive Pictures) -->
            <svg v-else-if="index === 1" class="w-10 h-10 text-orange-500 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="animate-[pulse_1.5s_ease-in-out_infinite]" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>

            <!-- Money SVG (Real Savings) -->
            <svg v-else class="w-10 h-10 text-orange-500 animate-float transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 class="text-2xl font-bold mb-4 text-gray-900">
            {{ $t(feature.titleKey) }}
          </h3>
          
          <p class="text-gray-600 leading-relaxed">
            {{ $t(feature.descKey) }}
          </p>
          
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const featuresList = [
  { 
    titleKey: 'features.instant_edit.title', 
    descKey: 'features.instant_edit.desc'
  },
  { 
    titleKey: 'features.attractive_photos.title', 
    descKey: 'features.attractive_photos.desc'
  },
  { 
    titleKey: 'features.real_savings.title', 
    descKey: 'features.real_savings.desc'
  }
]
</script>

<style scoped>
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes pulse-soft {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .7; transform: scale(1.1); }
}
.animate-pulse-soft {
  animation: pulse-soft 2s ease-in-out infinite;
}
h3 {
  font-family: 'Cairo', sans-serif;
}
</style>