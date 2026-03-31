<template>
  <div class="space-y-6" dir="rtl">
    <!-- Skeleton -->
    <template v-if="pending">
      <AdminSkeleton />
    </template>

    <!-- Dashboard Content  -->
    <template v-else>
      <!-- Delete Confirmation Modal -->
      <Teleport to="body">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-6"
        >
          <div
            class="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            @click="showDeleteModal = false"
          />
          <div
            class="bg-white rounded-[2.5rem] p-8 max-w-sm w-full relative z-[110] shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
          >
            <div class="text-3xl mb-4 text-center">🗑️</div>
            <h3 class="text-xl font-black text-gray-900 mb-2 text-center">
              {{ $t("admin.delete_confirm_title") }}
            </h3>
            <p class="text-gray-500 text-sm mb-8 text-center leading-relaxed">
              {{ $t("admin.delete_confirm_msg") }}
            </p>

            <div class="flex gap-3">
              <button
                @click="showDeleteModal = false"
                class="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
              >
                {{ $t("admin.cancel") }}
              </button>
              <button
                @click="confirmDelete"
                class="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-transform active:scale-95"
              >
                {{ $t("admin.delete_confirm_btn") }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <div
        class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 md:p-6 rounded-[2rem] shadow-sm gap-4"
      >
        <h2 class="text-xl md:text-2xl font-black text-gray-800">
          {{ $t("admin.menu_title") }}
          <span
            class="text-orange-600 bg-orange-50 px-3 py-1 rounded-xl text-sm md:text-base mr-2"
          >
            {{ items?.length || 0 }}
          </span>
        </h2>
        <button
          @click="openAddModal"
          class="w-full sm:w-auto bg-orange-600 text-white px-6 py-3 md:py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 transition-all hover:bg-orange-700 active:scale-95 flex items-center justify-center gap-2"
        >
          <span class="text-xl">+</span>
          {{ $t("admin.add_item") }}
        </button>
      </div>

      <!-- Filter Section -->
      <div class="flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('admin.search_placeholder')"
            class="w-full p-4 pr-12 bg-white rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
          />
          <span
            class="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-40"
            >🔍</span
          >
        </div>

        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
          <button
            v-for="cat in dynamicCategories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-5 py-3 rounded-2xl font-bold transition-all whitespace-nowrap text-sm md:text-base',
              selectedCategory === cat
                ? 'bg-orange-600 text-white shadow-md shadow-orange-100'
                : 'bg-white text-gray-400 hover:bg-orange-50 hover:text-orange-600',
            ]"
          >
            {{ cat === "الكل" ? $t("admin.all_categories") : cat }}
          </button>
        </div>
      </div>

      <!-- Items Grid -->
      <div
        v-if="filteredItems.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="bg-white p-5 rounded-[2rem] border border-gray-50 shadow-sm flex justify-between items-center group animate-in fade-in duration-300 transition-all hover:shadow-md"
        >
          <div class="flex items-center gap-4 text-right">
            <img
              v-if="item.image"
              :src="item.image"
              class="w-16 h-16 rounded-2xl object-cover bg-gray-100 shadow-sm transition-transform group-hover:scale-105"
            />
            <div
              v-else
              class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-xl"
            >
              🍴
            </div>

            <div>
              <span
                class="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded-lg font-bold"
              >
                {{ item.category }}
              </span>
              <h3
                class="font-bold text-gray-800 mt-1 line-clamp-1 truncate min-w-0"
              >
                {{ item.name }}
              </h3>
              <p class="text-orange-600 font-black text-sm">
                {{ item.price }} {{ $t("admin.currency") }}
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex gap-2">
              <button
                @click="openEditModal(item)"
                class="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-500 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 hover:text-white"
              >
                ✏️
              </button>
              <button
                @click="initiateDelete(item.id)"
                class="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shrink-0"
              >
                🗑️
              </button>
            </div>
            <!-- Availability Badge -->
            <span
              v-if="item.available === false"
              class="text-[10px] bg-gray-100 text-gray-400 px-2 py-1 rounded-lg font-bold text-center"
            >
              {{ $t("admin.hidden") }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-100"
      >
        <p class="text-gray-400 font-bold">{{ $t("admin.no_results") }}</p>
      </div>
    </template>

    <!-- Add Item Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="isModalOpen = false"
    >
      <div
        class="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-200"
      >
        <h3 class="text-xl font-black mb-6">
          {{
            $t(editingId ? "admin.edit_modal_title" : "admin.add_modal_title")
          }}
        </h3>
        <div class="space-y-4">
          <input
            v-model="newItem.name"
            :placeholder="$t('admin.item_name')"
            class="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 shadow-inner"
          />
          <input
            v-model="newItem.price"
            type="number"
            :placeholder="$t('admin.item_price')"
            class="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 shadow-inner"
          />

          <!-- Availability Toggle -->
          <div
            class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
          >
            <span class="text-sm font-bold text-gray-700">{{
              $t("admin.available") || "متوفر للطلب"
            }}</span>
            <button
              @click="newItem.available = !newItem.available"
              :class="[
                'w-12 h-6 rounded-full transition-colors relative',
                newItem.available ? 'bg-orange-500' : 'bg-gray-300',
              ]"
            >
              <div
                :class="[
                  'absolute top-1 w-4 h-4 bg-white rounded-full transition-all',
                  newItem.available ? 'right-7' : 'right-1',
                ]"
              ></div>
            </button>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 px-1">{{
              $t("admin.choose_category")
            }}</label>
            <select
              v-model="newItem.category"
              class="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option
                v-for="cat in availableCategories"
                :key="cat"
                :value="cat"
              >
                {{ cat }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-600">{{
              $t("admin.item_image")
            }}</label>
            <input
              type="file"
              @change="handleFileUpload"
              accept="image/*"
              class="w-full text-sm text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            <p
              v-if="uploadLoading"
              class="text-xs text-orange-500 font-bold animate-pulse"
            >
              {{ $t("admin.uploading_image") }}
            </p>
            <p v-if="imageUrl" class="text-xs text-green-500 font-bold">
              {{ $t("admin.upload_success") }}
            </p>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              @click="addItem"
              :disabled="loading || uploadLoading"
              class="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-100 disabled:opacity-50 transition-all active:scale-95"
            >
              {{ loading ? $t("admin.saving") : $t("admin.save") }}
            </button>
            <button
              @click="isModalOpen = false"
              class="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200"
            >
              {{ $t("admin.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 1. التعريفات الأساسية
definePageMeta({ layout: "admin", middleware: "auth" });
const client = useSupabaseClient();
const user = useSupabaseUser();
const { $toast } = useNuxtApp();

// 2. الحالة (State)
const isModalOpen = ref(false);
const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const editingId = ref(null);
const loading = ref(false);
const uploadLoading = ref(false);
const imageUrl = ref("");
const newItem = ref({ name: "", price: "", category: "", available: true });

// متغيرات الفلترة
const searchQuery = ref("");
const selectedCategory = ref("الكل");

// 3. جلب بيانات البروفايل
const { data: profile } = await useAsyncData(
  "admin-profile",
  async () => {
    if (!user.value) return null;
    const { data } = await client
      .from("profiles")
      .select("categories")
      .eq("user_id", user.value.sub || user.value.id)
      .single();
    return data;
  },
  { watch: [user] },
);

// أقسام الافتراضية
const availableCategories = computed(() => {
  return profile.value?.categories?.length
    ? profile.value.categories
    : ["Main", "Drinks", "Dessert"];
});

// تعيين القسم الافتراضي للفورم
watchEffect(() => {
  if (!newItem.value.category && availableCategories.value.length) {
    newItem.value.category = availableCategories.value[0];
  }
});

const dynamicCategories = computed(() => {
  return ["الكل", ...availableCategories.value];
});

// 4. جلب الوجبات
const {
  data: items,
  refresh,
  pending,
} = useAsyncData(
  "menu-items",
  async () => {
    if (!user.value) return [];
    try {
      const { data, error } = await client
        .from("menu_items")
        .select("*")
        .eq("user_id", user.value.sub || user.value.id)
        .order("created_at", { ascending: false });

      if (error) {
        // Fallback without order if it fails
        const { data: fallbackData } = await client
          .from("menu_items")
          .select("*")
          .eq("user_id", user.value.sub || user.value.id);
        return fallbackData || [];
      }
      return data || [];
    } catch (e) {
      return [];
    }
  },
  { lazy: true, server: false, watch: [user] },
);

// 5. منطق الفلترة اللحظي
const filteredItems = computed(() => {
  if (!items.value) return [];
  return items.value.filter((item) => {
    const name = item.name || "";
    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesCategory =
      selectedCategory.value === "الكل" ||
      item.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

// 6. دالة رفع الصورة
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  const uId = user.value?.sub || user.value?.id;
  if (!file || !uId) return $toast.error($t("admin.error_auth"));

  uploadLoading.value = true;
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${uId}/${fileName}`;
    const { error } = await client.storage
      .from("menu-images")
      .upload(filePath, file);
    if (error) throw error;
    const {
      data: { publicUrl },
    } = client.storage.from("menu-images").getPublicUrl(filePath);
    imageUrl.value = publicUrl;
    $toast.success($t("admin.upload_success"));
  } catch (err) {
    $toast.error("Upload failed: " + err.message);
  } finally {
    uploadLoading.value = false;
  }
};

// 7. دوال فتح المودال
const openAddModal = () => {
  editingId.value = null;
  newItem.value = {
    name: "",
    price: "",
    available: true,
  };
  imageUrl.value = "";
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  editingId.value = item.id;
  newItem.value = {
    name: item.name,
    price: item.price,
    category: item.category,
    available: item.available !== false, // Default to true if null/undefined
  };
  imageUrl.value = item.image || "";
  isModalOpen.value = true;
};

// 8. دالة حفظ الصنف (إما إضافة أو تعديل)
const addItem = async () => {
  const uId = user.value?.sub || user.value?.id;
  if (!uId) return $toast.error($t("admin.error_auth"));

  if (!newItem.value.name || !newItem.value.price || !newItem.value.category)
    return $toast.error($t("admin.error_fields"));

  loading.value = true;
  try {
    const dataToSave = {
      name: newItem.value.name,
      price: Number(newItem.value.price),
      category: newItem.value.category,
      user_id: uId,
      image: imageUrl.value || null,
      available: newItem.value.available,
    };

    let error;
    if (editingId.value) {
      // تعديل
      const { error: updateError } = await client
        .from("menu_items")
        .update(dataToSave)
        .eq("id", editingId.value);
      error = updateError;
    } else {
      // إضافة
      const { error: insertError } = await client
        .from("menu_items")
        .insert(dataToSave);
      error = insertError;
    }

    if (error) throw error;

    $toast.success($t("admin.save"));
    isModalOpen.value = false;
    await refresh();
  } catch (err) {
    console.error("Database Error:", err);
    $toast.error(err.message);
  } finally {
    loading.value = false;
  }
};

// 8. منطق الحذف
const initiateDelete = (id) => {
  itemToDelete.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!itemToDelete.value) return;

  showDeleteModal.value = false;
  const { error } = await client
    .from("menu_items")
    .delete()
    .eq("id", itemToDelete.value);

  if (!error) {
    $toast.success($t("admin.delete_success"));
    await refresh();
  } else {
    $toast.error($t("admin.delete_error"));
  }

  itemToDelete.value = null;
};
</script>
