<template>
  <div class="max-w-3xl mx-auto py-4 md:py-8" dir="rtl">
    <div
      class="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-50"
    >
      <div class="flex items-center gap-4 mb-8">
        <div
          class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center"
        >
          <BaseIcon name="settings" class="w-7 h-7 text-orange-600" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-800">
            {{ $t("admin.settings_title") }}
          </h2>
          <p class="text-sm text-gray-400 font-bold mt-1">
            {{ $t("admin.settings_subtitle") }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- اسم المطعم -->
        <div class="md:col-span-2">
          <BaseInput
            v-model="form.business_name"
            :label="$t('admin.restaurant_name')"
            :placeholder="$t('admin.restaurant_name_placeholder')"
          />
        </div>

        <!-- Logo Upload Section -->
        <!-- <div class="md:col-span-2 mb-4">
          <label class="block text-sm font-bold mb-3 text-gray-700 px-1"
            >شعار المطعم</label
          >
          <div class="flex items-center gap-4">
            <div
              class="relative w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 shrink-0"
            >
              <template v-if="logoUploading">
                <div
                  class="absolute inset-0 bg-white/50 flex items-center justify-center z-10"
                >
                  <div
                    class="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"
                  ></div>
                </div>
              </template>
              <img
                v-if="form.logo"
                :src="form.logo"
                class="w-full h-full object-cover"
                :class="{ 'opacity-50': logoUploading }"
              />
              <BaseIcon v-else name="photo" class="w-8 h-8 opacity-20" />
            </div>
            <label class="cursor-pointer">
              <BaseButton
                variant="outline"
                size="sm"
                :loading="logoUploading"
                @click="$refs.logoInput.click()"
              >
                {{ $t("admin.choose_logo") }}
              </BaseButton>
              <input
                ref="logoInput"
                type="file"
                class="hidden"
                @change="uploadLogo"
                accept="image/*"
                :disabled="logoUploading"
              />
            </label>
          </div>
        </div> -->

        <!-- رابط المنيو -->
        <div class="md:col-span-2">
          <label class="block text-sm font-bold mb-3 text-gray-700 px-1">{{
            $t("admin.menu_slug")
          }}</label>
          <div
            class="flex items-center bg-gray-50 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-orange-500 transition-all shadow-sm"
            dir="ltr"
          >
            <span class="text-gray-400 text-sm font-bold opacity-60"
              >menujet.com/menu/</span
            >
            <input
              v-model="form.slug"
              placeholder="my-restaurant"
              class="flex-1 py-4 px-1 bg-transparent border-none outline-none font-bold placeholder:text-gray-300 text-sm"
            />
          </div>
          <p
            class="text-[10px] text-amber-500 font-bold mt-3 px-1 flex items-center gap-1.5"
          >
            <BaseIcon name="alert" class="w-3.5 h-3.5" />
            {{ $t("admin.slug_qr_warning") }}
          </p>

          <!-- QR Code Section -->
          <div
            v-if="form.slug"
            class="mt-4 flex flex-col sm:flex-row items-center gap-5 bg-orange-50/50 p-5 rounded-3xl border border-orange-100/50 animate-in fade-in slide-in-from-top-2 duration-500"
          >
            <div
              class="bg-white p-3 rounded-2xl shadow-sm border border-orange-50 shrink-0"
            >
              <img :src="qrUrl" class="w-24 h-24" alt="Menu QR Code" />
            </div>
            <div class="flex-1 text-center sm:text-right">
              <h4 class="font-bold text-gray-800 text-sm mb-1">
                {{ $t("admin.qr_code_title") }}
              </h4>
              <p
                class="text-[10px] text-gray-400 font-bold leading-relaxed mb-4"
              >
                {{ $t("admin.qr_code_subtitle") }}
              </p>
              <div class="flex flex-wrap justify-center sm:justify-start gap-2">
                <BaseButton
                  variant="primary"
                  size="sm"
                  icon="copy"
                  @click="copyMenuUrl"
                  class="!text-[10px] !px-5 !py-2.5"
                >
                  {{ $t("admin.copy_link") }}
                </BaseButton>
                <BaseButton
                  variant="outline"
                  size="sm"
                  icon="download"
                  @click="downloadQr"
                  class="!text-[10px] !px-5 !py-2.5 !bg-white"
                >
                  {{ $t("admin.download_qr") }}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- رقم الواتساب -->
        <div class="md:col-span-2">
          <BaseInput
            v-model="form.whatsapp_number"
            :label="$t('admin.whatsapp_number')"
            :placeholder="$t('admin.whatsapp_placeholder')"
            icon="phone"
          />
        </div>

        <!-- Restaurant Status Toggle -->
        <div class="md:col-span-2">
          <BaseToggle
            v-model="form.is_active"
            :label="$t('admin.restaurant_status_label')"
            class="!bg-orange-50/30 !border !border-orange-100/50"
          />
        </div>

        <!-- Delete Category Confirmation Modal -->
        <BaseModal
          :isOpen="showDeleteCategoryModal"
          @close="showDeleteCategoryModal = false"
          :title="$t('admin.delete_category_title')"
          :subtitle="$t('admin.delete_category_subtitle')"
          icon="trash"
          iconColor="bg-red-50 text-red-600"
          :showClose="false"
          max-width="max-w-sm"
        >
          <template #footer>
            <div class="flex gap-3">
              <BaseButton
                variant="secondary"
                fullWidth
                @click="showDeleteCategoryModal = false"
              >
                {{ $t("admin.cancel") }}
              </BaseButton>
              <BaseButton
                variant="danger"
                fullWidth
                @click="confirmRemoveCategory"
              >
                {{ $t("admin.confirm_delete") }}
              </BaseButton>
            </div>
          </template>
        </BaseModal>

        <!--  Categories -->
        <div class="md:col-span-2 pt-4">
          <div class="flex items-center gap-3 mb-4 px-1">
            <label class="text-sm font-bold text-gray-700">{{
              $t("admin.menu_sections")
            }}</label>
            <span
              class="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded-lg font-bold"
              >{{ form.categories.length }}
              {{ $t("admin.sections_count") }}</span
            >
          </div>

          <div class="flex gap-3 items-end">
            <BaseInput
              v-model="newCategory"
              @keyup.enter="addCategory"
              :placeholder="$t('admin.add_category_placeholder')"
            />
            <BaseButton
              variant="primary"
              icon="plus"
              @click="addCategory"
              class="!w-14 !h-14 !p-0 !grow-0 shrink-0"
            />
          </div>

          <div
            class="flex flex-wrap gap-2 mt-6 min-h-[50px] p-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200"
          >
            <!-- Skeleton for settings categories during loading -->
            <template v-if="profileLoading || !profile">
              <div
                v-for="i in 5"
                :key="i"
                class="w-20 h-10 bg-gray-200 animate-pulse rounded-xl"
              ></div>
            </template>

            <template v-else>
              <div
                v-for="(cat, index) in form.categories"
                :key="index"
                class="bg-white text-gray-700 px-3 py-2 rounded-xl flex items-center gap-2 border border-gray-100 shadow-sm animate-in zoom-in duration-200 group hover:border-orange-200 overflow-hidden"
              >
                <!-- Move Controls -->
                <div
                  class="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1"
                >
                  <button
                    @click="moveCategory(index, -1)"
                    v-if="index > 0"
                    class="text-gray-300 hover:text-orange-500 p-0.5 transition-colors"
                  >
                    <BaseIcon name="arrow-up" class="w-2.5 h-2.5" />
                  </button>
                  <button
                    @click="moveCategory(index, 1)"
                    v-if="index < form.categories.length - 1"
                    class="text-gray-300 hover:text-orange-500 p-0.5 transition-colors"
                  >
                    <BaseIcon name="arrow-down" class="w-2.5 h-2.5" />
                  </button>
                </div>

                <!-- Item Content -->
                <div class="flex items-center gap-2">
                  <template v-if="editingCategoryIndex === index">
                    <input
                      v-model="editingCategoryName"
                      @blur="saveCategoryName(index)"
                      @keyup.enter="saveCategoryName(index)"
                      @keyup.esc="cancelEditCategory"
                      ref="editInput"
                      class="bg-gray-50 border-none outline-none font-bold text-sm w-24 px-1 rounded text-center"
                      autofocus
                    />
                  </template>
                  <template v-else>
                    <span
                      class="font-bold text-sm cursor-pointer hover:text-orange-600 transition-colors"
                      @click="startEditCategory(index)"
                    >
                      {{ cat }}
                    </span>
                  </template>
                </div>

                <!-- Delete Button -->
                <button
                  @click="initiateRemoveCategory(index)"
                  class="text-gray-300 hover:text-red-500 transition-colors flex items-center justify-center p-1"
                >
                  <BaseIcon name="close" class="w-3.5 h-3.5" />
                </button>
              </div>
            </template>
          </div>
        </div>

        <!-- Delivery Areas -->
        <div class="md:col-span-2 pt-6 border-t border-gray-100 mt-4">
          <div class="flex items-center gap-3 mb-4 px-1">
            <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <BaseIcon name="map-pin" class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <label class="text-sm font-bold text-gray-800 block">{{ $t("admin.delivery_areas_title") }}</label>
              <span class="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 mt-1 rounded font-bold inline-flex items-center gap-1"><BaseIcon name="check" class="w-2 h-2" /> {{ form.delivery_areas?.length || 0 }} {{ $t("admin.area_registered") }}</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 items-end bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div class="flex-1 w-full">
              <BaseInput v-model="newDeliveryArea.name" @keyup.enter="addDeliveryArea" :placeholder="$t('admin.area_name_placeholder')" />
            </div>
            <div class="w-full sm:w-32">
              <BaseInput v-model.number="newDeliveryArea.price" @keyup.enter="addDeliveryArea" type="number" :placeholder="$t('admin.area_price_placeholder')" />
            </div>
            <BaseButton
              variant="primary"
              icon="plus"
              @click="addDeliveryArea"
              class="!w-14 !h-14 !p-0 shrink-0 mb-1 !bg-green-500 hover:!bg-green-600 !shadow-green-200"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div
              v-for="(area, index) in form.delivery_areas"
              :key="index"
              class="bg-white p-4 rounded-2xl border-2 border-gray-50 shadow-sm flex items-center justify-between group hover:border-green-200 transition-all relative overflow-hidden"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <BaseIcon name="map-pin" class="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p class="font-bold text-sm text-gray-800">{{ area.name }}</p>
                  <p class="text-xs font-black text-green-600 mt-1 bg-green-50 px-2 py-0.5 rounded inline-block">{{ area.price }} {{ $t("admin.currency") }}</p>
                </div>
              </div>
              <button
                @click="removeDeliveryArea(index)"
                class="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"
              >
                <BaseIcon name="trash" class="w-4 h-4" />
              </button>
            </div>
            
            <div v-if="!form.delivery_areas || form.delivery_areas.length === 0" class="col-span-full py-10 flex flex-col items-center justify-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-3xl text-sm bg-gray-50/30">
              <BaseIcon name="map-pin" class="w-10 h-10 mb-3 opacity-20" />
              {{ $t("admin.no_areas_msg") }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <BaseButton
          variant="primary"
          size="lg"
          fullWidth
          :loading="actionLoading"
          @click="saveSettings"
          class="!font-bold"
        >
          {{ $t("admin.save_settings") }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin", middleware: "auth" });

const { userId } = useAuthUser();
const { $toast } = useNuxtApp();
const { t } = useI18n();

// Composables
const {
  profile,
  loading: profileLoading,
  loading: actionLoading,
  uploading: logoUploading,
  fetchProfile,
  updateProfile,
  uploadLogo: uploadLogoAction,
} = useSettings();

const { deleteItemsByCategory, updateItemsCategory } = useMenu();

const newCategory = ref("");
const newDeliveryArea = ref({ name: "", price: "" });

const form = ref({
  business_name: "",
  slug: "",
  whatsapp_number: "",
  categories: [],
  delivery_areas: [],
  logo: "",
  is_active: true,
});

// Initialize Data
onMounted(async () => {
  if (userId.value) {
    const data = await fetchProfile(userId.value);
    if (data) {
      form.value = {
        business_name: data.business_name || "",
        slug: data.slug || "",
        whatsapp_number: data.whatsapp_number || "",
        categories: data.categories || [],
        delivery_areas: data.delivery_areas || [],
        logo: data.logo || "",
        is_active: data.is_active !== false,
      };
    }
  }
});

// QR Code Logic
const menuUrl = computed(() => {
  if (!form.value.slug) return "https://menu-jet-one.vercel.app/menu";
  const cleanSlug = form.value.slug
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");
  return `https://menu-jet-one.vercel.app/menu/${cleanSlug}`;
});

const qrUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    menuUrl.value,
  )}`;
});

const copyMenuUrl = () => {
  navigator.clipboard.writeText(menuUrl.value);
  $toast.success(t("admin.copy_success"));
};

const downloadQr = async () => {
  try {
    const response = await fetch(qrUrl.value);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-${form.value.slug || "menu"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    window.open(qrUrl.value, "_blank");
  }
};

// Form Actions
const addCategory = () => {
  const cat = newCategory.value.trim();
  if (!cat) return $toast.error($t("admin.error_fields"));
  if (form.value.categories.includes(cat))
    return $toast.error($t("admin.category_exists"));

  form.value.categories.push(cat);
  newCategory.value = "";
};

const addDeliveryArea = () => {
  const name = newDeliveryArea.value.name.trim();
  const price = newDeliveryArea.value.price;
  
  if (!name || price === '' || price < 0) {
    return $toast.error(t("admin.add_area_error"));
  }
  
  if (!form.value.delivery_areas) form.value.delivery_areas = [];
  
  if (form.value.delivery_areas.some(a => a.name === name)) {
    return $toast.error(t("admin.area_exists_error"));
  }
  
  form.value.delivery_areas.push({ name, price: Number(price) });
  newDeliveryArea.value = { name: '', price: '' };
};

const removeDeliveryArea = (index) => {
  form.value.delivery_areas.splice(index, 1);
};

// Category Reordering & Editing Logic
const editingCategoryIndex = ref(-1);
const editingCategoryName = ref("");
const editInput = ref(null);

const startEditCategory = (index) => {
  editingCategoryIndex.value = index;
  editingCategoryName.value = form.value.categories[index];
  nextTick(() => {
    // Handling possible array from v-for ref
    const input = Array.isArray(editInput.value)
      ? editInput.value[0]
      : editInput.value;
    input?.focus?.();
  });
};

const cancelEditCategory = () => {
  editingCategoryIndex.value = -1;
  editingCategoryName.value = "";
};

const saveCategoryName = async (index) => {
  const oldName = form.value.categories[index];
  const newName = editingCategoryName.value.trim();

  if (!newName || newName === oldName) {
    cancelEditCategory();
    return;
  }

  // Prevent duplicate names
  if (form.value.categories.some((c, i) => c === newName && i !== index)) {
    $toast.error($t("admin.category_exists"));
    cancelEditCategory();
    return;
  }

  // Update local state IMMEDIATELY for snappy UI
  form.value.categories[index] = newName;
  cancelEditCategory();

  // If we have a user, update the menu items too (background)
  if (userId.value) {
    await updateItemsCategory(oldName, newName, userId.value);
  }
};

const moveCategory = (index, direction) => {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= form.value.categories.length) return;

  const cats = [...form.value.categories];
  const temp = cats[index];
  cats[index] = cats[newIndex];
  cats[newIndex] = temp;
  form.value.categories = cats;
};

const showDeleteCategoryModal = ref(false);
const categoryToDeleteIndex = ref(null);

const removeCategory = async (index) => {
  if (form.value.categories.length <= 1) {
    return $toast.error($t("admin.at_least_one_category"));
  }
  const catName = form.value.categories[index];
  form.value.categories.splice(index, 1);
  if (userId.value && catName) {
    await deleteItemsByCategory(catName, userId.value);
  }
};

const initiateRemoveCategory = (index) => {
  if (form.value.categories.length <= 1) {
    return $toast.error($t("admin.at_least_one_category"));
  }
  categoryToDeleteIndex.value = index;
  showDeleteCategoryModal.value = true;
};

const confirmRemoveCategory = async () => {
  if (categoryToDeleteIndex.value === null) return;
  await removeCategory(categoryToDeleteIndex.value);
  categoryToDeleteIndex.value = null;
  showDeleteCategoryModal.value = false;
};

const uploadLogo = async (event) => {
  const file = event.target.files[0];
  if (!file || !userId.value) return;

  const url = await uploadLogoAction(file, userId.value);
  if (url) form.value.logo = url;
};

const saveSettings = async () => {
  if (!userId.value) return;

  // Be very specific about fields to update to avoid conflicts with triggers/RLS on other tables
  const settingsData = {
    business_name: form.value.business_name,
    slug: form.value.slug
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-"),
    whatsapp_number: form.value.whatsapp_number,
    categories: [...form.value.categories],
    delivery_areas: form.value.delivery_areas ? [...form.value.delivery_areas] : [],
    logo: form.value.logo,
    is_active: form.value.is_active !== false
  };

  await updateProfile(userId.value, settingsData);
};
</script>

<style scoped>
.border-3 {
  border-width: 3px;
}
</style>
