<template>
  <section
    id="demo"
    class="py-20 bg-gray-50/80 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800/80 transition-colors duration-300"
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="max-w-5xl mx-auto px-4 sm:px-6 text-center">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-bold border border-orange-200/70 dark:border-orange-500/30 mb-5">
        <BaseIcon name="play-circle" class="w-4 h-4 shrink-0" />
        <span>{{ $t('demo_video.badge') }}</span>
      </div>

      <!-- Heading -->
      <h2 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
        {{ $t('demo_video.title_part1') }}
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
          {{ $t('demo_video.title_highlight') }}
        </span>
        {{ $t('demo_video.title_part2') }}
      </h2>

      <p class="text-gray-500 dark:text-slate-400 text-base md:text-lg font-medium max-w-2xl mx-auto mb-10">
        {{ $t('demo_video.subtitle') }}
      </p>

      <!-- Video Frame -->
      <div class="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/15 dark:shadow-black/50 border border-slate-200/80 dark:border-slate-700/80 bg-slate-950 ring-4 ring-white/80 dark:ring-slate-800/70">
        <video
          controls
          playsinline
          preload="none"
          class="w-full max-h-[560px] aspect-video object-contain bg-slate-950"
        >
          <source :src="demoVideoUrl" type="video/mp4" />
          {{ $t('demo_video.unsupported') }}
        </video>
      </div>
    </div>
  </section>
</template>

<script setup>
import demoVideoUrl from '~/assets/videos/MenuJet_How_It_Works.mp4'
</script>

<style scoped>
video {
  display: block;
}
</style>
