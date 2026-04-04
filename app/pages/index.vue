<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-6">
    <div class="text-center">
      <h1 class="text-2xl font-black text-orange-600 mb-2">MenuJet</h1>
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mt-4"
      ></div>
    </div>
  </div>
</template>

<script setup>
const { push } = useRouter();
onMounted(() => {
  push("/login");
});
</script>
