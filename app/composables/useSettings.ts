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

      if (error) {
        // Fallback if payment or bio hub columns don't exist in profiles schema yet
        if (error.message?.includes("column") || (error as any).code === "PGRST204") {
          console.warn("Profiles schema missing optional columns, saving core fields:", error.message);
          const fallbackData = { ...updateData };
          delete fallbackData.vodafone_cash_number;
          delete fallbackData.instapay_account;
          delete fallbackData.payment_methods_allowed;
          delete fallbackData.bio_hub_enabled;
          delete fallbackData.social_instagram;
          delete fallbackData.social_facebook;
          delete fallbackData.social_tiktok;
          delete fallbackData.social_location;
          delete fallbackData.social_phone;
          delete fallbackData.allow_order_editing;
          delete fallbackData.order_edit_window_minutes;
          delete fallbackData.announcement_enabled;
          delete fallbackData.announcement_text;
          delete fallbackData.cashier_ordering_enabled;
          const retryRes = await client
            .from("profiles")
            .update(fallbackData)
            .eq("user_id", userId);
          if (retryRes.error) throw retryRes.error;
        } else {
          throw error;
        }
      }

      profile.value = { ...profile.value, ...updateData };
      $toast.success(t("admin.settings_success"));
      return true;
    } catch (err: any) {
      console.error("Update Profile Error:", err);
      $toast.error(err?.message || "فشل تحديث الإعدادات");
      return false;
    } finally {
      loading.value = false;
    }
  };

  const compressLogoFile = async (file: File, maxDimension = 400): Promise<File> => {
    if (
      typeof window === "undefined" ||
      !file.type.startsWith("image/") ||
      file.type === "image/svg+xml"
    ) {
      return file;
    }

    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
      const targetWidth = Math.max(1, Math.round(bitmap.width * scale));
      const targetHeight = Math.max(1, Math.round(bitmap.height * scale));

      // Skip re-encoding if already small enough
      if (scale === 1 && file.size <= 80 * 1024) {
        bitmap.close();
        return file;
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        bitmap.close();
        return file;
      }

      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
      bitmap.close();

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((result) => resolve(result), "image/webp", 0.85);
      });

      if (!blob || blob.size >= file.size) {
        return file;
      }

      const baseName = file.name.replace(/\.[^.]+$/, "") || "logo";
      return new File([blob], `${baseName}.webp`, { type: "image/webp" });
    } catch {
      return file;
    }
  };

  const uploadLogo = async (file: File, userId: string) => {
    if (!file || !userId) return null;
    uploading.value = true;

    const preparedFile = await compressLogoFile(file);
    const fileExt = preparedFile.name.split(".").pop() || "webp";
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    try {
      // Try 'menu-images' bucket which is public and standard
      const { error: uploadError } = await client.storage
        .from("menu-images")
        .upload(filePath, preparedFile);

      if (!uploadError) {
        const { data } = client.storage.from("menu-images").getPublicUrl(filePath);
        return data.publicUrl;
      }

      // Fallback to 'logos' bucket
      const { error: fallbackError } = await client.storage
        .from("logos")
        .upload(filePath, preparedFile);

      if (fallbackError) throw fallbackError;

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
