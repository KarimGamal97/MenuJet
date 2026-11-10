<template>
  <div class="animate-pulse space-y-8" dir="rtl">
    <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div class="w-1/3 h-8 bg-gray-200 rounded-xl mb-3"></div>
      <div class="w-1/4 h-4 bg-gray-100 rounded-lg"></div>
    </div>

    <!-- Stats Grid Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="i in 3"
        :key="i"
        class="p-6 rounded-[2rem] border border-gray-100 bg-gray-50 h-44"
      >
        <div class="w-12 h-12 bg-gray-100 rounded-xl mb-6"></div>
        <div class="w-20 h-4 bg-gray-200 rounded mb-2"></div>
        <div class="w-24 h-8 bg-gray-200 rounded-xl"></div>
      </div>
    </div>

    <!-- Charts Skeleton -->
    <div class="space-y-6">
      <!-- Quick Highlight Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          v-for="i in 3"
          :key="'h-' + i"
          class="p-5 rounded-[2rem] border border-gray-100 bg-gray-50 h-24 flex items-center gap-4"
        >
          <div class="w-12 h-12 bg-gray-200 rounded-2xl shrink-0"></div>
          <div class="space-y-2 flex-1">
            <div class="w-20 h-3 bg-gray-200 rounded"></div>
            <div class="w-32 h-5 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-7 bg-white p-8 rounded-[2.5rem] border border-gray-100 h-96">
          <div class="w-48 h-6 bg-gray-200 rounded-lg mb-6"></div>
          <div class="w-full h-64 bg-gray-50 rounded-2xl"></div>
        </div>
        <div class="lg:col-span-5 bg-white p-8 rounded-[2.5rem] border border-gray-100 h-96">
          <div class="w-36 h-6 bg-gray-200 rounded-lg mb-6"></div>
          <div class="w-full h-64 bg-gray-50 rounded-2xl"></div>
        </div>
      </div>
    </div>
  </div>
</template>
