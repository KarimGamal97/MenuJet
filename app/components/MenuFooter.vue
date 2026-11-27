<template>
  <footer class="py-6 text-center relative z-10 select-none">
    <div class="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400">
      <span>Powered by</span>
      <NuxtLink
        to="/"
        title="MenuJet — Smart QR Menu for Restaurants & Cafes"
        class="text-orange-600 font-black hover:text-orange-500 transition-colors flex items-center gap-1"
      >
        <span>MenuJet</span>
      </NuxtLink>
    </div>
  </footer>
</template>

<script setup>
defineProps(["whatsappNumber"]);
</script>
