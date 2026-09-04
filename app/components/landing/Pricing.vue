<template>
  <section id="pricing" class="py-24 bg-gradient-to-b from-gray-50/50 via-white to-slate-100/50 relative overflow-hidden" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="container mx-auto px-4 sm:px-6">
      
      <!-- الهيدر الرئيسي -->
      <div class="text-center max-w-3xl mx-auto mb-14">
        <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          خطط وباقات تناسب مطعمك
        </h2>
        <p class="text-gray-600 text-lg md:text-xl font-medium">
          بدون عمولة على الطلبات — ادفع الاشتراك وبس، وكل باقة ليها تجربة 14 يوم مجاني
        </p>
      </div>

      <!-- كارت الباقة الرئيسي الشامل -->
      <div class="max-w-3xl mx-auto">
        <div class="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-2 border-orange-200/80 relative hover:border-orange-400 transition-all duration-300">
          
          <!-- بادج علوي -->
          <div class="absolute -top-4 right-1/2 translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs md:text-sm font-black px-6 py-1.5 rounded-full shadow-lg shadow-orange-500/25 flex items-center gap-1.5 whitespace-nowrap">
            <span>🚀</span> وصول كامل لكل إمكانيات النظام
          </div>

          <!-- العنوان والوصف -->
          <div class="text-center mt-2 mb-8">
            <h3 class="text-3xl md:text-4xl font-black text-slate-900 mb-2">
              باقة منيو جت المتكاملة
            </h3>
            <p class="text-slate-500 text-sm md:text-base font-medium">
              كل الأدوات اللي محتاجها لإدارة منيو مطعمك ومبيعاتك من أول يوم
            </p>
          </div>

          <!-- أزرار اختيار المدة (Tabs) -->
          <div class="grid grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button
              v-for="(plan, key) in plans"
              :key="key"
              @click="selectedDuration = key"
              type="button"
              :class="[
                'py-3 px-2 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer',
                selectedDuration === key
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              ]"
            >
              <span>{{ plan.title }}</span>
              <span v-if="plan.discountBadge" :class="selectedDuration === key ? 'text-emerald-300' : 'text-emerald-600'" class="text-[10px] sm:text-xs font-black">
                {{ plan.discountBadge }}
              </span>
            </button>
          </div>

          <!-- عرض السعر والتوفير -->
          <div class="grid md:grid-cols-2 gap-6 items-center bg-slate-50 border border-slate-200/80 rounded-3xl p-6 mb-8">
            
            <!-- السعر النهائي -->
            <div class="text-center md:text-right border-b md:border-b-0 md:border-l border-slate-200 pb-4 md:pb-0 md:pl-6">
              <div class="flex items-baseline justify-center md:justify-start gap-2">
                <span class="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                  {{ currentPlan.totalPrice.toLocaleString() }}
                </span>
                <span class="text-slate-500 text-lg font-bold">ج.م / {{ currentPlan.label }}</span>
              </div>
              <p class="text-xs sm:text-sm text-slate-500 mt-2 font-semibold">
                {{ currentPlan.monthlyRateText }}
              </p>
            </div>

            <!-- تفاصيل الحسبة -->
            <div class="space-y-2 text-sm font-semibold">
              <div class="flex justify-between items-center text-slate-600">
                <span>300 ج.م × {{ currentPlan.monthsCount }} {{ currentPlan.monthsCount === 1 ? 'شهر' : 'شهور' }}</span>
                <span :class="currentPlan.discountAmount > 0 ? 'line-through text-slate-400' : 'text-slate-700'">
                  {{ (300 * currentPlan.monthsCount).toLocaleString() }} ج.م
                </span>
              </div>
              
              <div v-if="currentPlan.discountAmount > 0" class="flex justify-between items-center text-emerald-600 font-bold">
                <span>الخصم والتوفير</span>
                <span>- {{ currentPlan.discountAmount.toLocaleString() }} ج.م</span>
              </div>

              <div class="border-t border-dashed border-slate-300 pt-2 flex justify-between items-center font-black text-slate-900">
                <span>المطلوب دفعه</span>
                <span class="text-xl text-orange-600">{{ currentPlan.totalPrice.toLocaleString() }} ج.م</span>
              </div>
            </div>
          </div>

          <!-- قائمة المميزات الفعلية فقط -->
          <div class="mb-10">
            <h4 class="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">المميزات المضمنة في الباقة:</h4>
            <div class="grid sm:grid-cols-2 gap-3.5">
              <div v-for="(feature, idx) in realFeatures" :key="idx" class="flex items-start gap-3 text-slate-700 text-sm font-bold">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- زر الاشتراك والطلب -->
          <a
            href="#contact"
            @click.prevent="scrollToSection('contact')"
            class="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 md:py-5 rounded-2xl text-center shadow-xl shadow-orange-500/25 transition-all duration-300 transform active:scale-98 text-lg md:text-xl cursor-pointer block"
          >
            اشترك في الباقة الآن
          </a>

        </div>
      </div>

      <!-- الفوتر الإضافي (الضمان وزر التجربة المجانية 14 يوم) -->
      <div class="mt-14 text-center max-w-2xl mx-auto flex flex-col items-center gap-6">
        <div class="flex items-center justify-center gap-2 text-slate-500 text-sm md:text-base font-medium">
          <span>🔒</span>
          <span>دفع آمن — تفعيل تلقائي فوري — ضمان استرداد خلال 7 أيام</span>
        </div>

        <a
          href="#contact"
          @click.prevent="scrollToSection('contact')"
          class="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-lg md:text-xl py-4 px-10 rounded-2xl shadow-xl shadow-sky-500/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-98 cursor-pointer"
        >
          <span>🎁</span>
          <span>أو جرب مجاناً 14 يوم — من غير دفع</span>
        </a>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedDuration = ref('year') // الافتراضي: سنة (الأوفر)

// خطط الأسعار والخصومات
const plans = {
  month: {
    title: 'شهر',
    discountBadge: '',
    monthsCount: 1,
    totalPrice: 300,
    discountAmount: 0,
    label: 'شهر',
    monthlyRateText: 'سعر شهري 300 ج.م'
  },
  '3months': {
    title: '3 شهور',
    discountBadge: 'خصم 100 ج',
    monthsCount: 3,
    totalPrice: 800,
    discountAmount: 100,
    label: '3 شهور',
    monthlyRateText: 'بمعدل ~267 ج.م شهرياً'
  },
  '6months': {
    title: 'نص سنة',
    discountBadge: 'خصم 400 ج',
    monthsCount: 6,
    totalPrice: 1400,
    discountAmount: 400,
    label: '6 شهور',
    monthlyRateText: 'بمعدل ~233 ج.م شهرياً'
  },
  year: {
    title: 'سنة',
    discountBadge: 'خصم 600 ج',
    monthsCount: 12,
    totalPrice: 3000,
    discountAmount: 600,
    label: 'سنة',
    monthlyRateText: 'بمعدل 250 ج.م شهرياً (الأوفر)'
  }
}

// المميزات الفعلية فقط في MenuJet
const realFeatures = [
  'منيو إلكتروني تفاعلي سريع برمز QR مخصص',
  'لوحة تحكم كاملة لتعديل الأسعار والأصناف لحظياً',
  'استقبال وتأكيد الطلبات عبر واتساب والكاشير',
  'شاشة متابعة وإدارة الطلبات الحالية (Live Orders)',
  'دعم الأحجام، الإضافات، وصور الوجبات بجودة عالية',
  'تقارير مبيعات وأرباح وإحصائيات مفصلة',
  'تخصيص هوية المطعم، اللوجو، الألوان ومواعيد العمل',
  'دعم فني ومساعدة مستمرة'
]

const currentPlan = computed(() => plans[selectedDuration.value])

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}
</script>

<style scoped>
#pricing {
  font-family: 'Cairo', sans-serif;
}
</style>