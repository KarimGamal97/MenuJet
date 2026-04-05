import type { Profile } from "~/types";

export const useSettings = () => {
  const client = useSupabaseClient<any>();
  const { $toast } = useNuxtApp();
  const { t } = useI18n();
  const profile = ref<Profile | null>(null);
  const loading = ref(false);
  const uploading = ref(false);

  const fetchProfile = async (userId: string) => {
    if (!userId) return;
    loading.value = true;
    try {
      const { data, error } = await client
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      profile.value = data;
      return data;
    } catch (err: any) {
      console.error("Fetch Profile Error:", err);
      $toast.error("Failed to load settings");
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (userId: string, updateData: any) => {
    if (!userId) return false;
    loading.value = true;
    try {
      const { error } = await client
        .from("profiles")
        .update(updateData)
        .eq("user_id", userId);

      if (error) throw error;

      profile.value = { ...profile.value, ...updateData };
      $toast.success(t("admin.settings_success"));
      return true;
    } catch (err: any) {
      console.error("Update Profile Error:", err);
      $toast.error(t("admin.error_fields"));
      return false;
    } finally {
      loading.value = false;
    }
  };

  const uploadLogo = async (file: File, userId: string) => {
    if (!file || !userId) return null;
    uploading.value = true;

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    try {
      const { error: uploadError } = await client.storage
        .from("logos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = client.storage.from("logos").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      console.error("Logo Upload Error:", err);
      $toast.error("فشل رفع الشعار");
      return null;
    } finally {
      uploading.value = false;
    }
  };

  return {
    profile,
    loading,
    uploading,
    fetchProfile,
    updateProfile,
    uploadLogo,
  };
};
