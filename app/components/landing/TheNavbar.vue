<template>
  <nav class="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100" dir="rtl">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <div class="text-2xl font-black text-orange-600">MenuJet</div>
      
      <div class="hidden md:flex gap-8 items-center">
        <a href="#features" class="text-gray-600 hover:text-orange-600 transition">المميزات</a>
        <a href="#pricing" class="text-gray-600 hover:text-orange-600 transition">الأسعار</a>
        <NuxtLink to="/login" class="bg-orange-600 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-700 transition">
          دخول المطاعم
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.text-teal { color: #00848e; }
.btn-primary { background-color: #00848e; border: none; }
</style>