<template>
  <section id="pricing" class="py-24 bg-gradient-to-b from-slate-50/70 via-white to-orange-50/20 relative overflow-hidden" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="container mx-auto px-4 sm:px-6">
      
      <!-- الهيدر الرئيسي -->
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          اختر الباقة المناسبة لك
        </h2>
        <p class="text-slate-600 text-lg md:text-xl font-medium">
          اختر الباقة التي تناسب احتياجات مطعمك وميزانيتك — بدون أي عمولة على طلباتك
        </p>
      </div>

      <!-- أدوات التحكم: اختيار العملة + التبديل بين الشهري والسنوي -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        
        <!-- اختيار العملة (مصر / السعودية) -->
        <div class="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 gap-1.5 shadow-inner">
          <button
            type="button"
            @click="selectedCurrency = 'EGP'"
            :class="[
              'py-2 px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer',
              selectedCurrency === 'EGP'
                ? 'bg-white text-slate-900 shadow-md shadow-slate-900/10 border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            <svg class="w-5 h-3.5 rounded-xs shadow-xs shrink-0 border border-slate-200/60" viewBox="0 0 30 20" fill="none">
              <rect width="30" height="6.66" fill="#C8102E"/>
              <rect y="6.66" width="30" height="6.66" fill="#FFFFFF"/>
              <rect y="13.33" width="30" height="6.67" fill="#000000"/>
              <circle cx="15" cy="10" r="1.8" fill="#C69214"/>
            </svg>
            <span>الجنيه المصري</span>
          </button>

          <button
            type="button"
            @click="selectedCurrency = 'SAR'"
            :class="[
              'py-2 px-4 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer',
              selectedCurrency === 'SAR'
                ? 'bg-white text-slate-900 shadow-md shadow-slate-900/10 border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            <svg class="w-5 h-3.5 rounded-xs shadow-xs shrink-0" viewBox="0 0 30 20" fill="none">
              <rect width="30" height="20" fill="#006C35"/>
              <path d="M8 12.5H22V13.5H8V12.5Z" fill="#FFFFFF"/>
              <path d="M10 9.5H20V11H10V9.5Z" fill="#FFFFFF" opacity="0.85"/>
            </svg>
            <span>الريال السعودي</span>
          </button>
        </div>

        <!-- التبديل بين شهري وسنوي -->
        <div class="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 gap-1.5 shadow-inner">
          <button
            type="button"
            @click="billingCycle = 'monthly'"
            :class="[
              'py-2 px-5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer',
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-md shadow-slate-900/10'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            شهري
          </button>

          <button
            type="button"
            @click="billingCycle = 'yearly'"
            :class="[
              'py-2 px-5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 flex items-center gap-2 cursor-pointer',
              billingCycle === 'yearly'
                ? 'bg-white text-slate-900 shadow-md shadow-slate-900/10'
                : 'text-slate-500 hover:text-slate-800'
            ]"
          >
            <span>سنوي</span>
            <span class="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">
              وفّر 20%
            </span>
          </button>
        </div>

      </div>

      <!-- شبكة الباقات الثلاث (3 Cards Grid) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
        
        <!-- 1. الباقة المجانية -->
        <div class="bg-white rounded-[2.5rem] p-8 sm:p-10 border-2 border-slate-200/80 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between relative group">
          <div>
            <!-- الأيقونة -->
            <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
              😊
            </div>

            <!-- العنوان والوصف -->
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              الباقة المجانية
            </h3>
            <p class="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              فرصة رائعة للتجربة والبداية مع منيو بسيط وفوري لمطعمك
            </p>

            <!-- السعر -->
            <div class="mb-8 pb-6 border-b border-slate-100">
              <span class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                مجاناً
              </span>
              <span class="text-slate-400 text-sm font-bold mr-2">/ للأبد</span>
            </div>

            <!-- قائمة المميزات -->
            <ul class="space-y-4 mb-8 text-sm font-bold text-slate-700">
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>5 أقسام كحد أقصى</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>30 صنف كحد أقصى</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>دعم لغتين (عربي / إنجليزي)</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>لوحة تحكم وتعديل فوري</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>رمز QR مخصص للمطعم</span>
              </li>
              <li class="flex items-center gap-3 text-slate-400">
                <div class="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 text-xs font-black">
                  ✕
                </div>
                <span class="line-through">تقارير مبيعات وشاشة كاشير</span>
              </li>
            </ul>
          </div>

          <!-- زر البدء -->
          <NuxtLink
            to="/login?mode=signup"
            class="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl text-center shadow-lg transition-all duration-200 transform active:scale-98 text-base block cursor-pointer"
          >
            ابدأ مجاناً الآن
          </NuxtLink>
        </div>

        <!-- 2. الباقة الأساسية -->
        <div class="bg-white rounded-[2.5rem] p-8 sm:p-10 border-2 border-slate-200/80 shadow-lg hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between relative group">
          <div>
            <!-- الأيقونة -->
            <div class="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
              💼
            </div>

            <!-- العنوان والوصف -->
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              الباقة الأساسية
            </h3>
            <p class="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              مثالية للمطاعم الناشئة والكافيهات التي تحتاج منيو متكامل بدون حدود
            </p>

            <!-- السعر -->
            <div class="mb-8 pb-6 border-b border-slate-100">
              <div class="flex items-baseline gap-1.5">
                <span class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {{ currentPrices.basic[billingCycle].price.toLocaleString() }}
                </span>
                <span class="text-slate-600 text-base font-bold">{{ currencySymbol }}</span>
                <span class="text-slate-400 text-sm font-bold">/ {{ billingCycle === 'yearly' ? 'سنة' : 'شهر' }}</span>
              </div>
              <p v-if="billingCycle === 'yearly'" class="text-xs text-emerald-600 font-bold mt-1.5">
                {{ currentPrices.basic.yearly.note }}
              </p>
            </div>

            <!-- قائمة المميزات -->
            <ul class="space-y-4 mb-8 text-sm font-bold text-slate-700">
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>أقسام وعناصر غير محدودة</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>دعم لغات غير محدودة (عربي / إنجليزي)</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>نُسخ متعددة من الصنف (الأحجام والمقاسات)</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>إدارة الخيارات والإضافات (Extras)</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>إدارة الفروع ومناطق التوصيل وحساب الدليفري</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>تخصيص الهوية واللوجو والألوان بالكامل</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>بدون إعلانات خارجية تماماً</span>
              </li>
            </ul>
          </div>

          <!-- زر الاشتراك -->
          <a
            href="#contact"
            @click.prevent="scrollToSection('contact')"
            class="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl text-center shadow-lg transition-all duration-200 transform active:scale-98 text-base block cursor-pointer"
          >
            اشترك في الأساسية
          </a>
        </div>

        <!-- 3. الباقة الاحترافية (الأكثر شعبية) -->
        <div class="bg-white rounded-[2.5rem] p-8 sm:p-10 border-2 border-orange-500 shadow-2xl shadow-orange-500/15 relative flex flex-col justify-between transform lg:-translate-y-3 transition-all duration-300">
          
          <!-- بادج الأكثر طلباً -->
          <div class="absolute -top-4 right-1/2 translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-xs font-black px-6 py-1.5 rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-1.5 whitespace-nowrap">
            <span>🌟</span> الأكثر شعبية وطلباً
          </div>

          <div>
            <!-- الأيقونة -->
            <div class="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm">
              ⚡
            </div>

            <!-- العنوان والوصف -->
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              الباقة الاحترافية
            </h3>
            <p class="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              الحل الأمثل لإدارة عمليات مطعمك أو المقهى بالكامل بأعلى كفاءة
            </p>

            <!-- السعر -->
            <div class="mb-6 pb-6 border-b border-slate-100">
              <div class="flex items-baseline gap-1.5">
                <span class="text-4xl sm:text-5xl font-black text-orange-600 tracking-tight">
                  {{ currentPrices.pro[billingCycle].price.toLocaleString() }}
                </span>
                <span class="text-slate-600 text-base font-bold">{{ currencySymbol }}</span>
                <span class="text-slate-400 text-sm font-bold">/ {{ billingCycle === 'yearly' ? 'سنة' : 'شهر' }}</span>
              </div>
              <p v-if="billingCycle === 'yearly'" class="text-xs text-emerald-600 font-bold mt-1.5">
                {{ currentPrices.pro.yearly.note }}
              </p>
            </div>

            <!-- بادج تضمين مميزات الأساسية -->
            <div class="bg-orange-50 border border-orange-200/70 text-orange-800 text-xs font-black p-2.5 rounded-xl text-center mb-6 flex items-center justify-center gap-1.5">
              <span>+</span>
              <span>تتضمن جميع مميزات الباقة الأساسية بالكامل</span>
            </div>

            <!-- قائمة المميزات الإضافية -->
            <ul class="space-y-4 mb-8 text-sm font-bold text-slate-700">
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>شاشة إدارة ومتابعة الطلبات المباشرة (Live KDS)</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>استقبال وتأكيد الطلبات عبر واتساب والكاشير</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>تقارير مبيعات وأرباح وإحصائيات مفصلة</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>نظام مواعيد العمل التلقائية والتحكم في الاستقبال</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>دعم أرقام الطاولات وأرقام الانتظار (Queue)</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <span>أولوية قصوى في الدعم الفني وتحديثات النظام المستمرة</span>
              </li>
            </ul>
          </div>

          <!-- زر الاشتراك في الاحترافية -->
          <a
            href="#contact"
            @click.prevent="scrollToSection('contact')"
            class="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black py-4 rounded-2xl text-center shadow-xl shadow-orange-500/25 transition-all duration-300 transform active:scale-98 text-base sm:text-lg block cursor-pointer"
          >
            اشترك في الاحترافية 🚀
          </a>
        </div>

      </div>

      <!-- الفوتر الإضافي (الضمان وزر التجربة المجانية 14 يوم) -->
      <div class="mt-16 text-center max-w-2xl mx-auto flex flex-col items-center gap-6">
        <div class="flex items-center justify-center gap-2 text-slate-500 text-sm md:text-base font-medium">
          <span>🔒</span>
          <span>تفعيل فوري — دعم فني مستمر بدون عمولة على الطلبات</span>
        </div>

        <NuxtLink
          to="/login?mode=signup"
          class="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-lg md:text-xl py-4 px-10 rounded-2xl shadow-xl shadow-sky-500/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-98 cursor-pointer"
        >
          <span>🎁</span>
          <span>أو جرب مجاناً 14 يوم — بدون بطاقة ائتمان</span>
        </NuxtLink>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedCurrency = ref('SAR') // الافتراضي: الريال السعودي
const billingCycle = ref('yearly') // الافتراضي: سنوي (وفر 20%)

const pricingData = {
  SAR: {
    symbol: 'ر.س',
    basic: {
      monthly: { price: 20 },
      yearly: { price: 200, note: 'بمعدل ~16.6 ر.س شهرياً (وفر 40 ر.س سنوياً)' }
    },
    pro: {
      monthly: { price: 40 },
      yearly: { price: 400, note: 'بمعدل ~33.3 ر.س شهرياً (وفر 80 ر.س سنوياً)' }
    }
  },
  EGP: {
    symbol: 'ج.م',
    basic: {
      monthly: { price: 250 },
      yearly: { price: 2500, note: 'بمعدل ~208 ج.م شهرياً (وفر 500 ج.م سنوياً)' }
    },
    pro: {
      monthly: { price: 500 },
      yearly: { price: 5000, note: 'بمعدل ~416 ج.م شهرياً (وفر 1000 ج.م سنوياً)' }
    }
  }
}

const currencySymbol = computed(() => pricingData[selectedCurrency.value].symbol)
const currentPrices = computed(() => pricingData[selectedCurrency.value])

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
  font-family: 'Cairo', 'Tajawal', sans-serif;
}
</style>