import { defineStore } from "pinia";

import type { Plan, Profile } from "~/types";

interface UserProfile {
  id: string;
  user_id?: string;
  full_name: string | null;
  role: "super_admin" | "admin" | "user";
  business_name?: string;
  business_name_ar?: string;
  business_name_en?: string;
  logo?: string;
  categories?: string[];
  is_active?: boolean;
  plan_type?: string;
  plan_id?: string;
  plans?: Plan;
  plan?: Plan;
  max_items?: number;
  max_categories?: number;
  subscription_status?: string;
  subscription_end_date?: string;
  [key: string]: any;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: useSupabaseUser(),
    profile: null as UserProfile | null,
  }),

  getters: {
    // Platform owner only
    isPlatformOwner: (state): boolean =>
      isPlatformOwnerRole(state.profile?.role),

    isSuperAdmin: (state): boolean =>
      isPlatformOwnerRole(state.profile?.role),

    // Restaurant owner (admin without parent owner_id)
    isRestaurantOwner: (state): boolean =>
      state.profile?.role === "admin" && !state.profile?.owner_id,

    // Restaurant staff member
    isStaff: (state): boolean => state.profile?.role === "user",

    // Owner or platform owner with full restaurant management permissions
    canManageRestaurant: (state): boolean =>
      canManageRestaurantRole(state.profile?.role),

    // Check for any restaurant staff/admin level
    isAdmin: (state): boolean =>
      canManageRestaurantRole(state.profile?.role) ||
      (state.profile?.role === "user" && !!state.profile?.owner_id),

    isLoggedIn: (state): boolean => !!state.user?.value,
  },

  actions: {
    async fetchUserProfile(userId?: string) {
      const supabase = useSupabaseClient();
      const uid = userId ?? this.user?.id ?? (this.user as any)?.value?.id;

      if (!uid) return;

      try {
        let { data, error } = await supabase
          .from("profiles")
          .select("*, plans(*)")
          .eq("user_id", uid)
          .single();

        if (error) {
          // Graceful fallback if plans relation/table is not created yet
          const fallbackRes = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", uid)
            .single();
          data = fallbackRes.data;
        }

        if (data) {
          if (data.plans) {
            data.plan = data.plans;
          }
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
