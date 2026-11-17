<template>
  <section id="contact" class="relative py-24 overflow-hidden bg-gradient-to-br from-orange-600 to-orange-500" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    
    <!-- Decorative background elements -->
    <div class="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        <!-- Text Content -->
        <div class="md:w-1/2 text-center md:text-start text-white">
          <h2 class="text-[26px] sm:text-4xl md:text-5xl font-black mb-6 leading-tight whitespace-nowrap sm:whitespace-normal">{{ $t('contact.title') }}</h2>
          <p class="text-xl opacity-90 mb-10">{{ $t('contact.subtitle') }}</p>
          <ul class="space-y-4 opacity-90 hidden md:block text-start">
             <li class="flex items-center gap-4">
                <span class="bg-white/20 p-2 rounded-full"><BaseIcon name="check" class="w-5 h-5 text-white stroke-[3]" /></span>
                <span class="text-xl font-bold">{{ $t('contact.feature_1') }}</span>
             </li>
             <li class="flex items-center gap-4">
                <span class="bg-white/20 p-2 rounded-full"><BaseIcon name="check" class="w-5 h-5 text-white stroke-[3]" /></span>
                <span class="text-xl font-bold">{{ $t('contact.feature_2') }}</span>
             </li>
             <li class="flex items-center gap-4">
                <span class="bg-white/20 p-2 rounded-full"><BaseIcon name="check" class="w-5 h-5 text-white stroke-[3]" /></span>
                <span class="text-xl font-bold">{{ $t('contact.feature_3') }}</span>
             </li>
          </ul>
        </div>

        <!-- Form Card -->
        <div class="md:w-1/2 w-full">
          <div class="bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 transform hover:scale-[1.02] transition-transform duration-300">
            <form @submit.prevent="sendWhatsApp" class="space-y-6">
              <div>
                <label class="block text-gray-700 font-bold mb-2 text-start">{{ $t('contact.name_placeholder') }}</label>
                <input v-model="form.name" type="text" :placeholder="$t('contact.name_placeholder')" class="w-full p-4 rounded-xl border border-gray-200 text-gray-900 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white" required>
              </div>
              
              <div>
                <label class="block text-gray-700 font-bold mb-2 text-start">{{ $t('contact.restaurant_placeholder') }}</label>
                <input v-model="form.restaurant" type="text" :placeholder="$t('contact.restaurant_placeholder')" class="w-full p-4 rounded-xl border border-gray-200 text-gray-900 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white" required>
              </div>
              
              <PrimaryButton type="submit" class="w-full !py-4 !px-4 sm:!px-8 !rounded-xl !text-base sm:!text-xl mt-4 whitespace-nowrap">
                <BaseIcon name="whatsapp" solid class="w-6 h-6" />
                {{ $t('contact.cta') }}
              </PrimaryButton>

              <div class="relative flex py-1 items-center">
                <div class="flex-grow border-t border-gray-200"></div>
                <span class="flex-shrink mx-4 text-gray-400 text-xs font-bold">{{ $i18n.locale === 'ar' ? 'أو تواصل معنا عبر' : 'Or connect via' }}</span>
                <div class="flex-grow border-t border-gray-200"></div>
              </div>

              <a
                href="https://www.facebook.com/profile.php?id=61594028551451"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold transition-all duration-300 border border-blue-100 shadow-sm cursor-pointer"
              >
                <BaseIcon name="facebook" solid class="w-5 h-5" />
                <span>{{ $i18n.locale === 'ar' ? 'صفحتنا على فيسبوك' : 'Our Facebook Page' }}</span>
              </a>
            </form>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const form = ref({
  name: '',
  restaurant: ''
})

const sendWhatsApp = () => {
  let msg = t('contact.msg_template')
  msg = msg.replace('{name}', form.value.name).replace('{restaurant}', form.value.restaurant)
  window.open(`https://wa.me/201132234124?text=${encodeURIComponent(msg)}`, '_blank')
}
</script>

<style scoped>
#contact {
  font-family: 'Cairo', sans-serif;
}
</style>