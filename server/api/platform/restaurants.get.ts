export default defineEventHandler(async (event) => {
  try {
    const { adminClient } = await requirePlatformOwner(event);

    const { data: profiles, error } = await adminClient
      .from("profiles")
      .select(
        "id, user_id, email, full_name, business_name, business_name_ar, business_name_en, slug, whatsapp_number, role, plan_id, plan_type, max_items, max_categories, subscription_status, subscription_end_date, is_active, created_at",
      )
      .is("owner_id", null)
      .neq("role", "super_admin")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const restaurants = profiles || [];
    const ownerIds = restaurants.map((r) => r.user_id).filter(Boolean);

    // Aggregate item and order counts in two lightweight queries
    const [itemsRes, ordersRes] = await Promise.all([
      ownerIds.length > 0
        ? adminClient
            .from("menu_items")
            .select("user_id")
            .in("user_id", ownerIds)
        : Promise.resolve({ data: [] }),
      ownerIds.length > 0
        ? adminClient
            .from("orders")
            .select("user_id")
            .in("user_id", ownerIds)
            .neq("status", "archived")
        : Promise.resolve({ data: [] }),
    ]);

    const itemCounts: Record<string, number> = {};
    for (const row of itemsRes.data || []) {
      itemCounts[row.user_id] = (itemCounts[row.user_id] || 0) + 1;
    }

    const orderCounts: Record<string, number> = {};
    for (const row of ordersRes.data || []) {
      orderCounts[row.user_id] = (orderCounts[row.user_id] || 0) + 1;
    }

    await Promise.all(
      restaurants.map(async (r: any) => {
        r.items_count = itemCounts[r.user_id] || 0;
        r.orders_count = orderCounts[r.user_id] || 0;
        if (!r.email && r.user_id) {
          try {
            const { data: authUser } =
              await adminClient.auth.admin.getUserById(r.user_id);
            if (authUser?.user?.email) {
              r.email = authUser.user.email;
            }
          } catch {
            // Ignore missing auth email lookup
          }
        }
      }),
    );

    return restaurants;
  } catch (error: any) {
    console.error("Platform fetch restaurants error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch restaurants",
    });
  }
});
