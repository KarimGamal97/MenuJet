import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  // Only allow authenticated super admins to call this endpoint
  const requestingUser = await serverSupabaseUser(event);
  if (!requestingUser) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  // Check super_admin role from JWT user_metadata
  const callerRole =
    requestingUser.user_metadata?.role || requestingUser.app_metadata?.role;

  if (callerRole !== "super_admin") {
    throw createError({
      statusCode: 403,
      message: "Forbidden: Super admin only",
    });
  }

  // Service role client — bypasses RLS for admin operations
  const adminClient = serverSupabaseServiceRole(event);

  // Fetch the super admin's restaurant profile to copy to the new admin
  const { data: superAdminProfile } = await adminClient
    .from("profiles")
    .select(
      "business_name_ar, business_name_en, slug, logo, whatsapp_number, categories, is_active",
    )
    .or(`user_id.eq.${requestingUser.id},id.eq.${requestingUser.id}`)
    .single();

  // Get the new user data from the request body
  const { email, password, role } = await readBody(event);

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required",
    });
  }

  // Create the auth user using service role
  const { data: newUser, error: createError2 } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError2) {
    throw createError({ statusCode: 400, message: createError2.message });
  }

  // Upsert profile — works whether the trigger fired or not
  const { error: profileError } = await adminClient.from("profiles").upsert(
    {
      id: newUser.user.id,
      user_id: newUser.user.id,
      email: email,
      role: role || "admin",
      owner_id: requestingUser.id, // Link to super admin's restaurant
      business_name_ar: superAdminProfile?.business_name_ar || null,
      business_name_en: superAdminProfile?.business_name_en || null,
      slug: superAdminProfile?.slug || null,
      logo: superAdminProfile?.logo || null,
      whatsapp_number: superAdminProfile?.whatsapp_number || null,
      categories: superAdminProfile?.categories || null,
      is_active: superAdminProfile?.is_active ?? true,
    } as any,
    { onConflict: "id" },
  );

  if (profileError) {
    console.error("Profile upsert error:", profileError);
  }

  return { success: true, userId: newUser.user.id };
});
