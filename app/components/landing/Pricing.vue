<template>
  <section id="pricing" class="py-20 bg-gray-50" dir="rtl">
    <div class="container mx-auto px-6 text-center">
      <h2 class="text-4xl font-black mb-4 text-gray-900">خطط تناسب طموحك</h2>
      <p class="text-gray-500 mb-10 text-lg max-w-2xl mx-auto">
        اختار نظام الدفع اللي يريحك وابدأ رحلة التغيير في مطعمك دلوقتي.
      </p>

      <div class="flex items-center justify-center gap-4 mb-12">
        <span :class="!isAnnual ? 'text-orange-600 font-black' : 'text-gray-400'" class="transition-all">شهري</span>
        <button 
          @click="isAnnual = !isAnnual" 
          class="w-16 h-8 bg-gray-200 rounded-full relative p-1 transition-colors duration-300"
          :class="{'bg-orange-600': isAnnual}"
        >
          <div 
            class="bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300"
            :class="isAnnual ? '-translate-x-8' : 'translate-x-0'"
          ></div>
        </button>
        <span :class="isAnnual ? 'text-orange-600 font-black' : 'text-gray-400'" class="transition-all flex items-center gap-2">
          سنوي
          <span class="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase">وفر 1,200 ج.م</span>
        </span>
      </div>
      
      <div class="max-w-xl mx-auto">
        <div class="bg-white rounded-[2.5rem] shadow-2xl border-4 border-orange-500 p-8 md:p-12 relative overflow-hidden transition-all duration-500">
          
          <div v-if="isAnnual" class="absolute top-0 right-0 bg-orange-600 text-white px-10 py-1 rotate-45 translate-x-8 translate-y-4 text-xs font-bold">
            الأكثر توفيراً
          </div>

          <h3 class="text-2xl font-bold mb-6 text-gray-800">باقة MenuJet</h3>
          
          <div class="mb-6 h-24 flex flex-col justify-center">
            <div class="text-7xl font-black text-gray-900 leading-none">
              {{ isAnnual ? '390' : '490' }}
              <span class="text-xl text-gray-400 font-normal">ج.م / شهر</span>
            </div>
            <p v-if="isAnnual" class="text-green-600 font-bold mt-2 animate-pulse">
              الدفع سنوي (4,680 ج.م) + 3 شهور هدية
            </p>
            <p v-else class="text-gray-400 mt-2 font-medium">تجديد شهري مرن</p>
          </div>

          <ul class="space-y-6 mb-12 text-right">
            <li class="flex items-start gap-4">
              <span class="bg-orange-100 text-orange-600 rounded-full p-1 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <div>
                <span class="font-bold text-gray-900 block">توفير جبار:</span>
                <span class="text-gray-500 text-sm">عدل أسعارك وصورك في ثانية ووفّر آلاف الجنيهات في طباعة المنيو الورق.</span>
              </div>
            </li>

            <li class="flex items-start gap-4">
              <span class="bg-orange-100 text-orange-600 rounded-full p-1 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <div>
                <span class="font-bold text-gray-900 block">  QR أسرع:</span>
                <span class="text-gray-500 text-sm">تصفح فائق السرعة بيخلي الزبون يختار ويطلب من غير ملل ولا انتظار.</span>
              </div>
            </li>

            <li class="flex items-start gap-4">
              <span class="bg-orange-100 text-orange-600 rounded-full p-1 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <div>
                <span class="font-bold text-gray-900 block">هوية براندك:</span>
                <span class="text-gray-500 text-sm">منيو شيك بألوانك ولوجو مطعمك بيخلق انطباع احترافي عند كل الزبائن.</span>
              </div>
            </li>

            <li class="flex items-start gap-4">
              <span class="bg-orange-100 text-orange-600 rounded-full p-1 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
              </span>
              <div>
                <span class="font-bold text-gray-800 block">تحديثات مستمرة:</span>
                <span class="text-gray-500 text-sm ">سيستم متطور بيحصل على مميزات جديدة دورياً تضمن لك السيطرة على مطعمك.</span>
              </div>
            </li>
          </ul>

       <a href="#contact" class="bg-orange-600 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-lg shadow-orange-200 hover:scale-105 transition">
          ابدأ أسبوعك المجاني
        </a>
        </div>
      </div>

      <p class="mt-12 text-gray-400 text-sm font-medium">
        * أسبوع تجربة مجاناً بالكامل - تقدر تلغي في أي وقت
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
const isAnnual = ref(true) 
</script>

<style scoped>
.container {
  font-family: 'Cairo', sans-serif;
}
</style>