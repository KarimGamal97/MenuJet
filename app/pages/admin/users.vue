<template>
  <div class="space-y-6" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Smart Lock Screen for Non-Pro Plan Users -->
    <div
      v-if="!can('allow_users')"
      class="bg-white p-8 md:p-14 rounded-[2.5rem] border border-purple-100 shadow-sm text-center flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div
        class="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-500 text-white rounded-3xl flex items-center justify-center text-3xl shadow-lg shadow-purple-500/25 mb-4"
      >
        👥
      </div>
      <span
        class="inline-block bg-purple-100 text-purple-700 text-xs font-black px-4 py-1.5 rounded-full mb-3"
      >
        {{ $t("plans.exclusive_pro_badge") }}
      </span>
      <h2 class="text-2xl md:text-3xl font-black text-slate-900 mb-2">
        {{ $t("plans.users_lock_title") }}
      </h2>
      <p
        class="text-slate-500 text-sm md:text-base max-w-lg mb-8 leading-relaxed font-medium"
      >
        {{ $t("plans.users_lock_desc") }}
      </p>

      <button
        type="button"
        @click="showUpgradeModal = true"
        class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-purple-500/25 transition-transform active:scale-95 text-base cursor-pointer"
      >
         {{ $t("plans.users_lock_btn") }}
      </button>

      <!-- Upgrade Modal -->
      <UpgradeModal
        :isOpen="showUpgradeModal"
        :title="$t('plans.users_modal_title')"
        :badgeText="$t('plans.pro_badge_short')"
        :message="$t('plans.users_modal_msg')"
        @close="showUpgradeModal = false"
      />
    </div>

    <!-- Active Management Content for Pro Plan Users -->
    <div v-else class="space-y-6">
      <!-- Modern Page Header Card -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 md:p-6 rounded-[2rem] shadow-xs border border-gray-100 gap-4"
      >
        <div class="flex items-center gap-3.5">
          <div
            class="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs"
          >
            👥
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl md:text-2xl font-black text-gray-900">
                {{ $t("admin.users_page.users_title") }}
              </h1>
              <span
                class="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-xl font-black"
              >
                {{ $t("admin.users_page.total") }} {{ users.length }}
              </span>
            </div>
            <p class="text-gray-400 text-xs md:text-sm font-medium mt-0.5">
              {{ $t("admin.users_page.users_subtitle") }}
            </p>
          </div>
        </div>

        <button
          @click="showAddModal = true"
          class="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-3 rounded-2xl font-black text-sm shadow-md shadow-orange-500/15 transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span class="text-base leading-none">＋</span>
          <span>{{ $t("admin.users_page.add_user") }}</span>
        </button>
      </div>

      <!-- Users Table Card -->
      <div class="bg-white p-6 rounded-[2rem] shadow-xs border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-start border-separate border-spacing-y-2">
            <thead>
              <tr class="text-gray-400 text-xs font-black uppercase">
                <th class="pb-3 ps-4 font-bold">{{ $t("admin.users_page.user") }}</th>
                <th class="pb-3 text-center font-bold">{{ $t("admin.users_page.current_role") }}</th>
                <th class="pb-3 pe-4 text-end font-bold">{{ $t("admin.users_page.actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in users"
                :key="user.id"
                class="bg-gray-50/70 hover:bg-gray-50 transition-colors rounded-2xl group"
              >
                <td class="py-4 ps-4 rounded-s-2xl">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs"
                      :class="canManageRestaurantRole(user.role) ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-orange-50 text-orange-600 border-orange-100'"
                    >
                      <BaseIcon name="user" class="w-5 h-5" />
                    </div>
                    <div>
                      <div class="font-black text-gray-900 text-sm">
                        {{ getUserDisplayName(user) }}
                      </div>
                      <div class="text-xs text-gray-400 font-medium dir-ltr text-start">
                        {{ user.email || '—' }}
                      </div>
                    </div>
                  </div>
                </td>

                <td class="py-4 text-center">
                  <span
                    :class="getRoleClass(user.role)"
                    class="px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider inline-block"
                  >
                    {{ formatRole(user.role) }}
                  </span>
                </td>

                <td class="py-4 pe-4 text-end rounded-e-2xl">
                  <div class="flex justify-end gap-2">
                    <button
                      v-if="user.owner_id && !isPlatformOwnerRole(user.role)"
                      @click="confirmDeleteUser(user)"
                      class="bg-white text-red-600 border border-red-100 hover:bg-red-50 hover:border-red-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      {{ $t("admin.users_page.delete") }}
                    </button>
                    <span v-else class="text-xs text-gray-400 font-bold px-2 py-1">
                      {{ $t("admin.users_page.primary_admin") }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="users.length === 0" class="py-16 text-center">
          <div class="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">
            👥
          </div>
          <p class="text-gray-500 font-bold text-sm">{{ $t("admin.users_page.no_users") }}</p>
        </div>
      </div>

      <!-- Add User Modal -->
      <AdminUsersUserFormModal
        :show="showAddModal"
        :creating="creating"
        :new-user="newUser"
        @close="closeModal"
        @submit="createUser"
      />

      <!-- Delete User Modal -->
      <AdminUsersDeleteUserModal
        :show="showDeleteModal"
        :deleting="deleting"
        :display-name="getUserDisplayName(userToDelete)"
        @close="closeDeleteModal"
        @confirm="deleteUser"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "restaurant-admin",
  layout: "admin",
});

const { can } = usePlan();
const showUpgradeModal = ref(false);

const client = useSupabaseClient();
const { $toast } = useNuxtApp();
const { t } = useI18n();
const users = ref<any[]>([]);

// Modal state
const showAddModal = ref(false);
const creating = ref(false);
const newUser = ref({ email: "", password: "", full_name: "", role: "user" });

// Delete state
const showDeleteModal = ref(false);
const deleting = ref(false);
const userToDelete = ref<any>(null);

const closeModal = () => {
  showAddModal.value = false;
  newUser.value = { email: "", password: "", full_name: "", role: "user" };
};

const confirmDeleteUser = (user: any) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
};

const validatePasswordComplexity = (password: string): boolean => {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasLower && hasUpper && hasNumber && hasSpecial;
};

// Create user via secure server API
const createUser = async () => {
  if (!newUser.value.email || !newUser.value.password) {
    $toast.error(t("admin.users_page.email_pass_req"));
    return;
  }

  if (!validatePasswordComplexity(newUser.value.password)) {
    $toast.error(t("admin.users_page.password_invalid"));
    return;
  }

  creating.value = true;
  try {
    await $fetch("/api/create-user", {
      method: "POST",
      body: newUser.value,
    });
    $toast.success(t("admin.users_page.create_success"));
    closeModal();
    await fetchUsers();
  } catch (err: any) {
    const code = err?.data?.data?.code || "";
    const rawMsg = err?.data?.message || "";
    if (
      code === "EMAIL_ALREADY_EXISTS" ||
      rawMsg.includes("already registered") ||
      rawMsg.includes("already been registered") ||
      rawMsg.includes("مسجل بالفعل")
    ) {
      $toast.error(t("admin.users_page.email_already_exists"));
    } else if (
      code === "PASSWORD_WEAK" ||
      rawMsg.toLowerCase().includes("password") ||
      rawMsg.includes("كلمة المرور")
    ) {
      $toast.error(t("admin.users_page.password_invalid"));
    } else {
      $toast.error(rawMsg || t("admin.users_page.create_error"));
    }
  } finally {
    creating.value = false;
  }
};

// Fetch users via secure API
const fetchUsers = async () => {
  try {
    const data = await $fetch<any[]>("/api/get-users");
    users.value = data || [];
  } catch (err: any) {
    console.error("Fetch users error:", err);
    $toast.error(t("admin.users_page.fetch_users_error"));
  }
};

// Delete user via secure API
const deleteUser = async () => {
  if (!userToDelete.value) return;
  deleting.value = true;
  try {
    await $fetch("/api/delete-user", {
      method: "DELETE",
      body: { profileId: userToDelete.value.id },
    });
    $toast.success(t("admin.users_page.delete_success"));
    closeDeleteModal();
    await fetchUsers();
  } catch (err: any) {
    console.error("Delete error:", err);
    $toast.error(err?.data?.message || t("admin.users_page.delete_error"));
  } finally {
    deleting.value = false;
  }
};

const formatRole = (role: string) => {
  if (role === "super_admin" || role === "admin") {
    return t("admin.users_page.role_admin");
  }
  return t("admin.users_page.role_user");
};

const getRoleClass = (role: string) => {
  if (role === "super_admin" || role === "admin") {
    return "bg-purple-100 text-purple-700 font-black";
  }
  return "bg-blue-50 text-blue-700 font-bold";
};

const getUserDisplayName = (user: any) => {
  if (!user) return "";
  if (canManageRestaurantRole(user.role) && !user.owner_id) {
    return (
      user.business_name ||
      user.business_name_ar ||
      user.full_name ||
      user.email?.split("@")[0] ||
      t("admin.users_page.default_user")
    );
  }
  if (
    user.full_name &&
    user.full_name !== "مطعمي" &&
    user.full_name !== "My Restaurant"
  ) {
    return user.full_name;
  }
  return user.email?.split("@")[0] || t("admin.users_page.default_user");
};

onMounted(() => {
  if (can("allow_users")) {
    fetchUsers();
  }
});
</script>