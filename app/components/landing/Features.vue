<template>
  <section id="features" class="py-20 bg-white" dir="rtl">
    <div class="container mx-auto px-6">
      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(feature, index) in featuresList" :key="index" 
             class="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 text-center">
          
          <div class="text-5xl mb-6 inline-block p-4 bg-white rounded-2xl shadow-sm">
            {{ feature.icon }}
          </div>
          
          <h3 class="text-2xl font-bold mb-4 text-gray-900">
            {{ feature.title }}
          </h3>
          
          <p class="text-gray-600 leading-relaxed">
            {{ feature.desc }}
          </p>
          
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const featuresList = [
  { 
    title: 'تعديل لحظي', 
    desc: 'غير الأسعار والأصناف من موبايلك في ثانية، والزبون هيشوف التعديل فوراً.', 
    icon: '⚡' 
  },
  { 
    title: 'صور تجذب الزبون', 
    desc: 'اعرض أطباقك بجودة عالية وفيديو كمان، شجع الزبون يطلب أكتر بمجرد ما يشوف الصورة.', 
    icon: '📸' 
  },
  { 
    title: 'توفير حقيقي', 
    desc: 'وفر آلاف الجنيهات اللي بتضيع في طباعة المنيو الورق كل ما سعر صنف يتغير.', 
    icon: '💰' 
  }
]
</script>

<style scoped>
h3 {
  font-family: 'Cairo', sans-serif;
}
</style>