<template>
  <div class="space-y-6" dir="rtl">
    <!-- Skeleton -->
    <template v-if="itemsPending">
      <AdminSkeleton />
    </template>

    <!-- Dashboard Content  -->
    <template v-else>
      <!-- Delete Confirmation Modal -->
      <BaseModal
        :isOpen="showDeleteModal"
        @close="showDeleteModal = false"
        :title="$t('admin.delete_confirm_title')"
        :subtitle="$t('admin.delete_confirm_msg')"
        max-width="max-w-xs"
      >
        <div class="flex justify-center mb-4">
          <div
            class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600"
          >
            <BaseIcon name="trash" class="w-8 h-8" />
          </div>
        </div>

        <template #footer>
          <div class="flex gap-3">
            <BaseButton
              variant="secondary"
              fullWidth
              @click="showDeleteModal = false"
            >
              {{ $t("admin.cancel") }}
            </BaseButton>
            <BaseButton variant="danger" fullWidth @click="confirmDelete">
              {{ $t("admin.delete_confirm_btn") }}
            </BaseButton>
          </div>
        </template>
      </BaseModal>

      <div
        class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 md:p-6 rounded-3xl shadow-sm gap-4"
      >
        <h2 class="text-xl md:text-2xl font-bold text-gray-800">
          {{ $t("admin.menu_title") }}
          <span
            class="text-orange-600 bg-orange-50 px-3 py-1 rounded-xl text-sm md:text-base mr-2"
          >
            {{ items?.length || 0 }}
          </span>
        </h2>
        <BaseButton
          variant="primary"
          icon="plus"
          @click="openAddModal"
          fullWidth
          class="sm:w-auto"
        >
          {{ $t("admin.add_item") }}
        </BaseButton>
      </div>

      <!-- Filter Section -->
      <div class="flex flex-col md:flex-row gap-4">
        <div class="relative md:w-1/4">
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

        <div
          class="flex-1 flex gap-2 overflow-x-auto no-scrollbar pb-1 px-1 min-w-0"
        >
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

      <div
        v-if="filteredItems.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <MenuItemCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :is-admin="true"
          @edit="openEditModal"
          @delete="initiateDelete"
        />
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
    <BaseModal
      :isOpen="isModalOpen"
      @close="isModalOpen = false"
      :title="
        $t(editingId ? 'admin.edit_modal_title' : 'admin.add_modal_title')
      "
      max-width="max-w-md"
    >
      <div class="space-y-4">
        <BaseInput
          v-model="newItem.name"
          :label="$t('admin.item_name')"
          :placeholder="$t('admin.item_name')"
        />

        <BaseInput
          v-model="newItem.price"
          type="number"
          :label="$t('admin.item_price')"
          :placeholder="$t('admin.item_price')"
          oninput="
            if (this.value.length > 5) this.value = this.value.slice(0, 5);
          "
        />

        <BaseToggle
          v-model="newItem.available"
          :label="$t('admin.available') || 'متوفر للطلب'"
        />

        <div class="space-y-2 relative">
          <!-- Custom Dropdown -->
          <div class="relative">
            <button
              type="button"
              @click="isCategoryDropdownOpen = !isCategoryDropdownOpen"
              class="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none flex items-center justify-between font-bold text-gray-800 shadow-sm transition-all focus:border-orange-500 focus:bg-white text-sm"
            >
              <span>{{ newItem.category || $t("admin.choose_category") }}</span>
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
                  newItem.category = cat;
                  isCategoryDropdownOpen = false;
                "
                :class="[
                  'w-full text-right px-4 py-3 rounded-xl font-bold transition-colors text-sm',
                  newItem.category === cat
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

        <div class="space-y-2">
          <label
            class="text-[10px] font-black text-gray-400 px-1 uppercase tracking-wider block"
            >{{ $t("admin.item_image") }}</label
          >
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200 shrink-0"
            >
              <img
                v-if="imageUrl"
                :src="imageUrl"
                class="w-full h-full object-cover"
              />
              <BaseIcon v-else name="photo" class="w-6 h-6 text-gray-300" />
            </div>
            <label class="flex-1 cursor-pointer">
              <div
                class="bg-white border-2 border-dashed border-gray-200 p-4 rounded-2xl text-center hover:border-orange-500 transition-colors"
              >
                <span class="text-xs font-bold text-gray-500">{{
                  uploadLoading
                    ? $t("admin.uploading_image")
                    : "انقر لاختيار صوره"
                }}</span>
              </div>
              <input
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                class="hidden"
                :disabled="uploadLoading"
              />
            </label>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <BaseButton
            variant="secondary"
            fullWidth
            @click="isModalOpen = false"
          >
            {{ $t("admin.cancel") }}
          </BaseButton>
          <BaseButton
            :loading="actionLoading"
            :disabled="imageUploading"
            fullWidth
            @click="handleSaveItem"
          >
            {{ $t("admin.save") }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
definePageMeta({ layout: "admin", middleware: "auth" });

const user = useSupabaseUser();
const { $toast } = useNuxtApp();

// Composables
const {
  items,
  pending: itemsPending,
  loading: actionLoading,
  uploading: imageUploading,
  fetchMenuItems,
  addItemToMenu,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuImage,
} = useMenu();

const { profile, fetchProfile } = useSettings();

// UI State
const isModalOpen = ref(false);
const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const editingId = ref(null);
const isCategoryDropdownOpen = ref(false);
const imageUrl = ref("");
const newItem = ref({ name: "", price: "", category: "", available: true });

const searchQuery = ref("");
const selectedCategory = ref("الكل");

// Categories Logic
const availableCategories = computed(() => {
  return profile.value?.categories?.length
    ? profile.value.categories
    : ["Main", "Drinks", "Dessert"];
});

const dynamicCategories = computed(() => [
  "الكل",
  ...availableCategories.value,
]);

// Initialize Data
onMounted(async () => {
  const userId = user.value?.id || user.value?.sub;
  if (userId) {
    await Promise.all([fetchMenuItems(userId), fetchProfile(userId)]);
  }
});

// Watch for category initialization
watchEffect(() => {
  if (!newItem.value.category && availableCategories.value.length) {
    newItem.value.category = availableCategories.value[0];
  }
});

// Computed filtering
const filteredItems = computed(() => {
  if (!items.value) return [];
  return items.value.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesCategory =
      selectedCategory.value === "الكل" ||
      item.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

// Actions
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  const userId = user.value?.id || user.value?.sub;
  if (!file || !userId) return;

  const url = await uploadMenuImage(file, userId);
  if (url) imageUrl.value = url;
};

const openAddModal = () => {
  editingId.value = null;
  newItem.value = {
    name: "",
    price: "",
    category: availableCategories.value[0],
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

const handleSaveItem = async () => {
  const userId = user.value?.id || user.value?.sub;
  if (!userId) return;

  if (!newItem.value.name || !newItem.value.price || !newItem.value.category) {
    return $toast.error($t("admin.error_fields"));
  }

  const itemData = {
    ...newItem.value,
    price: Number(newItem.value.price),
    image: imageUrl.value || null,
  };

  let result;
  if (editingId.value) {
    result = await updateMenuItem(editingId.value, itemData);
  } else {
    result = await addItemToMenu(itemData, userId);
  }

  if (result) {
    isModalOpen.value = false;
  }
};

const initiateDelete = (id) => {
  itemToDelete.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  const success = await deleteMenuItem(itemToDelete.value);
  if (success) {
    showDeleteModal.value = false;
    itemToDelete.value = null;
  }
};
</script>
