<template>
  <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4">
    <div class="flex items-center justify-between gap-3 mb-6 px-1 flex-wrap">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/10 to-orange-500/20 flex items-center justify-center shrink-0 border border-orange-200">
          <BaseIcon name="sparkles" class="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-bold text-gray-800 block">{{ $t('admin.bio_hub_title') }}</label>
          </div>
          <p class="text-[10px] text-gray-400 font-bold mt-0.5">{{ $t('admin.bio_hub_desc') }}</p>
        </div>
      </div>

      <a
        v-if="form.slug"
        :href="`/menu/${form.slug}`"
        target="_blank"
        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-orange-600 text-xs font-bold transition-all border border-gray-200 hover:border-orange-200 active:scale-95 cursor-pointer"
      >
        <BaseIcon name="arrow-up-right" class="w-3.5 h-3.5" />
        <span>{{ $t('admin.bio_hub_preview') }}</span>
      </a>
    </div>

    <div class="space-y-4">
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <BaseToggle
          v-model="form.bio_hub_enabled"
          :label="$t('admin.enable_bio_hub')"
          :locked="!canAllowBioHub"
          :badge="$t('plans.pro_badge_short')"
          @lock-click="emit('openUpgrade', $t('plans.feat_bio_hub'), $t('plans.pro_badge_short'), $t('plans.bio_hub_modal_msg'))"
          class="!bg-transparent"
        />

        <!-- Social Fields Grid (Only when active & Pro) -->
        <div
          v-if="form.bio_hub_enabled && canAllowBioHub"
          class="px-5 pb-5 pt-3 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300"
        >
          <div
            v-for="field in socialFields"
            :key="field.key"
            :class="['flex flex-col gap-1.5', field.fullWidth ? 'md:col-span-2' : '']"
          >
            <label class="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
              <BaseIcon :name="field.icon" :class="['w-3.5 h-3.5', field.iconColor]" />
              {{ $t(field.labelKey) }}
            </label>
            <input
              :type="field.type"
              v-model="form[field.key]"
              :placeholder="$t(field.placeholderKey)"
              dir="ltr"
              class="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-left"
            />
          </div>

          <!-- Additional Contact Numbers (Pro / Bio Hub) -->
          <div class="md:col-span-2 pt-3 border-t border-gray-100 space-y-3">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <span class="text-xs font-black text-gray-800 flex items-center gap-1.5">
                  <BaseIcon name="phone-call" class="w-3.5 h-3.5 text-orange-600" />
                  <span>{{ $t("admin.additional_phones_title") }}</span>
                </span>
                <p class="text-[10px] font-semibold text-gray-400 mt-0.5">
                  {{ $t("admin.additional_phones_hint") }}
                </p>
              </div>

              <button
                type="button"
                @click="addPhone"
                :disabled="additionalPhones.length >= MAX_ADDITIONAL_PHONES"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 text-xs font-black transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <BaseIcon name="plus" class="w-3.5 h-3.5" />
                <span>{{ $t("admin.additional_phones_add") }}</span>
              </button>
            </div>

            <div v-if="additionalPhones.length > 0" class="space-y-2.5">
              <div
                v-for="(item, idx) in additionalPhones"
                :key="idx"
                class="bg-gray-50/80 rounded-2xl border border-gray-200/80 p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
              >
                <input
                  v-model="item.label"
                  type="text"
                  :placeholder="$t('admin.additional_phone_label_placeholder')"
                  class="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                />
                <input
                  v-model="item.number"
                  type="tel"
                  dir="ltr"
                  :placeholder="$t('admin.additional_phone_number_placeholder')"
                  class="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 placeholder:text-gray-400 text-end focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                />
                <div class="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                  <label class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-[11px] font-bold text-emerald-700 cursor-pointer select-none">
                    <input
                      v-model="item.has_whatsapp"
                      type="checkbox"
                      class="accent-emerald-600 rounded cursor-pointer"
                    />
                    <BaseIcon name="whatsapp" solid class="w-3.5 h-3.5" />
                    <span>{{ $t("admin.additional_phone_whatsapp") }}</span>
                  </label>
                  <button
                    type="button"
                    @click="removePhone(idx)"
                    class="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    :title="$t('admin.delete')"
                  >
                    <BaseIcon name="trash" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AdditionalPhone } from '~/types'

const MAX_ADDITIONAL_PHONES = 5

const props = defineProps<{
  form: Record<string, any>
  canAllowBioHub: boolean
}>()

const emit = defineEmits<{
  openUpgrade: [featureName: string, badge: string, customMsg: string]
}>()

const additionalPhones = computed<AdditionalPhone[]>(() => {
  if (!Array.isArray(props.form.additional_phones)) {
    props.form.additional_phones = []
  }
  return props.form.additional_phones
})

const addPhone = () => {
  if (additionalPhones.value.length >= MAX_ADDITIONAL_PHONES) return
  additionalPhones.value.push({ label: '', number: '', has_whatsapp: true })
}

const removePhone = (index: number) => {
  additionalPhones.value.splice(index, 1)
}

const socialFields = [
  {
    key: 'social_location',
    type: 'url',
    icon: 'map-pin',
    iconColor: 'text-emerald-600',
    labelKey: 'admin.social_location',
    placeholderKey: 'admin.social_location_placeholder',
    fullWidth: true,
  },
  {
    key: 'social_phone',
    type: 'tel',
    icon: 'phone',
    iconColor: 'text-blue-600',
    labelKey: 'admin.social_phone',
    placeholderKey: 'admin.social_phone_placeholder',
  },
  {
    key: 'social_instagram',
    type: 'text',
    icon: 'instagram',
    iconColor: 'text-pink-600',
    labelKey: 'admin.social_instagram',
    placeholderKey: 'admin.social_instagram_placeholder',
  },
  {
    key: 'social_facebook',
    type: 'text',
    icon: 'facebook',
    iconColor: 'text-blue-600',
    labelKey: 'admin.social_facebook',
    placeholderKey: 'admin.social_facebook_placeholder',
  },
  {
    key: 'social_tiktok',
    type: 'text',
    icon: 'tiktok',
    iconColor: 'text-gray-900',
    labelKey: 'admin.social_tiktok',
    placeholderKey: 'admin.social_tiktok_placeholder',
  },
]
</script>
