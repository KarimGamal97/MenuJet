<template>
  <section id="demo" class="py-20 bg-gray-50">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-8">
        شوف <span class="text-orange-600">MenuJet</span> في دقيقة
      </h2>
      
      <div class="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-black">
        <video 
          controls 
          class="w-full aspect-video object-cover"
        >
          <source src="~/assets/videos/presenting-video.mp4" type="video/mp4">
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      </div>

      <p class="mt-8 text-gray-500 font-medium">
        * الفيديو ده بيوضح تجربة العميل الحقيقية من الموبايل
      </p>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
video {
  display: block;
}
</style>