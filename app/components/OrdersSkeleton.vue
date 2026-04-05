<template>
  <div class="animate-pulse space-y-6" dir="rtl">
    <!-- Page Header Skeleton -->
    <div
      class="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm"
    >
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gray-100 rounded-2xl"></div>
        <div class="w-36 h-6 bg-gray-200 rounded-xl"></div>
      </div>
      <div class="w-11 h-11 bg-gray-100 rounded-xl"></div>
    </div>

    <!-- Orders Grid Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-white p-6 rounded-3xl border-2 border-gray-50 flex flex-col h-full"
      >
        <!-- Order Header: ID + Status -->
        <div class="flex justify-between items-start mb-4">
          <div class="space-y-2">
            <div class="w-16 h-3 bg-gray-100 rounded"></div>
            <div class="w-24 h-7 bg-gray-200 rounded-lg"></div>
          </div>
          <div class="text-left space-y-2">
            <div class="w-12 h-3 bg-gray-100 rounded"></div>
            <div class="w-20 h-5 bg-gray-100 rounded"></div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="space-y-2 mb-6 flex-grow">
          <div
            v-for="j in 2"
            :key="j"
            class="flex justify-between items-center bg-gray-50 p-3 rounded-2xl"
          >
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-gray-200 rounded-lg"></div>
              <div class="w-28 h-4 bg-gray-200 rounded"></div>
            </div>
            <div class="w-16 h-4 bg-gray-100 rounded"></div>
          </div>
        </div>

        <!-- Footer: Total + Button -->
        <div
          class="flex justify-between items-center border-t border-gray-100 pt-4"
        >
          <div class="space-y-1">
            <div class="w-20 h-3 bg-gray-100 rounded"></div>
            <div class="w-16 h-6 bg-gray-200 rounded"></div>
          </div>
          <div class="w-36 h-11 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    </div>
  </div>
</template>
