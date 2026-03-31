<!-- app/components/MenuSkeleton.vue -->
<template>
  <div class="animate-pulse space-y-8 pb-10">
    <!-- Header Skeleton -->
    <div class="bg-white border-b border-gray-100 p-6 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gray-200 rounded-2xl"></div>
        <div class="space-y-2">
          <div class="w-20 h-2 bg-gray-100 rounded"></div>
          <div class="w-32 h-6 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
      <div class="w-24 h-10 bg-gray-100 rounded-2xl"></div>
    </div>

    <!-- Category Tabs Skeleton -->
    <div class="flex gap-2 px-6 overflow-hidden">
      <div v-for="i in 4" :key="i" class="w-20 h-10 bg-white border border-gray-100 rounded-2xl flex-shrink-0"></div>
    </div>

    <!-- Items List Skeleton -->
    <div class="max-w-3xl mx-auto px-6 space-y-4">
      <div v-for="i in 5" :key="i" class="bg-white p-4 rounded-[2rem] border border-gray-50 flex items-center gap-4">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex-shrink-0"></div>
        <div class="flex-grow space-y-3">
          <div class="w-3/4 h-5 bg-gray-200 rounded-lg"></div>
          <div class="w-1/2 h-3 bg-gray-100 rounded-lg"></div>
          <div class="w-1/4 h-6 bg-gray-200 rounded-lg"></div>
        </div>
        <div class="w-10 h-10 rounded-full bg-gray-100"></div>
      </div>
    </div>
  </div>
</template>
