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
          <h2 class="text-2xl font-black text-gray-800">
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
          <label class="block text-sm font-bold mb-3 text-gray-700 px-1">{{
            $t("admin.restaurant_name")
          }}</label>
          <div class="relative">
            <input
              v-model="form.business_name"
              class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold placeholder:text-gray-300"
              :placeholder="$t('admin.restaurant_name_placeholder')"
            />
          </div>
        </div>

        <!-- Logo Upload Section -->
        <div class="md:col-span-2 mb-4">
          <label class="block text-sm font-bold mb-3 text-gray-700 px-1"
            >شعار المطعم</label
          >
          <div class="flex items-center gap-4">
            <div
              class="w-20 h-20 bg-gray-100 rounded-[2rem] flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200"
            >
              <img
                v-if="form.logo"
                :src="form.logo"
                class="w-full h-full object-cover"
              />
              <BaseIcon name="photo" class="w-8 h-8 opacity-20" />
            </div>
            <label
              class="cursor-pointer bg-white border border-gray-200 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-gray-50 transition-all"
            >
              {{ uploading ? "جاري الرفع..." : "اختر صورة الشعار" }}
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
            class="flex items-center bg-gray-50 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-orange-500 transition-all font-sans"
            dir="ltr"
          >
            <span class="text-gray-400 text-sm font-bold opacity-60"
              >menujet.com/menu/</span
            >
            <input
              v-model="form.slug"
              placeholder="my-restaurant"
              class="flex-1 py-4 px-1 bg-transparent border-none outline-none font-bold placeholder:text-gray-300"
            />
          </div>

          <!-- QR Code Section -->
          <div
            v-if="form.slug"
            class="mt-4 flex flex-col sm:flex-row items-center gap-5 bg-orange-50/50 p-5 rounded-[2.5rem] border border-orange-100/50 animate-in fade-in slide-in-from-top-2 duration-500"
          >
            <div
              class="bg-white p-3 rounded-3xl shadow-sm border border-orange-50 shrink-0"
            >
              <img :src="qrUrl" class="w-24 h-24" alt="Menu QR Code" />
            </div>
            <div class="flex-1 text-center sm:text-right">
              <h4 class="font-black text-gray-800 text-sm mb-1">
                {{ $t("admin.qr_code_title") }}
              </h4>
              <p
                class="text-[10px] text-gray-400 font-bold leading-relaxed mb-4"
              >
                {{ $t("admin.qr_code_subtitle") }}
              </p>
              <div class="flex flex-wrap justify-center sm:justify-start gap-2">
                <button
                  @click="copyMenuUrl"
                  class="text-[10px] bg-orange-600 text-white px-5 py-2.5 rounded-2xl font-black hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 active:scale-95 flex items-center gap-2"
                >
                  <BaseIcon name="copy" class="w-4 h-4" />
                  {{ $t("admin.copy_link") }}
                </button>
                <button
                  @click="downloadQr"
                  class="text-[10px] bg-white text-orange-600 border border-orange-100 px-5 py-2.5 rounded-2xl font-black hover:bg-orange-50 transition-all flex items-center gap-2 shadow-sm"
                >
                  <BaseIcon name="download" class="w-4 h-4" />
                  {{ $t("admin.download_qr") }}
                </button>
              </div>
            </div>
          </div>

          <p
            class="text-[10px] text-amber-500 font-bold mt-3 px-1 flex items-center gap-1.5"
          >
            <BaseIcon name="alert" class="w-3.5 h-3.5" />
            {{ $t("admin.slug_qr_warning") }}
          </p>
        </div>

        <!-- رقم الواتساب -->
        <div class="md:col-span-2">
          <label class="block text-sm font-bold mb-3 text-gray-700 px-1">{{
            $t("admin.whatsapp_number")
          }}</label>
          <div class="relative">
            <input
              v-model="form.whatsapp_number"
              :placeholder="$t('admin.whatsapp_placeholder')"
              class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold"
            />
            <BaseIcon
              name="phone"
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30"
            />
          </div>
        </div>

        <!-- Restaurant Status Toggle -->
        <div class="md:col-span-2">
          <div
            class="p-4 bg-orange-50/30 rounded-2xl border border-orange-100/50 flex items-center justify-between"
          >
            <div>
              <h3 class="text-sm font-black text-gray-800 mb-1">حالة المطعم</h3>
              <p class="text-[10px] text-gray-400 font-bold">
                تحكم في ظهور "جاهزون لاستقبال طلباتك" للزبائن
              </p>
            </div>
            <button
              @click="form.is_active = !form.is_active"
              type="button"
              :class="[
                'w-14 h-8 rounded-full transition-all duration-300 relative p-1',
                form.is_active ? 'bg-orange-600' : 'bg-gray-200',
              ]"
            >
              <div
                :class="[
                  'w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 transform',
                  form.is_active ? '-translate-x-6' : 'translate-x-0',
                ]"
              ></div>
            </button>
          </div>
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

          <div class="flex gap-3">
            <input
              v-model="newCategory"
              @keyup.enter="addCategory"
              :placeholder="$t('admin.add_category_placeholder')"
              class="flex-1 p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 shadow-sm text-sm font-bold"
            />
            <button
              @click="addCategory"
              class="w-14 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-md shadow-orange-100 active:scale-90 flex items-center justify-center"
            >
              <BaseIcon name="plus" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <button
          @click="saveSettings"
          :disabled="loading"
          class="w-full py-5 bg-orange-600 text-white rounded-2xl font-black shadow-xl shadow-orange-100 transition-all hover:bg-orange-700 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <div
            v-if="loading"
            class="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"
          ></div>
          <span v-else>{{ $t("admin.save_settings") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin", middleware: "auth" });

const client = useSupabaseClient();
const user = useSupabaseUser();
const { $toast } = useNuxtApp();
const uploading = ref(false);

const loading = ref(false);
const newCategory = ref("");

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

const form = ref({
  business_name: "",
  slug: "",
  whatsapp_number: "",
  categories: ["Main", "Drinks", "Dessert"],
  logo: "",
  is_active: true,
});

const { data: profile, refresh } = await useAsyncData(
  "admin-settings",
  async () => {
    if (!user.value) return null;
    const uId = user.value.sub || user.value.id;

    const { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("user_id", uId)
      .maybeSingle();

    if (error) console.error("Fetch Settings Error:", error);
    return data;
  },
  { watch: [user] },
);

watch(
  profile,
  (newData) => {
    if (newData) {
      form.value = {
        business_name: newData.business_name || "",
        slug: newData.slug || "",
        whatsapp_number: newData.whatsapp_number || "",
        categories: newData.categories || ["Main", "Drinks", "Dessert"],
        logo: newData.logo || "",
        is_active: newData.is_active !== false,
      };
    }
  },
  { immediate: true },
);

const addCategory = () => {
  const cat = newCategory.value.trim();
  if (!cat) {
    return $toast.error($t("admin.error_fields"));
  }

  if (form.value.categories.includes(cat)) {
    return $toast.error($t("admin.category_exists"));
  }

  form.value.categories.push(cat);
  newCategory.value = "";
};

const uploadLogo = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  uploading.value = true;

  const fileExt = file.name.split(".").pop();
  // Safe ID access
  const uId = user.value?.id || user.value?.sub || "anonymous";
  const fileName = `${uId}-${Math.random()}.${fileExt}`;
  const filePath = `logos/${fileName}`;
  try {
    // 1. Upload to Supabase Storage (Assumes you have a bucket named 'logos')
    const { error: uploadError } = await client.storage
      .from("logos")
      .upload(filePath, file);
    if (uploadError) throw uploadError;
    // 2. Get Public URL
    const { data } = client.storage.from("logos").getPublicUrl(filePath);

    // 3. Update the form state
    form.value.logo = data.publicUrl;
    $toast.success("Logo uploaded!");
  } catch (err) {
    $toast.error("Error uploading logo");
  } finally {
    uploading.value = false;
  }
};

const removeCategory = (index) => {
  if (form.value.categories.length <= 1) {
    return $toast.error($t("admin.at_least_one_category"));
  }
  form.value.categories.splice(index, 1);
};

const saveSettings = async () => {
  const uId = user.value?.sub || user.value?.id;
  if (!uId) return $toast.error($t("admin.error_auth"));

  loading.value = true;
  try {
    const settingsData = {
      business_name: form.value.business_name, // If you have a single business_name column
      business_name_ar: form.value.business_name, // Fallback if using localized columns
      slug: form.value.slug
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-"),
      whatsapp_number: form.value.whatsapp_number,
      categories: form.value.categories,
      logo: form.value.logo,
      is_active: form.value.is_active,
    };

    const { error } = await client
      .from("profiles")
      .update(settingsData)
      .eq("user_id", uId);

    if (error) throw error;

    $toast.success($t("admin.settings_success"));
    await refresh();
  } catch (err) {
    console.error("Settings Save Error:", err);
    $toast.error(err.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.border-3 {
  border-width: 3px;
}
</style>
