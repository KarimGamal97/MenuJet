<template>
  <div
    class="min-h-screen flex flex-col items-center bg-gray-50 px-6 py-6"
    :class="locale === 'ar' ? 'text-right' : 'text-left'"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="max-w-md w-full my-auto">
      <div class="text-center mb-5">
        <NuxtLink to="/" class="inline-block mb-2">
          <img
            src="~/assets/navbar-logo.svg"
            alt="MenuJet"
            class="h-20 sm:h-24 w-auto object-contain mix-blend-multiply mx-auto"
          />
        </NuxtLink>
        <h2 class="text-2xl sm:text-3xl font-black text-gray-900 mb-1.5">
          {{ isSignUp ? $t("login.signup_title") : $t("login.title") }}
        </h2>
        <p class="text-gray-500 text-sm">
          {{ isSignUp ? $t("login.signup_subtitle") : $t("login.subtitle") + " MenuJet" }}
        </p>
      </div>

      <!-- Mode Switcher Tabs -->
      <div class="flex bg-gray-200/70 p-1.5 rounded-2xl mb-4 shadow-inner">
        <button
          type="button"
          @click="isSignUp = false"
          :class="[
            'flex-1 py-2.5 text-sm font-black rounded-xl transition-all duration-200 cursor-pointer text-center',
            !isSignUp
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          ]"
        >
          {{ $t("login.tab_signin") }}
        </button>
        <button
          type="button"
          @click="isSignUp = true"
          :class="[
            'flex-1 py-2.5 text-sm font-black rounded-xl transition-all duration-200 cursor-pointer text-center',
            isSignUp
              ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
              : 'text-gray-500 hover:text-gray-800'
          ]"
        >
          {{ $t("login.tab_signup") }}
        </button>
      </div>

      <!-- Sign Up Stepper -->
      <AuthSignupStepper
        v-if="isSignUp"
        :loading="loading"
        @submit="handleSignupSubmit"
      />

      <!-- Sign In Form -->
      <form v-else @submit.prevent="onSubmit" class="space-y-4">
        <BaseInput
          v-model="identifier"
          type="text"
          :placeholder="$t('login.identifier_placeholder')"
          :error="errors.identifier"
          :class="['bg-white', locale === 'ar' ? 'text-right' : 'text-left']"
        />

        <BaseInput
          v-model="password"
          type="password"
          :placeholder="$t('login.password_placeholder')"
          :error="errors.password"
          class="bg-white"
        />

        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          :loading="loading"
        >
          <template v-if="loading">
            {{ $t("login.loading") }}
          </template>
          <template v-else>
            {{ $t("login.submit") }}
          </template>
        </BaseButton>
      </form>

      <!-- Toggle Help Text -->
      <div class="mt-6 text-center">
        <button
          type="button"
          @click="isSignUp = !isSignUp"
          class="text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors cursor-pointer"
        >
          {{
            isSignUp
              ? $t("login.have_account_toggle")
              : $t("login.no_account_toggle")
          }}
        </button>
      </div>

    </div>

    <footer class="pt-6 text-center">
      <p class="text-[10px] text-gray-400 tracking-widest font-bold">
        Powered by
        <NuxtLink
          to="/"
          class="text-orange-600 hover:text-orange-400 transition-colors"
        >
          MenuJet
        </NuxtLink>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { useForm, useField } from "vee-validate";
import { defineRule } from "vee-validate";

const { t, locale } = useI18n();
const route = useRoute();
const isSignUp = ref(route.query.mode === "signup");

defineRule("required", (val) => !!val || t("login.error_required"));
defineRule("identifier", (val) => {
  const value = String(val || "").trim();
  if (!value) return t("login.error_required");
  if (value.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || t("login.error_identifier");
  }
  const cleanPhone = value.replace(/[\s()-]/g, "");
  return /^\+?\d{10,15}$/.test(cleanPhone) || t("login.error_identifier");
});

const { $toast } = useNuxtApp();
const client = useSupabaseClient();
const loading = ref(false);
const user = useSupabaseUser();

let isRedirecting = false;
const redirectAfterLogin = async (uid) => {
  if (isRedirecting || !uid) return;
  isRedirecting = true;
  try {
    const authStore = useAuthStore();
    if (!authStore.profile || authStore.profile.user_id !== uid) {
      await authStore.fetchUserProfile(uid);
    }
    await navigateTo("/admin");
  } catch (err) {
    isRedirecting = false;
    throw err;
  }
};

// Auto redirect if already logged in
watch(
  user,
  (val) => {
    if (val && route.path.includes("/login")) {
      redirectAfterLogin(val.id || val.sub);
    }
  },
  { immediate: true }
);

let authSubscription = null;

onMounted(async () => {
  const { data } = client.auth.onAuthStateChange((event, session) => {
    if (
      route.path.includes("/login") &&
      session?.user &&
      (event === "SIGNED_IN" || event === "INITIAL_SESSION")
    ) {
      redirectAfterLogin(session.user.id);
    }
  });
  authSubscription = data?.subscription;

  const { data: sessionData } = await client.auth.getSession();
  if (sessionData?.session?.user && route.path.includes("/login")) {
    redirectAfterLogin(sessionData.session.user.id);
  }
});

onUnmounted(() => {
  authSubscription?.unsubscribe();
});

const { handleSubmit, errors, resetForm } = useForm();
const { value: identifier } = useField("identifier", "required|identifier");
const { value: password } = useField("password", "required");

watch(isSignUp, () => {
  resetForm();
});

const signInAndRedirect = async (loginIdentifier, rawPassword) => {
  const sessionRes = await $fetch("/api/auth/login", {
    method: "POST",
    body: {
      identifier: loginIdentifier,
      password: rawPassword,
    },
  });

  await client.auth.setSession({
    access_token: sessionRes.access_token,
    refresh_token: sessionRes.refresh_token,
  });

  const supaUser = useSupabaseUser();
  if (!supaUser.value) {
    await new Promise((resolve) => {
      const stop = watch(supaUser, (val) => {
        if (val) {
          stop();
          resolve();
        }
      });
      setTimeout(resolve, 2500);
    });
  }

  await redirectAfterLogin(
    sessionRes.user_id || supaUser.value?.id || supaUser.value?.sub,
  );
};

const handleSignupSubmit = async (payload) => {
  loading.value = true;
  try {
    const signupRes = await $fetch("/api/auth/signup", {
      method: "POST",
      body: payload,
    });

    $toast.success(t("login.signup_success"));
    await signInAndRedirect(
      signupRes.loginIdentifier || payload.email || payload.whatsappNumber,
      payload.password,
    );
  } catch (err) {
    const msg =
      err?.data?.message ||
      err?.statusMessage ||
      err?.message ||
      t("login.error_signup_generic");
    $toast.error(msg);
  } finally {
    loading.value = false;
  }
};

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;

  try {
    await signInAndRedirect(values.identifier, values.password);
    $toast.success(t("login.success"));
  } catch (err) {
    $toast.error(t("login.error_credentials"));
  } finally {
    loading.value = false;
  }
});
</script>

