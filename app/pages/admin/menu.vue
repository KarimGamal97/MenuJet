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
            class="text-orange-600 bg-orange-50 px-3 py-1 rounded-xl text-sm md:text-base ml-2"
          >
            {{ items?.length || 0 }}
          </span>
        </h2>
        <div class="flex gap-3 w-full sm:w-auto">
          <BaseButton
            variant="primary"
            icon="plus"
            @click="openAddModal"
            class="flex-1 sm:flex-none sm:w-auto"
          >
            {{ $t("admin.add_item") }}
          </BaseButton>
          <BaseButton
            v-if="profile?.slug"
            variant="outline"
            icon="journal"
            @click="navigateToMenu"
            class="flex-1 sm:flex-none sm:w-auto"
          >
            {{ $t("admin.view_menu") }}
          </BaseButton>
        </div>
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
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30"
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
        class="flex flex-row flex-wrap gap-4"
      >
        <MenuItemCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :is-admin="true"
          @edit="openEditModal"
          @delete="initiateDelete"
          class="w-full md:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
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
      max-width="max-w-md "
    >
      <div class="space-y-4 mt-2">
        <BaseInput v-model="newItem.name" :label="$t('admin.item_name')" />

        <!-- Size Selector + Price per size -->
        <div class="space-y-2">
          <label
            class="text-[10px] font-black text-gray-400 px-1 uppercase tracking-wider block"
          >
            {{ $t("admin.item_size") }}
          </label>
          <div class="flex gap-2">
            <button
              v-for="size in ['sm', 'md', 'lg']"
              :key="size"
              type="button"
              @click="newItem.activeSize = size"
              :class="[
                'flex-1 py-3 rounded-2xl font-bold text-sm transition-all border-2',
                newItem.activeSize === size
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-100'
                  : 'bg-gray-50 text-gray-400 border-transparent hover:border-orange-200 hover:text-orange-600',
              ]"
            >
              {{ size }}
            </button>
          </div>
          <!-- Price for active size -->
          <div class="pt-1">
            <BaseInput
              v-model="newItem.prices[newItem.activeSize]"
              type="number"
              :label="`سعر ${newItem.activeSize.toUpperCase()}`"
              oninput="
                if (this.value.length > 5) this.value = this.value.slice(0, 5);
              "
            />
          </div>
          <!-- Quick overview of all prices -->
          <div class="flex gap-2 pt-1">
            <div
              v-for="s in ['sm', 'md', 'lg']"
              :key="s"
              class="flex-1 bg-gray-50 rounded-xl p-2 text-center border border-gray-100"
            >
              <p class="text-[9px] font-black text-gray-400 uppercase mb-0.5">
                {{ s }}
              </p>
              <p
                class="text-xs font-black"
                :class="newItem.prices[s] ? 'text-gray-700' : 'text-gray-300'"
              >
                {{ newItem.prices[s] || "—" }}
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-2 relative">
          <!-- Custom Dropdown -->
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

        <!-- Short Description -->
        <div class="relative group !mt-6">
          <label
            class="absolute -top-2 right-3 bg-white px-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 group-focus-within:text-orange-500 transition-colors z-10 pointer-events-none flex gap-2"
          >
            <span>{{ $t("admin.item_description") }}</span>
            <span
              :class="
                newItem.description.length >= 30
                  ? 'text-red-400'
                  : 'text-gray-300'
              "
              >{{ newItem.description.length }}/30</span
            >
          </label>
          <textarea
            v-model="newItem.description"
            :placeholder="$t('admin.item_description_placeholder')"
            :maxlength="30"
            rows="2"
            class="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl outline-none focus:border-orange-500 transition-all text-sm font-bold text-gray-800 resize-none"
          />
        </div>

        <div class="space-y-2">
          <label
            class="text-[10px] font-black text-gray-400 px-1 uppercase tracking-wider block"
            >{{ $t("admin.item_image") }}</label
          >
          <div class="flex items-center gap-4">
            <div
              class="relative w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200 shrink-0"
            >
              <template v-if="imageUploading">
                <div
                  class="absolute inset-0 bg-white/50 flex items-center justify-center z-10"
                >
                  <div
                    class="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"
                  ></div>
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
                <span class="text-xs font-bold text-gray-500">{{
                  imageUploading
                    ? $t("admin.uploading_image")
                    : "انقر لاختيار صوره"
                }}</span>
              </div>
              <input
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                class="hidden"
                :disabled="imageUploading"
              />
            </label>
          </div>
        </div>

        <BaseToggle
          v-model="newItem.available"
          :label="$t('admin.available')"
        />
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

const { user, userId } = useAuthUser();
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
const newItem = ref({
  name: "",
  prices: { sm: "", md: "", lg: "" },
  activeSize: "sm",
  category: "",
  available: true,
  description: "",
});

const searchQuery = ref("");
const selectedCategory = ref("");

// Categories Logic
const availableCategories = computed(() => {
  return profile.value?.categories?.length
    ? profile.value.categories
    : ["Main", "Drinks", "Dessert"];
});

const dynamicCategories = computed(() => availableCategories.value);

// Initialize Data
onMounted(async () => {
  if (userId.value) {
    await Promise.all([
      fetchMenuItems(userId.value),
      fetchProfile(userId.value),
    ]);
  }
});

// Watch for category initialization
watchEffect(() => {
  if (!newItem.value.category && availableCategories.value.length) {
    newItem.value.category = availableCategories.value[0];
  }
  if (!selectedCategory.value && availableCategories.value.length) {
    selectedCategory.value = availableCategories.value[0];
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
      !selectedCategory.value ||
      selectedCategory.value === "الكل" ||
      item.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});

// Actions
const navigateToMenu = () => {
  if (profile.value?.slug) {
    window.open(`/menu/${profile.value.slug}`, "_blank");
  }
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file || !userId.value) return;

  const url = await uploadMenuImage(file, userId.value);
  if (url) imageUrl.value = url;
};

const openAddModal = () => {
  editingId.value = null;
  newItem.value = {
    name: "",
    prices: { sm: "", md: "", lg: "" },
    activeSize: "sm",
    category: availableCategories.value[0],
    available: true,
    description: "",
  };
  imageUrl.value = "";
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  editingId.value = item.id;
  newItem.value = {
    name: item.name,
    prices: item.prices || {
      sm: item.price || "",
      md: item.price || "",
      lg: item.price || "",
    },
    activeSize: "sm",
    category: item.category,
    available: item.available !== false,
    description: item.description || "",
  };
  imageUrl.value = item.image || "";
  isModalOpen.value = true;
};

const handleSaveItem = async () => {
  if (!userId.value) return;

  const { name, prices, category } = newItem.value;
  const hasPrices = prices.sm || prices.md || prices.lg;
  if (!name || !hasPrices || !category) {
    return $toast.error($t("admin.error_fields"));
  }

  // Convert prices to numbers, keep only filled ones
  const cleanPrices = {};
  for (const s of ["sm", "md", "lg"]) {
    if (prices[s]) cleanPrices[s] = Number(prices[s]);
  }

  // Use smallest price as the display price (for card)
  const displayPrice = Math.min(...Object.values(cleanPrices));

  const itemData = {
    name: newItem.value.name,
    category: newItem.value.category,
    available: newItem.value.available,
    description: newItem.value.description,
    image: imageUrl.value || null,
    prices: cleanPrices,
    price: displayPrice,
  };

  let result;
  if (editingId.value) {
    result = await updateMenuItem(editingId.value, itemData);
  } else {
    result = await addItemToMenu(itemData, userId.value);
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
