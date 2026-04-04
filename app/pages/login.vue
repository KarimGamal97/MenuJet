<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-6 text-right"
    dir="rtl"
  >
    <div class="max-w-md w-full">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          {{ $t("login.title") }}
        </h2>
        <p class="text-gray-400 text-sm">
          {{ $t("login.subtitle") }} <strong>MenuJet</strong>
        </p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
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
          {{ loading ? $t("login.loading") : $t("login.submit") }}
        </BaseButton>
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
});
</script>
