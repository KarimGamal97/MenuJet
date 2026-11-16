<template>
  <BaseModal
    :isOpen="isOpen"
    @close="emit('close')"
    :title="$t(editingId ? 'admin.edit_modal_title' : 'admin.add_modal_title')"
    max-width="max-w-md"
  >
    <div class="space-y-4 mt-2">
      <BaseInput v-model="item.name" :label="$t('admin.item_name')" />

      <!-- Pricing Type Selector (Custom Dropdown) -->
      <div class="space-y-2 relative">
        <div class="relative">
          <label
            class="absolute -top-2 right-3 bg-white px-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 group-focus-within:text-orange-500 transition-colors z-10 pointer-events-none flex gap-2"
          >
            <span>نوع التسعير</span>
          </label>
          <button
            type="button"
            @click="isPricingTypeDropdownOpen = !isPricingTypeDropdownOpen"
            class="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none flex items-center justify-between font-bold text-gray-800 shadow-sm transition-all focus:border-orange-500 focus:bg-white text-sm"
          >
            <span>{{ pricingTypes.find(p => p.value === item.pricingType)?.label || $t("admin.by_size") }}</span>
            <BaseIcon
              name="chevron-down"
              class="w-4 h-4 text-orange-500 transition-transform duration-200"
              :class="{ 'rotate-180': isPricingTypeDropdownOpen }"
            />
          </button>

          <div
            v-if="isPricingTypeDropdownOpen"
            class="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in slide-in-from-top-2 duration-200 p-2"
          >
            <button
              v-for="pt in pricingTypes"
              :key="pt.value"
              type="button"
              @click="
                item.pricingType = pt.value;
                isPricingTypeDropdownOpen = false;
              "
              :class="[
                'w-full text-right px-4 py-3 rounded-xl font-bold transition-colors text-sm',
                item.pricingType === pt.value
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-100'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600',
              ]"
            >
              {{ pt.label }}
            </button>
          </div>
        </div>
        <div
          v-if="isPricingTypeDropdownOpen"
          @click="isPricingTypeDropdownOpen = false"
          class="fixed inset-0 z-[55]"
        ></div>
      </div>

      <!-- By Size (sm/md/lg) -->
      <div v-if="item.pricingType === 'size'" class="space-y-2">
        <div class="flex gap-2">
          <button
            v-for="size in (['sm', 'md', 'lg'] as const)"
            :key="size"
            type="button"
            @click="item.activeSize = size"
            :class="[
              'flex-1 py-3 rounded-2xl font-bold text-sm transition-all border-2',
              item.activeSize === size
                ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-100'
                : 'bg-gray-50 text-gray-400 border-transparent hover:border-orange-200 hover:text-orange-600',
            ]"
          >
            {{ size }}
          </button>
        </div>
        <div class="pt-1">
          <BaseInput
            v-model="item.prices[item.activeSize]"
            type="number"
            :label="`${$t('admin.price_word')} ${item.activeSize.toUpperCase()}`"
            oninput="if (this.value.length > 5) this.value = this.value.slice(0, 5);"
          />
        </div>
        <div class="flex gap-2 pt-1">
          <div
            v-for="s in (['sm', 'md', 'lg'] as const)"
            :key="s"
            class="flex-1 bg-gray-50 rounded-xl p-2 text-center border border-gray-100"
          >
            <p class="text-[9px] font-black text-gray-400 uppercase mb-0.5">{{ s }}</p>
            <p
              class="text-xs font-black"
              :class="item.prices[s] ? 'text-gray-700' : 'text-gray-300'"
            >
              {{ item.prices[s] || "—" }}
            </p>
          </div>
        </div>
      </div>

      <!-- By Patty / Shots (single/double/triple) -->
      <div v-else-if="item.pricingType === 'patty'" class="space-y-2">
        <div class="flex gap-2">
          <button
            v-for="p in (['single', 'double', 'triple'] as const)"
            :key="p"
            type="button"
            @click="item.activePatty = p"
            :class="[
              'flex-1 py-3 rounded-2xl font-bold text-sm transition-all border-2',
              item.activePatty === p
                ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-100'
                : 'bg-gray-50 text-gray-400 border-transparent hover:border-orange-200 hover:text-orange-600',
            ]"
          >
            {{ $t(`admin.patty_${p}`) }}
          </button>
        </div>
        <div class="pt-1">
          <BaseInput
            v-model="item.prices[item.activePatty]"
            type="number"
            :label="`${$t('admin.price_word')} ${$t(`admin.patty_${item.activePatty}`)}`"
            oninput="if (this.value.length > 5) this.value = this.value.slice(0, 5);"
          />
        </div>
        <div class="flex gap-2 pt-1">
          <div
            v-for="p in (['single', 'double', 'triple'] as const)"
            :key="p"
            class="flex-1 bg-gray-50 rounded-xl p-2 text-center border border-gray-100"
          >
            <p class="text-[10px] font-black text-gray-400 mb-0.5">
              {{ $t(`admin.patty_${p}`) }}
            </p>
            <p
              class="text-xs font-black"
              :class="item.prices[p] ? 'text-gray-700' : 'text-gray-300'"
            >
              {{ item.prices[p] || '—' }}
            </p>
          </div>
        </div>
      </div>

      <!-- By Count (e.g. 10P / 15P / 25P) -->
      <div v-else-if="item.pricingType === 'count'" class="space-y-2">
        <div class="flex text-[10px] font-black text-gray-400 uppercase tracking-wider gap-2 px-1">
          <span class="flex-1">العدد / القطع</span>
          <span class="w-20 text-center">السعر</span>
        </div>
        <div
          v-for="(opt, i) in item.countOptions"
          :key="i"
          class="flex gap-2 items-center"
        >
          <div class="flex-1 flex items-center gap-2 bg-gray-50 rounded-2xl px-3 border-2 border-transparent focus-within:border-orange-400 transition-colors">
            <input
              v-model="opt.label"
              type="text"
              :placeholder="`مثال: ${['10', '15', '25'][i]}`"
              class="flex-1 py-3 bg-transparent outline-none font-bold text-sm text-gray-800"
              maxlength="5"
            />
            <span class="text-xs text-gray-400 font-bold shrink-0">قطعة</span>
          </div>
          <input
            v-model="opt.price"
            type="number"
            :placeholder="$t('common.price')"
            class="w-20 py-3 px-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-400 outline-none font-bold text-sm text-gray-800 transition-colors"
            oninput="if (this.value.length > 5) this.value = this.value.slice(0, 5);"
          />
        </div>
      </div>

      <!-- By Weight (Dynamic) -->
      <div v-else-if="item.pricingType === 'weight'" class="space-y-3">
        <div class="flex text-[10px] font-black text-gray-400 uppercase tracking-wider gap-2 px-1">
          <span class="flex-1">الوزن (مثال: 1/8 كيلو، 1/4 كيلو..)</span>
          <span class="w-24 text-center">السعر</span>
          <span class="w-9"></span>
        </div>

        <div
          v-for="(opt, i) in item.weightOptions"
          :key="i"
          class="flex gap-2 items-center"
        >
          <div class="flex-1 bg-gray-50 rounded-2xl px-4 border-2 border-transparent focus-within:border-orange-500 focus-within:bg-white transition-all">
            <input
              v-model="opt.label"
              type="text"
              :placeholder="['1/8 كيلو', '1/4 كيلو', 'كيلو'][i] || `وزن ${i + 1}`"
              class="w-full py-3 bg-transparent outline-none font-bold text-sm text-gray-800"
            />
          </div>

          <div class="w-24 bg-gray-50 rounded-2xl px-3 border-2 border-transparent focus-within:border-orange-500 focus-within:bg-white transition-all">
            <input
              v-model="opt.price"
              type="number"
              placeholder="السعر"
              class="w-full py-3 bg-transparent outline-none font-bold text-sm text-gray-800 text-center"
              oninput="if (this.value.length > 5) this.value = this.value.slice(0, 5);"
            />
          </div>

          <button
            type="button"
            v-if="item.weightOptions.length > 1"
            @click="item.weightOptions.splice(i, 1)"
            class="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <BaseIcon name="trash" class="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          @click="item.weightOptions.push({ label: '', price: '' })"
          class="w-full py-3 rounded-2xl border-2 border-dashed border-orange-200 text-orange-600 font-bold text-xs hover:bg-orange-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>+ إضافة وزن آخر</span>
        </button>
      </div>

      <!-- Fixed Price -->
      <div v-else class="space-y-2">
        <BaseInput
          v-model="item.fixedPrice"
          type="number"
          :label="$t('admin.fixed_price')"
          oninput="if (this.value.length > 5) this.value = this.value.slice(0, 5);"
        />
      </div>

      <!-- Category Dropdown -->
      <div class="space-y-2 relative">
        <div class="relative">
          <label
            class="absolute -top-2 right-3 bg-white px-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 group-focus-within:text-orange-500 transition-colors z-10 pointer-events-none flex gap-2"
          >
            <span>{{ $t("admin.item_category") }}</span>
          </label>
          <button
            type="button"
            @click="isCategoryDropdownOpen = !isCategoryDropdownOpen"
            class="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none flex items-center justify-between font-bold text-gray-800 shadow-sm transition-all focus:border-orange-500 focus:bg-white text-sm"
          >
            <span>{{ item.category || $t("admin.choose_category") }}</span>
            <BaseIcon
              name="chevron-down"
              class="w-4 h-4 text-orange-500 transition-transform duration-200"
              :class="{ 'rotate-180': isCategoryDropdownOpen }"
            />
          </button>

          <div
            v-if="isCategoryDropdownOpen"
            class="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in slide-in-from-top-2 duration-200 p-2"
          >
            <button
              v-for="cat in availableCategories"
              :key="cat"
              type="button"
              @click="
                item.category = cat;
                isCategoryDropdownOpen = false;
              "
              :class="[
                'w-full text-right px-4 py-3 rounded-xl font-bold transition-colors text-sm',
                item.category === cat
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-100'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600',
              ]"
            >
              {{ cat }}
            </button>
          </div>
        </div>
        <div
          v-if="isCategoryDropdownOpen"
          @click="isCategoryDropdownOpen = false"
          class="fixed inset-0 z-[55]"
        ></div>
      </div>

      <!-- Short Description -->
      <div class="relative group !mt-6">
        <label
          class="absolute -top-2 right-3 bg-white px-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 group-focus-within:text-orange-500 transition-colors z-10 pointer-events-none flex gap-2"
        >
          <span>{{ $t("admin.item_description") }}</span>
          <span :class="item.description.length >= 100 ? 'text-red-400' : 'text-gray-300'">
            {{ item.description.length }}/100
          </span>
        </label>
        <textarea
          v-model="item.description"
          :placeholder="$t('admin.item_description_placeholder')"
          :maxlength="100"
          rows="2"
          class="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-orange-500 transition-all text-sm font-bold text-gray-800 resize-none"
        />
      </div>

      <!-- Badge -->
      <div class="space-y-2">
        <BaseInput
          v-model="item.badge"
          :label="$t('admin.item_badge')"
          :placeholder="$t('admin.item_badge_placeholder')"
          :maxlength="20"
        />
      </div>

      <!-- Image Upload -->
      <div class="space-y-2">
        <label class="text-[10px] font-black text-gray-400 px-1 uppercase tracking-wider block">
          {{ $t("admin.item_image") }}
        </label>
        <div class="flex items-center gap-4">
          <div class="relative w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
            <template v-if="imageUploading">
              <div class="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                <div class="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </template>
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="w-full h-full object-cover"
              :class="{ 'opacity-50': imageUploading }"
            />
            <BaseIcon v-else name="photo" class="w-6 h-6 text-gray-300" />
          </div>
          <label class="flex-1 cursor-pointer">
            <div
              class="bg-white border-2 border-dashed border-gray-200 p-4 rounded-2xl text-center hover:border-orange-500 transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': imageUploading }"
            >
              <span class="text-xs font-bold text-gray-500">
                {{ imageUploading ? $t("admin.uploading_image") : "انقر لاختيار صوره" }}
              </span>
            </div>
            <input
              type="file"
              @change="emit('uploadFile', $event)"
              accept="image/*"
              class="hidden"
              :disabled="imageUploading"
            />
          </label>
        </div>
      </div>

      <BaseToggle
        v-model="item.available"
        :label="$t('admin.available')"
      />

      <!-- Extras Section -->
      <div class="mt-8 border-t border-gray-100 pt-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-black text-gray-800">{{ $t('admin.extras_label') }}</h3>
              <span v-if="!canAllowExtras" class="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                <BaseIcon name="bolt" class="w-3 h-3" />
                {{ $t('plans.basic_badge_short') }}
              </span>
            </div>
            <p class="text-[10px] text-gray-400 font-bold mt-0.5">{{ $t('admin.extras_subtitle') }}</p>
          </div>
          <BaseButton
            size="sm"
            variant="outline"
            icon="plus"
            @click="emit('addExtra')"
            class="!text-[10px] !px-3 !py-1.5"
          >
            {{ $t('admin.add_extra_btn') }}
          </BaseButton>
        </div>

        <div v-if="!canAllowExtras" class="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-center">
          <p class="text-xs font-bold text-amber-900 mb-2.5 flex items-center justify-center gap-1.5">
            <BaseIcon name="lock" class="w-3.5 h-3.5 shrink-0" />
            <span>{{ $t('plans.extras_lock_msg') }}</span>
          </p>
          <button
            type="button"
            @click="emit('openUpgradeForExtras')"
            class="inline-flex items-center gap-1 text-xs font-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <BaseIcon name="bolt" class="w-3.5 h-3.5" />
            {{ $t('plans.upgrade_btn') }}
          </button>
        </div>

        <div v-else class="space-y-3">
          <div v-for="(extra, i) in item.extras" :key="i" class="flex gap-2 items-center animate-in slide-in-from-right-2 duration-300">
            <div class="flex-1 bg-gray-50 rounded-2xl flex items-center px-3 border-2 border-transparent focus-within:border-orange-400 transition-all">
              <input
                v-model="extra.name"
                type="text"
                :placeholder="$t('admin.extra_name_placeholder')"
                class="w-full py-3 bg-transparent outline-none font-bold text-xs text-gray-800"
              />
            </div>
            <div class="w-20 bg-gray-50 rounded-2xl flex items-center px-3 border-2 border-transparent focus-within:border-orange-400 transition-all">
              <input
                v-model.number="extra.price"
                type="number"
                :placeholder="$t('common.price')"
                class="w-full py-3 bg-transparent outline-none font-bold text-xs text-center text-orange-600"
              />
            </div>
            <button @click="item.extras.splice(i, 1)" class="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0">
              <BaseIcon name="trash" class="w-4 h-4" />
            </button>
          </div>

          <div v-if="!item.extras?.length" class="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
            <p class="text-[11px] text-gray-300 font-bold">{{ $t('admin.no_extras_msg') }}</p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3">
        <BaseButton variant="secondary" fullWidth @click="emit('close')">
          {{ $t("common.cancel") }}
        </BaseButton>
        <BaseButton
          :loading="actionLoading"
          :disabled="imageUploading"
          fullWidth
          @click="emit('save')"
        >
          {{ $t("admin.save") }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { t } = useI18n()

defineProps<{
  isOpen: boolean
  editingId: string | number | null
  item: any
  availableCategories: string[]
  imageUrl: string
  imageUploading: boolean
  actionLoading: boolean
  canAllowExtras: boolean
}>()

const emit = defineEmits<{
  close: []
  save: []
  uploadFile: [event: Event]
  addExtra: []
  openUpgradeForExtras: []
}>()

const isCategoryDropdownOpen = ref(false)
const isPricingTypeDropdownOpen = ref(false)

const pricingTypes = computed(() => [
  { value: 'size', label: t('admin.by_size') },
  { value: 'patty', label: t('admin.by_patty') },
  { value: 'weight', label: t('admin.by_weight') },
  { value: 'count', label: t('admin.by_count') },
  { value: 'fixed', label: t('admin.by_fixed') },
])
</script>
