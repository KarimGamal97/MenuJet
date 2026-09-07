<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      dir="rtl"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        @click="$emit('close')"
      ></div>

      <!-- Modal Dialog -->
      <div
        class="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full relative z-[110] shadow-2xl border border-orange-100 animate-in zoom-in-95 duration-200"
      >
        <!-- Close Button -->
        <button
          @click="$emit('close')"
          class="absolute top-6 left-6 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          ✕
        </button>

        <!-- Header Icon & Badge -->
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 mx-auto bg-gradient-to-tr from-orange-500 to-amber-400 text-white rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-orange-500/25 mb-4"
          >
            🚀
          </div>

          <span
            class="inline-block bg-orange-100 text-orange-700 text-xs font-black px-4 py-1.5 rounded-full mb-2"
          >
            وصلت للحد الأقصى في باقتك
          </span>

          <h3 class="text-2xl sm:text-3xl font-black text-slate-900">
            {{ title || "رقّي باقتك واستمتع بإمكانيات بلا حدود" }}
          </h3>
          
          <p class="text-slate-500 text-sm sm:text-base mt-2 font-medium">
            <template v-if="limitType === 'items'">
              لقد استخدمت {{ currentCount }} من أصل {{ maxCount }} صنف مسموح بها في الباقة المجانية.
            </template>
            <template v-else-if="limitType === 'categories'">
              لقد استخدمت {{ currentCount }} من أصل {{ maxCount }} أقسام مسموح بها في الباقة المجانية.
            </template>
            <template v-else>
              لإضافة المزيد من الأصناف والأقسام والاستفادة الكاملة من مميزات MenuJet.
            </template>
          </p>
        </div>

        <!-- Plan Advantages Cards -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-6 space-y-3">
          <h4 class="text-xs font-black text-slate-400 uppercase tracking-wider">
            ماذا ستحصل عند الترقية؟
          </h4>
          
          <ul class="space-y-2.5 text-sm text-slate-700 font-bold">
            <li class="flex items-center gap-2.5">
              <span class="text-emerald-500 text-lg">✓</span>
              <span>عدد غير محدود من الأصناف والأقسام</span>
            </li>
            <li class="flex items-center gap-2.5">
              <span class="text-emerald-500 text-lg">✓</span>
              <span>استقبال وتأكيد الطلبات عبر واتساب والكاشير</span>
            </li>
            <li class="flex items-center gap-2.5">
              <span class="text-emerald-500 text-lg">✓</span>
              <span>تقارير مبيعات وأرباح وإحصائيات متقدمة</span>
            </li>
            <li class="flex items-center gap-2.5">
              <span class="text-emerald-500 text-lg">✓</span>
              <span>دعم فني وتخصيص هوية المطعم بالكامل</span>
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="openWhatsAppUpgrade"
            class="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black py-4 px-6 rounded-2xl text-center shadow-xl shadow-orange-500/25 transition-all duration-300 transform active:scale-98 text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💬</span>
            <span>تواصل معنا للترقية فوراً عبر واتساب</span>
          </button>

          <button
            @click="$emit('close')"
            class="w-full py-3 text-slate-500 hover:text-slate-800 font-bold text-sm text-center transition-colors cursor-pointer"
          >
            إغلاق ومتابعة العمل
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  limitType: {
    type: String,
    default: "items", // 'items' | 'categories' | 'general'
  },
  currentCount: {
    type: [Number, String],
    default: 0,
  },
  maxCount: {
    type: [Number, String],
    default: 30,
  },
  businessName: {
    type: String,
    default: "",
  },
});

defineEmits(["close"]);

const openWhatsAppUpgrade = () => {
  // Support WhatsApp number
  const whatsappNumber = "201026046778";
  const restaurant = props.businessName || "مطعمي";
  const message = encodeURIComponent(
    `مرحباً، أود ترقية باقة مطعم (${restaurant}) في منصة MenuJet للاستفادة من الباقة الكاملة بدون حدود 🚀`
  );
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
};
</script>
