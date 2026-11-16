<template>
  <main class="flex-1 h-full overflow-y-auto flex items-center justify-center p-4 md:p-8 bg-slate-200/70 print:p-0 print:m-0 print:h-auto print:w-full print:bg-white print:overflow-visible">
    <div
      id="printable-card"
      :class="[
        'bg-white relative flex flex-col items-center text-center shadow-xl transition-all duration-200 print:shadow-none',
        printSize === 'stand'
          ? 'w-full max-w-[380px] p-6 rounded-3xl border-2 border-dashed border-gray-300 space-y-4 print:w-[155mm] print:min-h-[220mm] print:p-6 print:rounded-3xl print:border-2 print:border-dashed print:border-gray-300 print:space-y-4'
          : 'w-full max-w-[440px] p-7 rounded-[2rem] border-2 border-dashed border-gray-300 space-y-5 print:w-[182mm] print:min-h-[258mm] print:p-8 print:rounded-[2.5rem] print:border-2 print:border-dashed print:border-gray-300 print:space-y-5'
      ]"
    >
      <!-- Header section -->
      <div class="w-full flex flex-col items-center justify-center border-b border-orange-100 pb-3 gap-1.5 print:pb-4 print:gap-2">
        <div
          v-if="customData.logo"
          class="w-16 h-16 flex items-center justify-center overflow-hidden mb-0.5 print:w-24 print:h-24 print:mb-2"
        >
          <img :src="customData.logo" :alt="customData.restaurantName" class="w-full h-full object-contain" />
        </div>

        <h2
          :class="[
            'font-black text-gray-900 leading-tight tracking-tight text-center',
            printSize === 'full' ? 'text-2xl print:text-4xl' : 'text-xl print:text-3xl'
          ]"
        >
          {{ customData.restaurantName || $t('qr_print.default_restaurant_name') }}
        </h2>

        <div
          :class="[
            'inline-flex items-center justify-center rounded-full font-black bg-orange-50 text-orange-600 border border-orange-200/60 tracking-wide',
            printSize === 'full' ? 'px-4 py-1 text-xs print:text-base print:px-6 print:py-1.5' : 'px-3.5 py-0.5 text-xs print:text-sm print:px-5 print:py-1'
          ]"
        >
          {{ $t('qr_print.scan_and_order') }}
        </div>
      </div>

      <!-- Promo banner -->
      <div
        :class="[
          'w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black tracking-wide shadow-sm shadow-orange-500/10 flex items-center justify-center gap-1.5',
          printSize === 'full'
            ? 'py-3 px-4 rounded-xl text-sm sm:text-base print:py-4 print:px-6 print:text-2xl print:rounded-2xl'
            : 'py-2.5 px-3.5 rounded-xl text-xs sm:text-sm print:py-3 print:px-5 print:text-xl print:rounded-xl'
        ]"
      >
        <span>{{ customData.hook || $t('qr_print.preset_discount15') }}</span>
      </div>

      <!-- QR container -->
      <div class="w-full flex flex-col items-center justify-center my-0.5 print:my-2">
        <div
          :class="[
            'bg-white shadow-sm border-2 border-orange-500 relative flex items-center justify-center',
            printSize === 'full'
              ? 'p-3.5 rounded-2xl print:p-5 print:rounded-3xl print:border-4'
              : 'p-3 rounded-2xl print:p-4 print:rounded-2xl print:border-3'
          ]"
        >
          <img
            :src="qrCodeUrl"
            alt="Scan QR"
            :class="[
              'object-contain rounded-lg block',
              printSize === 'full'
                ? 'w-56 h-56 sm:w-64 sm:h-64 print:w-[92mm] print:h-[92mm]'
                : 'w-48 h-48 sm:w-52 sm:h-52 print:w-[72mm] print:h-[72mm]'
            ]"
          />

          <div
            :class="[
              'absolute bg-gray-900 text-white font-black rounded-full shadow-sm',
              printSize === 'full'
                ? '-bottom-3 text-[11px] px-4 py-0.5 print:text-sm print:px-6 print:py-1 print:-bottom-4'
                : '-bottom-2.5 text-[10px] px-3 py-0.5 print:text-xs print:px-4 print:py-0.5 print:-bottom-3'
            ]"
          >
            {{ $t('qr_print.scan_me') }}
          </div>
        </div>
      </div>

      <!-- Stand footer -->
      <footer class="w-full pt-3 border-t border-orange-100 flex items-center justify-center print:pt-4">
        <div
          dir="ltr"
          :class="[
            'font-bold text-gray-600 flex items-center gap-2',
            printSize === 'full' ? 'text-xs print:text-base' : 'text-xs print:text-sm'
          ]"
        >
          <span
            :class="[
              'text-orange-600 font-black tracking-tight',
              printSize === 'full' ? 'text-sm print:text-xl' : 'text-sm print:text-lg'
            ]"
          >MenuJet</span>
          <template v-if="customData.phone">
            <span class="text-gray-300 font-normal">|</span>
            <span
              :class="[
                'font-mono text-gray-800 font-bold tracking-wider',
                printSize === 'full' ? 'text-xs print:text-base' : 'text-xs print:text-sm'
              ]"
            >{{ customData.phone }}</span>
          </template>
        </div>
      </footer>
    </div>
  </main>
</template>

<script setup lang="ts">
defineProps<{
  printSize: 'stand' | 'full';
  customData: {
    restaurantName: string;
    logo: string;
    hook: string;
    phone: string;
  };
  qrCodeUrl: string;
}>();
</script>
