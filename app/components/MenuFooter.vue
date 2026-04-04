<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 py-4 text-center z-40"
  >
    <p
      class="text-xs text-gray-500 font-medium flex items-center justify-center gap-1"
    >
      Built with
      <BaseIcon name="heart-solid" class="w-3.5 h-3.5 text-orange-600" solid />
      by
      <span class="text-orange-600 font-black">Kariim</span>
    </p>
  </footer>
</template>

<script setup>
defineProps(["whatsappNumber"]);
</script>
