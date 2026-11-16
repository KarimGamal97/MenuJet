<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
      :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
    >
      <div class="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
        <div class="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm shadow-red-100">
          <BaseIcon name="lock" class="w-8 h-8" />
        </div>

        <h2 class="text-2xl font-black text-gray-900 mb-2">
          {{ $i18n.locale === 'ar' ? 'انتهت فترة الاشتراك' : 'Subscription Expired' }}
        </h2>

        <p class="text-sm font-medium text-gray-500 mb-6 leading-relaxed">
          <template v-if="$i18n.locale === 'ar'">
            عزيزنا صاحب مطعم <span class="font-bold text-gray-800">{{ profileName }}</span>، لقد انتهت فترة اشتراكك الحالية. لتجديد الاشتراك واستئناف إدارة المنيو والطلبات، يُرجى التواصل معنا للتفعيل الفوري.
          </template>
          <template v-else>
            Dear owner of <span class="font-bold text-gray-800">{{ profileName }}</span>, your subscription period has expired. To renew and continue managing your menu and orders, please contact support.
          </template>
        </p>

        <div class="space-y-3">
          <a
            :href="getSupportWhatsAppUrl($i18n.locale === 'ar' ? 'مرحباً، أود تجديد اشتراك مطعم: ' + profileName : 'Hello, I want to renew subscription for: ' + profileName)"
            target="_blank"
            class="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
          >
            <BaseIcon name="whatsapp" class="w-5 h-5 fill-current" />
            <span>{{ $i18n.locale === 'ar' ? 'تجديد الاشتراك عبر واتساب' : 'Renew via WhatsApp' }}</span>
          </a>

          <button
            type="button"
            @click="emit('logout')"
            class="w-full py-3 px-4 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer"
          >
            {{ $t('admin.logout') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  profileName: string
}>()

const emit = defineEmits<{
  logout: []
}>()
</script>
