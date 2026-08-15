<template>
  <section class="py-16 bg-white sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          {{ $t('howItWorks.title') }}
        </h2>
      </div>

      <div class="mt-16 sm:mt-20">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          
          <!-- Card 1: Registration -->
          <div class="pt-6">
            <div class="flow-root bg-gray-50 rounded-2xl px-6 pb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full">
              <!-- Added 'flex justify-center' here -->
              <div class="-mt-6 flex justify-center">
                <!-- Changed 'bg-indigo-600' to 'bg-orange-500', removed 'block mx-auto' -->
                <div class="inline-flex items-center justify-center p-3 bg-orange-500 rounded-xl shadow-lg w-16 h-16 mb-6 transform -translate-y-4">
                  <!-- Register SVG (User Plus) -->
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                </div>
              </div>
              <h3 class="mt-2 text-xl font-bold text-gray-900 text-center tracking-tight">{{ $t('howItWorks.register.title') }}</h3>
              <p class="mt-4 text-base text-gray-500 text-center">
                {{ $t('howItWorks.register.desc') }}
              </p>
            </div>
          </div>

          <!-- Card 2: Customization -->
          <div class="pt-6">
            <div class="flow-root bg-gray-50 rounded-2xl px-6 pb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full">
              <!-- Added 'flex justify-center' here -->
              <div class="-mt-6 flex justify-center">
                <!-- Changed 'bg-indigo-600' to 'bg-orange-500', removed 'block mx-auto' -->
                <div class="inline-flex items-center justify-center p-3 bg-orange-500 rounded-xl shadow-lg w-16 h-16 mb-6 transform -translate-y-4">
                  <!-- Customization SVG (Adjustments/Settings) -->
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
              </div>
              <h3 class="mt-2 text-xl font-bold text-gray-900 text-center tracking-tight">{{ $t('howItWorks.customize.title') }}</h3>
              <p class="mt-4 text-base text-gray-500 text-center">
                {{ $t('howItWorks.customize.desc') }}
              </p>
            </div>
          </div>

          <!-- Card 3: Start -->
          <div class="pt-6">
            <div class="flow-root bg-gray-50 rounded-2xl px-6 pb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full">
              <!-- Added 'flex justify-center' here -->
              <div class="-mt-6 flex justify-center">
                <!-- Changed 'bg-indigo-600' to 'bg-orange-500', removed 'block mx-auto' -->
                <div class="inline-flex items-center justify-center p-3 bg-orange-500 rounded-xl shadow-lg w-16 h-16 mb-6 transform -translate-y-4">
                  <!-- Start SVG (QR Code / Launch) -->
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                </div>
              </div>
              <h3 class="mt-2 text-xl font-bold text-gray-900 text-center tracking-tight">{{ $t('howItWorks.start.title') }}</h3>
              <p class="mt-4 text-base text-gray-500 text-center">
                {{ $t('howItWorks.start.desc') }}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>
