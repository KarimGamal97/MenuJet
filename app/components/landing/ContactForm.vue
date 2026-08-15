<template>
  <section id="contact" class="relative py-24 overflow-hidden bg-gradient-to-br from-orange-600 to-orange-500" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    
    <!-- Decorative background elements -->
    <div class="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        <!-- Text Content -->
        <div class="md:w-1/2 text-center md:text-start text-white">
          <h2 class="text-4xl md:text-5xl font-black mb-6 leading-tight">{{ $t('contact.title') }}</h2>
          <p class="text-xl opacity-90 mb-10">{{ $t('contact.subtitle') }}</p>
          <ul class="space-y-4 opacity-90 hidden md:block text-start">
             <li class="flex items-center gap-4">
                <span class="bg-white/20 p-2 rounded-full"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
                <span class="text-xl font-bold">{{ $i18n.locale === 'ar' ? 'تفعيل في نفس اليوم' : 'Same-day Activation' }}</span>
             </li>
             <li class="flex items-center gap-4">
                <span class="bg-white/20 p-2 rounded-full"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></span>
                <span class="text-xl font-bold">{{ $i18n.locale === 'ar' ? 'بدون بطاقة ائتمان' : 'No Credit Card Required' }}</span>
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
              
              <PrimaryButton type="submit" class="w-full !py-4 !rounded-xl !text-xl mt-4">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {{ $t('contact.cta') }}
              </PrimaryButton>
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
  window.open(`https://wa.me/201094123678?text=${encodeURIComponent(msg)}`, '_blank')
}
</script>

<style scoped>
#contact {
  font-family: 'Cairo', sans-serif;
}
</style>