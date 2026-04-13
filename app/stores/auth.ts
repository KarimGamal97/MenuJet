import { defineStore } from "pinia";

interface UserProfile {
  id: string;
  full_name: string | null;
  role: "super_admin" | "admin" | "user";
  business_name_ar?: string;
  business_name_en?: string;
  logo?: string;
  categories?: string[];
  is_active?: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: useSupabaseUser(),
    profile: null as UserProfile | null,
  }),

  getters: {
    // Check for super admin privileges
    isSuperAdmin: (state): boolean => state.profile?.role === "super_admin",

    // Check for any admin level
    isAdmin: (state): boolean =>
      state.profile?.role === "admin" || state.profile?.role === "super_admin",

    isLoggedIn: (state): boolean => !!state.user?.value,
  },

  actions: {
    async fetchUserProfile(userId?: string) {
      const supabase = useSupabaseClient();
      const uid = userId ?? this.user?.id ?? (this.user as any)?.value?.id;

      if (!uid) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", uid)
          .single();

        if (error) throw error;

        if (data) {
          this.profile = data as UserProfile;
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        this.profile = null;
      }
    },

    async logout() {
      const supabase = useSupabaseClient();
      const { error } = await supabase.auth.signOut();
      if (!error) {
        this.profile = null;
        return navigateTo("/login");
      }
    },
  },
});
