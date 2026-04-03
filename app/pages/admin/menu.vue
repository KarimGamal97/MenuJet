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
            <div class="flex justify-center mb-6">
              <div
                class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600"
              >
                <BaseIcon name="trash" class="w-8 h-8" />
              </div>
            </div>
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
          <BaseIcon name="plus" class="w-5 h-5" />
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
          <BaseIcon
            name="search"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30"
          />
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
              class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-200"
            >
              <BaseIcon name="photo" class="w-8 h-8" />
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
                <BaseIcon name="edit" class="w-4 h-4" />
              </button>
              <button
                @click="initiateDelete(item.id)"
                class="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.177H8.084a2.25 2.25 0 0 1-2.244-2.177L6.18 6.096m14.586 0c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.177H8.084a2.25 2.25 0 0 1-2.244-2.177L6.18 6.096m14.586 0c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.177H8.084a2.25 2.25 0 0 1-2.244-2.177L6.18 6.096"
                  />
                </svg>
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
            class="w-full p-4 bg-white border-2 border-orange-500/10 rounded-[1.5rem] outline-none focus:border-orange-500 transition-all font-bold text-gray-800 shadow-sm"
          />
          <input
            v-model="newItem.price"
            type="number"
            :placeholder="$t('admin.item_price')"
            class="w-full p-4 bg-white border-2 border-orange-500/10 rounded-[1.5rem] outline-none focus:border-orange-500 transition-all font-bold text-gray-800 shadow-sm"
          />

          <!-- Availability Toggle -->
          <div class="flex items-center justify-between p-4 rounded-2xl">
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

          <div class="space-y-2 relative">
            <label
              class="text-[10px] font-black text-gray-400 px-1 uppercase tracking-wider"
              >{{ $t("admin.choose_category") }}</label
            >

            <!-- Custom Dropdown -->
            <div class="relative">
              <button
                type="button"
                @click="isCategoryDropdownOpen = !isCategoryDropdownOpen"
                class="w-full p-4 bg-white border-2 border-orange-500/10 rounded-[1.5rem] outline-none flex items-center justify-between font-bold text-gray-800 shadow-sm transition-all focus:border-orange-500"
              >
                <span>{{
                  newItem.category || $t("admin.choose_category")
                }}</span>
                <BaseIcon
                  name="chevron-down"
                  class="w-4 h-4 text-orange-500 transition-transform duration-200"
                  :class="{ 'rotate-180': isCategoryDropdownOpen }"
                />
              </button>

              <div
                v-if="isCategoryDropdownOpen"
                class="absolute top-full mt-2 left-0 right-0 bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in slide-in-from-top-2 duration-200"
              >
                <div class="p-2 space-y-1">
                  <button
                    v-for="cat in availableCategories"
                    :key="cat"
                    type="button"
                    @click="
                      newItem.category = cat;
                      isCategoryDropdownOpen = false;
                    "
                    :class="[
                      'w-full text-right px-4 py-3 rounded-xl font-bold transition-colors',
                      newItem.category === cat
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-100'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600',
                    ]"
                  >
                    {{ cat }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Overlay for click outside (simple version) -->
            <div
              v-if="isCategoryDropdownOpen"
              @click="isCategoryDropdownOpen = false"
              class="fixed inset-0 z-[55]"
            ></div>
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
definePageMeta({ layout: "admin", middleware: "auth" });
const client = useSupabaseClient();
const user = useSupabaseUser();
const { $toast } = useNuxtApp();

const isModalOpen = ref(false);
const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const editingId = ref(null);
const loading = ref(false);
const uploadLoading = ref(false);
const isCategoryDropdownOpen = ref(false);
const imageUrl = ref("");
const newItem = ref({ name: "", price: "", category: "", available: true });

const searchQuery = ref("");
const selectedCategory = ref("الكل");

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

const availableCategories = computed(() => {
  return profile.value?.categories?.length
    ? profile.value.categories
    : ["Main", "Drinks", "Dessert"];
});

watchEffect(() => {
  if (!newItem.value.category && availableCategories.value.length) {
    newItem.value.category = availableCategories.value[0];
  }
});

const dynamicCategories = computed(() => {
  return ["الكل", ...availableCategories.value];
});

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
    available: item.available !== false,
  };
  imageUrl.value = item.image || "";
  isModalOpen.value = true;
};

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
      const { error: updateError } = await client
        .from("menu_items")
        .update(dataToSave)
        .eq("id", editingId.value);
      error = updateError;
    } else {
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
