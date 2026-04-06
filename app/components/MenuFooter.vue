<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 py-4 text-center z-40"
  >
    <p class="text-[10px] text-gray-300 uppercase tracking-widest font-bold">
      Created by
      <a
        href="https://kariim-portfolio.vercel.app/"
        target="_blank"
        class="text-orange-600 hover:text-orange-400 transition-colors"
      >
        Kariim
      </a>
    </p>
  </footer>
</template>

<script setup>
defineProps(["whatsappNumber"]);
</script>
