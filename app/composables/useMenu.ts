export const useMenu = () => {
  const client = useSupabaseClient<any>();
  const { $toast } = useNuxtApp();
  const items = ref<any[]>([]);
  const pending = ref(false);
  const loading = ref(false);
  const uploading = ref(false);

  const fetchMenuItems = async (userId: string) => {
    if (!userId) return;
    pending.value = true;
    try {
      let { data, error } = await client
        .from("menu_items")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        // Fallback: try without ordering
        const { data: fallbackData, error: fallbackError } = await client
          .from("menu_items")
          .select("*")
          .eq("user_id", userId);
        
        if (fallbackError) throw fallbackError;
        data = fallbackData;
      }
      
      items.value = data || [];
    } catch (err: any) {
      console.error("Fetch Menu Error Details:", {
        message: err.message,
        details: err.details,
        hint: err.hint,
        userId: userId,
      });
      $toast.error("Failed to load menu items");
    } finally {
      pending.value = false;
    }
  };

  const addItemToMenu = async (item: any, userId: string) => {
    if (!userId) return false;
    loading.value = true;
    try {
      const { data, error } = await client
        .from("menu_items")
        .insert([{ ...item, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      items.value.unshift(data);
      $toast.success("Item added successfully");
      return data;
    } catch (err: any) {
      console.error("Add Menu Item Error:", err);
      $toast.error("Failed to add menu item");
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateMenuItem = async (id: string | number, updates: any) => {
    if (!id) return false;
    loading.value = true;
    try {
      const { data, error } = await client
        .from("menu_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      const idx = items.value.findIndex((m: any) => m.id === id);
      if (idx !== -1) items.value[idx] = data;
      
      $toast.success("Item updated successfully");
      return data;
    } catch (err: any) {
      console.error("Update Menu Item Error:", err);
      $toast.error("Failed to update menu item");
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteMenuItem = async (id: string | number) => {
    if (!id) return false;
    loading.value = true;
    try {
      const { error } = await client.from("menu_items").delete().eq("id", id);

      if (error) throw error;
      
      const idx = items.value.findIndex((m: any) => m.id === id);
      if (idx !== -1) items.value.splice(idx, 1);
      
      $toast.success("Item deleted successfully");
      return true;
    } catch (err: any) {
      console.error("Delete Menu Item Error:", err);
      $toast.error("Failed to delete menu item");
      return false;
    } finally {
      loading.value = false;
    }
  };

  const uploadMenuImage = async (file: File, userId: string) => {
    if (!file || !userId) return null;
    uploading.value = true;

    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `items/${fileName}`;

    try {
      const { error: uploadError } = await client.storage
        .from("menu-items")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = client.storage.from("menu-items").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      console.error("Image Upload Error:", err);
      $toast.error("Failed to upload image");
      return null;
    } finally {
      uploading.value = false;
    }
  };

  return {
    items,
    pending,
    loading,
    uploading,
    fetchMenuItems,
    addItemToMenu,
    updateMenuItem,
    deleteMenuItem,
    uploadMenuImage,
  };
};
