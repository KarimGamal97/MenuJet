<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-6"
    :class="locale === 'ar' ? 'text-right' : 'text-left'"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="max-w-md w-full">
      <div class="text-center mb-5">
        <NuxtLink to="/" class="inline-block mb-2">
          <img
            src="~/assets/navbar-logo.png"
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

      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Business Name Field (Sign Up Only) -->
        <div v-if="isSignUp">
          <BaseInput
            v-model="businessName"
            type="text"
            :placeholder="$t('login.business_name_placeholder')"
            :error="errors.businessName"
            class="bg-white"
          />
        </div>

        <BaseInput
          v-model="email"
          type="email"
          :placeholder="$t('login.email_placeholder')"
          :error="errors.email"
          class="bg-white"
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
            {{ isSignUp ? $t("login.signup_submit") : $t("login.submit") }}
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

      <div class="mt-6 text-center">
        <p class="text-[10px] text-gray-300 uppercase tracking-widest font-bold">
          Created by
          <a
            href="https://kariim-portfolio.vercel.app/"
            target="_blank"
            class="text-orange-600 hover:text-orange-400 transition-colors"
          >
            Kariim
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useForm, useField } from "vee-validate";
import { defineRule } from "vee-validate";

const { t, locale } = useI18n();
const route = useRoute();
const isSignUp = ref(route.query.mode === "signup");

defineRule("required", (val) => !!val || t("login.error_required"));
defineRule(
  "email",
  (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || t("login.error_email"),
);

const { $toast } = useNuxtApp();
const client = useSupabaseClient();
const loading = ref(false);
const user = useSupabaseUser();

const redirectAfterLogin = async (uid) => {
  const authStore = useAuthStore();
  if (!authStore.profile) {
    await authStore.fetchUserProfile(uid);
  }
  await navigateTo("/admin");
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
const { value: email } = useField("email", "required|email");
const { value: password } = useField("password", "required");
const { value: businessName } = useField("businessName", (val) => {
  if (isSignUp.value && !val) return t("login.error_business_name_required");
  return true;
});

watch(isSignUp, () => {
  resetForm();
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;

  try {
    if (isSignUp.value) {
      // Sign Up flow (Self-service onboarding)
      const { data, error } = await client.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            business_name: values.businessName?.trim() || t("login.default_business_name"),
          },
        },
      });

      if (error) {
        $toast.error(error.message || t("login.error_signup_generic"));
        loading.value = false;
        return;
      }

      // Check if session exists (auto-confirmed or confirmation disabled)
      if (data?.session || data?.user) {
        $toast.success(t("login.signup_success"));
        
        // Wait for Supabase user sync
        const user = useSupabaseUser();
        if (!user.value) {
          await new Promise((resolve) => {
            const stop = watch(user, (val) => {
              if (val) {
                stop();
                resolve();
              }
            });
            setTimeout(resolve, 2500);
          });
        }
        await redirectAfterLogin(data?.user?.id || user.value?.id);
      } else {
        $toast.success(t("login.signup_email_confirmation"));
        isSignUp.value = false;
      }
    } else {
      // Sign In flow
      const { data: signInData, error } = await client.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        $toast.error(t("login.error_credentials"));
      } else {
        $toast.success(t("login.success"));
        const user = useSupabaseUser();
        if (!user.value) {
          await new Promise((resolve) => {
            const stop = watch(user, (val) => {
              if (val) {
                stop();
                resolve();
              }
            });
            setTimeout(resolve, 3000);
          });
        }
        await redirectAfterLogin(signInData?.user?.id || user.value?.id || user.value?.sub);
      }
    }
  } catch (err) {
    console.error("Auth error:", err);
    $toast.error(t("login.unexpected_error"));
  } finally {
    loading.value = false;
  }
});
</script>

