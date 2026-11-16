<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <div
        class="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        @click="emit('close')"
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
            @click="emit('close')"
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
              {{ $t("admin.users_page.full_name") }}
            </label>
            <BaseInput
              v-model="newUser.full_name"
              type="text"
              :placeholder="$t('admin.users_page.full_name_placeholder')"
              class="!border !border-gray-200 !py-3 !px-4 !bg-white !rounded-2xl shadow-none"
            />
          </div>

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
                <BaseIcon :name="showPassword ? 'eye-off' : 'eye'" class="w-4 h-4" />
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
            @click="emit('close')"
            class="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
          >
            {{ $t("common.cancel") }}
          </button>
          <button
            @click="emit('submit')"
            :disabled="creating"
            class="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-sm hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/15 transition-all disabled:opacity-50 cursor-pointer"
          >
            {{ creating ? $t("admin.users_page.creating_account") : $t("admin.users_page.create_account") }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  creating: boolean;
  newUser: {
    email: string;
    password: string;
    full_name: string;
    role: string;
  };
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submit"): void;
}>();

const showPassword = ref(false);

watch(
  () => props.show,
  (val) => {
    if (!val) showPassword.value = false;
  },
);

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

  props.newUser.password = pwd;
  showPassword.value = true;
};
</script>
