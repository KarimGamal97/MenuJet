<template>
  <div class="animate-pulse space-y-6" dir="rtl">
    <!-- Header Stats Skeleton -->
    <div
      class="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-[2rem] gap-4"
    >
      <div class="w-48 h-8 bg-gray-200 rounded-xl"></div>
      <div class="w-32 h-12 bg-gray-100 rounded-2xl"></div>
    </div>

    <!-- Filters Skeleton -->
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1 h-14 bg-white rounded-2xl shadow-sm"></div>
      <div class="flex gap-2">
        <div
          v-for="i in 3"
          :key="i"
          class="w-24 h-12 bg-white rounded-2xl border border-gray-50"
        ></div>
      </div>
    </div>

    <!-- Grid Items Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white p-5 rounded-[2rem] border border-gray-50 shadow-sm flex justify-between items-center"
      >
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0"></div>
          <div class="space-y-2">
            <div class="w-16 h-4 bg-gray-100 rounded"></div>
            <div class="w-32 h-5 bg-gray-200 rounded"></div>
            <div class="w-20 h-4 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div class="flex gap-2">
          <div class="w-10 h-10 bg-gray-100 rounded-xl"></div>
          <div class="w-10 h-10 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
</template>
