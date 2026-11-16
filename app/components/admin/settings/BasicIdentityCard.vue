<template>
  <!-- Restaurant Name -->
  <div class="md:col-span-2">
    <BaseInput
      v-model="form.business_name"
      :label="$t('admin.restaurant_name')"
      :placeholder="$t('admin.restaurant_name_placeholder')"
    />
  </div>

  <!-- Logo Upload Section -->
  <div class="md:col-span-2 mb-2 p-5 bg-gray-50/60 rounded-3xl border border-gray-100">
    <label class="block text-sm font-bold mb-3 text-gray-800 px-1">
      {{ $t("admin.logo_section_title") }}
    </label>
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div class="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 shadow-xs shrink-0">
        <template v-if="logoUploading">
          <div class="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div class="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </template>
        <img
          v-if="form.logo"
          :src="form.logo"
          class="w-full h-full object-cover"
          :class="{ 'opacity-50': logoUploading }"
        />
        <BaseIcon v-else name="photo" class="w-8 h-8 text-gray-300" />
      </div>

      <div class="flex-1 space-y-2">
        <div class="flex flex-wrap items-center gap-3">
          <label class="cursor-pointer">
            <BaseButton
              variant="outline"
              size="sm"
              :loading="logoUploading"
              @click="logoInputRef?.click()"
              type="button"
            >
              {{ form.logo ? $t("admin.change_logo") : $t("admin.choose_logo") }}
            </BaseButton>
            <input
              ref="logoInputRef"
              type="file"
              class="hidden"
              @change="emit('uploadLogo', $event)"
              accept="image/*"
              :disabled="logoUploading"
            />
          </label>

          <button
            v-if="form.logo"
            type="button"
            @click="form.logo = ''"
            class="text-xs text-red-500 hover:text-red-700 font-bold px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
          >
            {{ $t("admin.delete_logo") }}
          </button>
        </div>

        <p class="text-xs text-gray-400 font-medium leading-relaxed">
          {{ $t("admin.logo_hint") }}
        </p>
      </div>
    </div>
  </div>

  <!-- Menu Slug & QR Code -->
  <div class="md:col-span-2">
    <label class="block text-sm font-bold mb-3 text-gray-700 px-1">{{ $t("admin.menu_slug") }}</label>
    <div
      class="flex items-center bg-gray-100/90 rounded-2xl px-3 sm:px-4 border border-gray-200/80 shadow-xs gap-2 transition-all focus-within:ring-2 focus-within:ring-orange-500/20"
      dir="ltr"
    >
      <span class="text-gray-400 select-none flex items-center" :title="$t('admin.slug_locked_title')">
        <BaseIcon name="lock" class="w-4 h-4" />
      </span>
      <input
        :value="menuUrl"
        readonly
        placeholder="https://getmenujet.com/menu/..."
        class="flex-1 py-3.5 bg-transparent border-none outline-none font-bold text-gray-700 text-xs sm:text-sm select-all cursor-text"
        @click="($event.target as HTMLInputElement).select()"
      />
      <button
        type="button"
        @click="emit('copyUrl')"
        class="inline-flex items-center gap-1.5 bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 hover:border-orange-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer active:scale-95"
      >
        <BaseIcon name="copy" class="w-3.5 h-3.5 text-gray-500" />
        <span>{{ $t("admin.copy_link") }}</span>
      </button>
    </div>

    <div class="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-amber-50/80 border border-amber-200/60 rounded-2xl p-3.5 text-amber-900">
      <div class="flex items-center gap-2">
        <BaseIcon name="lock" class="w-4 h-4 text-amber-700 shrink-0" />
        <span class="font-medium text-[11px] sm:text-xs leading-relaxed">
          {{ $t("admin.slug_locked_note") }}
        </span>
      </div>
      <a
        :href="getSupportWhatsAppUrl($t('admin.slug_change_whatsapp_msg', { name: form.business_name || form.slug }))"
        target="_blank"
        class="inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-black text-[11px] sm:text-xs shrink-0 hover:underline bg-white/90 px-3.5 py-2 rounded-xl border border-orange-100 shadow-2xs self-start sm:self-auto cursor-pointer transition-colors"
      >
        <BaseIcon name="whatsapp" class="w-3.5 h-3.5 fill-current" />
        <span>{{ $t("admin.contact_support_change") }}</span>
      </a>
    </div>

    <!-- QR Code Section -->
    <div
      v-if="form.slug"
      class="mt-4 flex flex-col sm:flex-row items-center gap-5 bg-orange-50/50 p-5 rounded-3xl border border-orange-100/50 animate-in fade-in slide-in-from-top-2 duration-500"
    >
      <div class="bg-white p-3 rounded-2xl shadow-sm border border-orange-50 shrink-0">
        <img :src="qrUrl" class="w-24 h-24" alt="Menu QR Code" />
      </div>
      <div class="flex-1 text-center sm:text-right">
        <h4 class="font-bold text-gray-800 text-sm mb-1">{{ $t("admin.qr_code_title") }}</h4>
        <p class="text-[10px] text-gray-400 font-bold leading-relaxed mb-4">
          {{ $t("admin.qr_code_subtitle") }}
        </p>
        <div class="flex flex-wrap justify-center sm:justify-start gap-2">
          <BaseButton
            variant="primary"
            size="sm"
            icon="copy"
            @click="emit('copyUrl')"
            class="!text-[10px] !px-5 !py-2.5"
          >
            {{ $t("admin.copy_link") }}
          </BaseButton>
          <BaseButton
            variant="outline"
            size="sm"
            icon="download"
            @click="emit('downloadQr')"
            class="!text-[10px] !px-5 !py-2.5 !bg-white"
          >
            {{ $t("admin.download_qr") }}
          </BaseButton>
          <NuxtLink
            :to="{ path: '/admin/qr-print', query: { slug: form.slug } }"
            target="_blank"
            class="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-[10px] shadow-sm transition-all"
          >
            <BaseIcon name="print" class="w-3.5 h-3.5" />
            <span>{{ $t("admin.print_table_stand") }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <!-- WhatsApp Number -->
  <div class="md:col-span-2">
    <BaseInput
      v-model="form.whatsapp_number"
      :label="$t('admin.whatsapp_number')"
      :placeholder="$t('admin.whatsapp_placeholder')"
      icon="phone"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  form: Record<string, any>
  logoUploading: boolean
  menuUrl: string
  qrUrl: string
}>()

const emit = defineEmits<{
  uploadLogo: [event: Event]
  copyUrl: []
  downloadQr: []
}>()

const logoInputRef = ref<HTMLInputElement | null>(null)
</script>
