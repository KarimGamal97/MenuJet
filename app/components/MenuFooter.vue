<template>
  <footer
    class="py-6 text-center relative z-10 select-none"
  >
    <div class="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400">
      <span>مدعوم بواسطة</span>
      <a
        href="/"
        class="text-orange-600 font-black hover:text-orange-500 transition-colors flex items-center gap-1">
        <span>MenuJet</span></a>
    </div>
  </footer>
</template>

<script setup>
defineProps(["whatsappNumber"]);
</script>
