<template>
  <footer
    class="bg-white/80 backdrop-blur-lg border-t border-gray-100 py-3.5 text-center z-40"
  >
    <div class="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400">
      <span>مدعوم بواسطة</span>
      <a
        href="/"
        class="text-orange-600 font-black hover:text-orange-500 transition-colors flex items-center gap-1"
      >
        <span>MenuJet</span>
        <span class="text-xs">🚀</span>
      </a>
    </div>
  </footer>
</template>

<script setup>
defineProps(["whatsappNumber"]);
</script>
