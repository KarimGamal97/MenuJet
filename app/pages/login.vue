<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-6 font-sans text-right"
    dir="rtl"
  >
    <div class="max-w-md w-full">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-black text-gray-900 mb-2">
          {{ $t("login.title") }}
        </h2>
        <p class="text-gray-400 text-sm">
          {{ $t("login.subtitle") }} <strong>MenuJet</strong>
        </p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <input
            v-model="email"
            type="email"
            :placeholder="$t('login.email_placeholder')"
            :class="errors.email ? 'border-red-500' : 'border-gray-100'"
            class="w-full p-4 bg-white border rounded-2xl outline-none focus:border-orange-500 shadow-sm transition-all"
          />
          <p class="text-[10px] text-red-500 mt-1 mr-2" v-if="errors.email">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <input
            v-model="password"
            type="password"
            :placeholder="$t('login.password_placeholder')"
            :class="errors.password ? 'border-red-500' : 'border-gray-100'"
            class="w-full p-4 bg-white border rounded-2xl outline-none focus:border-orange-500 shadow-sm transition-all"
          />
          <p class="text-[10px] text-red-500 mt-1 mr-2" v-if="errors.password">
            {{ errors.password }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-100 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <span v-if="!loading">{{ $t("login.submit") }}</span>
          <span v-else class="flex justify-center items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ $t("login.loading") }}
          </span>
        </button>
      </form>

      <div class="fixed bottom-8 left-0 w-full text-center">
        <p
          class="text-[10px] text-gray-300 uppercase tracking-widest font-bold"
        >
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

const { t } = useI18n();

defineRule("required", (val) => !!val || t("login.error_required"));
defineRule(
  "email",
  (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || t("login.error_email"),
);

const { $toast } = useNuxtApp();
const client = useSupabaseClient();
const loading = ref(false);

const { handleSubmit, errors } = useForm();
const { value: email } = useField("email", "required|email");
const { value: password } = useField("password", "required");

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const { error } = await client.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    $toast.error(t("login.error_credentials"));
    loading.value = false;
  } else {
    $toast.success(t("login.success"));
    navigateTo("/admin");
  }
});
</script>
