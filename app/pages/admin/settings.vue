<template>
  <div class="max-w-3xl mx-auto py-4 md:py-8" dir="rtl">
    <div
      class="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-50"
    >
      <div class="flex items-center gap-4 mb-8">
        <div
          class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl"
        >
          ⚙️
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
              <span v-else class="text-2xl opacity-30">🖼️</span>
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
            class="flex items-center bg-gray-50 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-orange-500 transition-all"
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
          <!-- <p class="text-[10px] text-gray-400 mt-2 px-1">
            يُستخدم هذا الرابط للوصول إلى المنيو الخاص بك مباشرة.
          </p> -->
          <p
            class="text-[10px] text-amber-500 font-bold mt-1 px-1 flex items-center gap-1"
          >
            <span>⚠️</span>
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
            <span
              class="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-40"
              >📱</span
            >
          </div>
        </div>

        <!-- إدارة الأقسام -->
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
                class="text-gray-300 hover:text-red-500 transition-colors font-black text-lg leading-none"
              >
                ×
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
              class="w-14 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-md shadow-orange-100 active:scale-90 flex items-center justify-center text-2xl"
            >
              +
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
          <span
            v-if="loading"
            class="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"
          ></span>
          {{
            loading ? $t("admin.saving_settings") : $t("admin.save_settings")
          }}
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

const form = ref({
  business_name: "",
  slug: "",
  whatsapp_number: "",
  categories: ["Main", "Drinks", "Dessert"],
  logo: "",
});

// 1. جلب البيانات - الجدول يستخدم user_id كمعرف المستخدم الحقيقي
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
      };
    }
  },
  { immediate: true },
);

// 2. منطق إدارة الأقسام
const addCategory = () => {
  const cat = newCategory.value.trim();
  if (!cat) return;

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

// 3. حفظ الإعدادات - دائماً update لأن الصف موجود مسبقاً
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
