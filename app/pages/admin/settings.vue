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
        <div class="md:col-span-2 mb-4">
          <label class="block text-sm font-bold mb-3 text-gray-700 px-1"
            >شعار المطعم</label
          >
          <div class="flex items-center gap-4">
            <div
              class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200"
            >
              <img
                v-if="form.logo"
                :src="form.logo"
                class="w-full h-full object-cover"
              />
              <BaseIcon name="photo" class="w-8 h-8 opacity-20" />
            </div>
            <label class="cursor-pointer">
              <BaseButton
                variant="outline"
                size="sm"
                :loading="uploading"
                class="pointer-events-none"
              >
                {{ $t("admin.choose_logo") }}
              </BaseButton>
              <input
                type="file"
                class="hidden"
                @change="uploadLogo"
                accept="image/*"
                :disabled="uploading"
              />
            </label>
          </div>
        </div>

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
            dir="ltr"
          />
        </div>

        <!-- Restaurant Status Toggle -->
        <div class="md:col-span-2">
          <BaseToggle
            v-model="form.is_active"
            label="حالة المطعم (جاهزون لاستقبال طلباتك)"
            class="!bg-orange-50/30 !border !border-orange-100/50"
          />
        </div>

        <!--  Categories -->
        <div class="md:col-span-2 pt-4">
          <div class="flex items-center justify-between mb-4 px-1">
            <label class="text-sm font-bold text-gray-700">{{
              $t("admin.menu_sections")
            }}</label>
            <span
              class="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded-lg font-bold"
              >{{ form.categories.length }}
              {{ $t("admin.sections_count") }}</span
            >
          </div>

          <div
            class="flex flex-wrap gap-2 mb-6 min-h-[50px] p-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200"
          >
            <div
              v-for="(cat, index) in form.categories"
              :key="index"
              class="bg-white text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-100 shadow-sm animate-in zoom-in duration-200 group hover:border-orange-200"
            >
              <span class="font-bold text-sm">{{ cat }}</span>
              <button
                @click="removeCategory(index)"
                class="text-gray-300 hover:text-red-500 transition-colors flex items-center justify-center p-1"
              >
                <BaseIcon name="close" class="w-4 h-4" />
              </button>
            </div>
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
        </div>
      </div>

      <div class="mt-10">
        <BaseButton
          variant="primary"
          size="lg"
          fullWidth
          :loading="loading"
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

const user = useSupabaseUser();
const { $toast } = useNuxtApp();

// Composables
const {
  profile,
  loading: actionLoading,
  uploading: logoUploading,
  fetchProfile,
  updateProfile,
  uploadLogo: uploadLogoAction,
} = useSettings();

const newCategory = ref("");
const form = ref({
  business_name: "",
  slug: "",
  whatsapp_number: "",
  categories: ["Main", "Drinks", "Dessert"],
  logo: "",
  is_active: true,
});

// Initialize Data
onMounted(async () => {
  const userId = user.value?.id || user.value?.sub;
  if (userId) {
    const data = await fetchProfile(userId);
    if (data) {
      form.value = {
        business_name: data.business_name || "",
        slug: data.slug || "",
        whatsapp_number: data.whatsapp_number || "",
        categories: data.categories || ["Main", "Drinks", "Dessert"],
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
  $toast.success("تم نسخ الرابط بنجاح!");
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

const removeCategory = (index) => {
  if (form.value.categories.length <= 1) {
    return $toast.error($t("admin.at_least_one_category"));
  }
  form.value.categories.splice(index, 1);
};

const uploadLogo = async (event) => {
  const file = event.target.files[0];
  const userId = user.value?.id || user.value?.sub;
  if (!file || !userId) return;

  const url = await uploadLogoAction(file, userId);
  if (url) form.value.logo = url;
};

const saveSettings = async () => {
  const userId = user.value?.id || user.value?.sub;
  if (!userId) return;

  const settingsData = {
    ...form.value,
    slug: form.value.slug
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-"),
  };

  await updateProfile(userId, settingsData);
};
</script>

<style scoped>
.border-3 {
  border-width: 3px;
}
</style>
