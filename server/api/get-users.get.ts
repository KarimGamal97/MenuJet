export default defineEventHandler(async (event) => {
  try {
    const { adminClient, effectiveOwnerId } =
      await requireRestaurantManager(event);

    const { data: users, error } = await adminClient
      .from("profiles")
      .select("*")
      .or(
        `id.eq.${effectiveOwnerId},owner_id.eq.${effectiveOwnerId},user_id.eq.${effectiveOwnerId}`,
      )
      .order("full_name", { ascending: true });

    if (error) {
      throw error;
    }

    await Promise.all(
      (users || []).map(async (u) => {
        if (!u.email && u.user_id) {
          try {
            const { data: authUser } =
              await adminClient.auth.admin.getUserById(u.user_id);
            if (authUser?.user?.email) {
              u.email = authUser.user.email;
            }
          } catch {
            // Ignore missing auth user email lookup
          }
        }
      }),
    );

    return users;
  } catch (error: any) {
    console.error("Fetch users error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message,
    });
  }
});
