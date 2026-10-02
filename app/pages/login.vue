<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12"
    :class="locale === 'ar' ? 'text-right' : 'text-left'"
    :dir="locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block mb-3">
          <span class="text-2xl font-black text-orange-600 tracking-tight">MenuJet</span>
        </NuxtLink>
        <h2 class="text-3xl font-black text-gray-900 mb-2">
          {{ isSignUp ? $t("login.signup_title") : $t("login.title") }}
        </h2>
        <p class="text-gray-500 text-sm">
          {{ isSignUp ? $t("login.signup_subtitle") : $t("login.subtitle") + " MenuJet" }}
        </p>
      </div>

      <!-- Mode Switcher Tabs -->
      <div class="flex bg-gray-200/70 p-1.5 rounded-2xl mb-6 shadow-inner">
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

      <!-- Google Sign In Button -->
      <button
        type="button"
        @click="signInWithGoogle"
        :disabled="googleLoading"
        class="w-full mb-6 py-3.5 px-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
      >
        <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>{{ isSignUp ? $t("login.google_signup") : $t("login.google_signin") }}</span>
      </button>

      <!-- Divider -->
      <div class="relative flex items-center justify-center mb-6">
        <div class="border-t border-gray-200 w-full"></div>
        <span class="bg-gray-50 px-3 text-xs text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">
          {{ $t("login.or_email") }}
        </span>
        <div class="border-t border-gray-200 w-full"></div>
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

      <div class="mt-12 text-center">
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

// Auto redirect if already logged in or returning from Google OAuth
watch(
  user,
  (val) => {
    if (val && route.path.includes("/login")) {
      navigateTo("/admin");
    }
  },
  { immediate: true }
);

let authSubscription = null;

onMounted(async () => {
  // Listen for OAuth redirect state changes
  const { data } = client.auth.onAuthStateChange((event, session) => {
    if (
      route.path.includes("/login") &&
      session?.user &&
      (event === "SIGNED_IN" || event === "INITIAL_SESSION")
    ) {
      navigateTo("/admin");
    }
  });
  authSubscription = data?.subscription;

  // Direct check in case session exists
  const { data: sessionData } = await client.auth.getSession();
  if (sessionData?.session?.user && route.path.includes("/login")) {
    navigateTo("/admin");
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
        navigateTo("/admin");
      } else {
        $toast.success(t("login.signup_email_confirmation"));
        isSignUp.value = false;
      }
    } else {
      // Sign In flow
      const { error } = await client.auth.signInWithPassword({
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
        navigateTo("/admin");
      }
    }
  } catch (err) {
    console.error("Auth error:", err);
    $toast.error(t("login.unexpected_error"));
  } finally {
    loading.value = false;
  }
});

const googleLoading = ref(false);

const signInWithGoogle = async () => {
  googleLoading.value = true;
  if (businessName.value?.trim()) {
    localStorage.setItem("pending_restaurant_name", businessName.value.trim());
  }
  try {
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/confirm`,
      },
    });

    if (error) {
      $toast.error(error.message || t("login.error_google_failed"));
    }
  } catch (err) {
    console.error("Google sign in error:", err);
    $toast.error(t("login.error_google_service"));
  } finally {
    googleLoading.value = false;
  }
};
</script>

