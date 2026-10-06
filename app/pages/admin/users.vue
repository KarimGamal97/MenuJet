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
                      class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center font-black text-orange-600 shadow-xs border border-orange-100 shrink-0"
                    >
                      {{ (user.email || user.full_name || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-black text-gray-900 text-sm">
                        {{ user.full_name || user.email?.split('@')[0] || $t("admin.users_page.default_user") }}
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
                      v-if="user.role !== 'super_admin'"
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
      <Teleport to="body">
        <div
          v-if="showAddModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <div
            class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            @click="closeModal"
          />
          <div
            class="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full relative z-[110] shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
            :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-black text-gray-900">
                {{ $t("admin.users_page.add_user_title") }}
              </h2>
              <button
                @click="closeModal"
                class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>
            <p class="text-gray-400 text-xs font-medium mb-6">
              {{ $t("admin.users_page.add_user_msg") }}
            </p>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">
                  {{ $t("admin.users_page.email") }}
                </label>
                <BaseInput
                  v-model="newUser.email"
                  type="email"
                  placeholder="admin@example.com"
                  class="!border !border-gray-200 !py-3 !px-4 !bg-white !rounded-2xl shadow-none"
                />
              </div>

              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="block text-xs font-bold text-gray-700">
                    {{ $t("admin.users_page.password") }}
                  </label>
                  <button
                    type="button"
                    @click="generateStrongPassword"
                    class="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                  >
                    {{ $t("admin.users_page.generate_password") }}
                  </button>
                </div>
                <div class="relative">
                  <BaseInput
                    v-model="newUser.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="MenuJet@2025"
                    class="!border !border-gray-200 !py-3 !pr-4 !pl-10 !bg-white !rounded-2xl shadow-none"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
                  >
                    <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  </button>
                </div>
                <p class="text-[11px] text-gray-400 mt-1.5 font-medium leading-relaxed">
                  {{ $t("admin.users_page.password_hint") }}
                </p>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">
                  {{ $t("admin.users_page.role_type") }}
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    @click="newUser.role = 'user'"
                    :class="newUser.role === 'user' ? 'border-orange-500 bg-orange-50 text-orange-700 font-black shadow-xs' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'"
                    class="p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{{ $t("admin.users_page.role_user") }}</span>
                  </button>
                  <button
                    type="button"
                    @click="newUser.role = 'admin'"
                    :class="newUser.role === 'admin' ? 'border-orange-500 bg-orange-50 text-orange-700 font-black shadow-xs' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'"
                    class="p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{{ $t("admin.users_page.role_admin") }}</span>
                  </button>
                </div>
              </div>

              <div class="text-xs text-gray-500 bg-orange-50/70 border border-orange-100 rounded-2xl p-3 font-medium flex items-center gap-2">
                <span>{{ $t("admin.users_page.auto_link_msg") }}</span>
              </div>
            </div>

            <div class="flex gap-3 mt-8">
              <button
                @click="closeModal"
                class="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {{ $t("admin.users_page_cancel") }}
              </button>
              <button
                @click="createUser"
                :disabled="creating"
                class="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/15 transition-all disabled:opacity-50 cursor-pointer"
              >
                {{ creating ? $t("admin.users_page.creating_account") : $t("admin.users_page.create_account") }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Delete User Modal -->
      <Teleport to="body">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <div
            class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            @click="closeDeleteModal"
          />
          <div
            class="bg-white rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full relative z-[110] shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
            :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
          >
            <div
              class="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-xl mb-4 font-black"
            >
              <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 class="text-xl font-black text-gray-900 mb-2">
              {{ $t("admin.users_page.delete_user_title") }}
            </h2>
            <p class="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
              {{ $t("admin.users_page.delete_user_confirm_pt1") }}
              <span class="font-bold text-gray-900">{{ userToDelete?.email || userToDelete?.full_name || $t("admin.users_page.default_user") }}</span>
              {{ $t("admin.users_page.delete_user_confirm_pt2") }}
            </p>

            <div class="flex gap-3">
              <button
                @click="closeDeleteModal"
                class="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {{ $t("admin.users_page_cancel") }}
              </button>
              <button
                @click="deleteUser"
                :disabled="deleting"
                class="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {{ deleting ? $t("admin.users_page.deleting") : $t("admin.users_page.delete_account") }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "superadmin",
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
const showPassword = ref(false);
const creating = ref(false);
const newUser = ref({ email: "", password: "", business_name_ar: "", role: "user" });

// Delete state
const showDeleteModal = ref(false);
const deleting = ref(false);
const userToDelete = ref<any>(null);

const generateStrongPassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%&*";
  
  let pwd = "Jet";
  pwd += uppers.charAt(Math.floor(Math.random() * uppers.length));
  pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  pwd += numbers.charAt(Math.floor(Math.random() * numbers.length));
  pwd += numbers.charAt(Math.floor(Math.random() * numbers.length));
  pwd += symbols.charAt(Math.floor(Math.random() * symbols.length));
  pwd += "2025";
  
  newUser.value.password = pwd;
  showPassword.value = true;
};

const closeModal = () => {
  showAddModal.value = false;
  showPassword.value = false;
  newUser.value = { email: "", password: "", business_name_ar: "", role: "user" };
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

onMounted(() => {
  if (can("allow_users")) {
    fetchUsers();
  }
});
</script>