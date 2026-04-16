import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    // Only allow authenticated super admins to call this endpoint
    const requestingUser = await serverSupabaseUser(event);
    if (!requestingUser) {
      throw createError({ statusCode: 401, message: "يجب تسجيل الدخول أولاً" });
    }

    // Check super_admin role from metadata
    const callerRole =
      requestingUser.user_metadata?.role || requestingUser.app_metadata?.role;

    if (callerRole !== "super_admin") {
      throw createError({
        statusCode: 403,
        message: "عذراً، هذه الصلاحية للمدير العام فقط",
      });
    }

    // Service role client — bypasses RLS for admin operations
    const adminClient = serverSupabaseServiceRole(event);

    // Fetch the super admin's restaurant profile to copy to the new admin
    // We try to find by user_id or id
    const { data: superAdminProfile, error: profileFetchError } =
      await adminClient
        .from("profiles")
        .select(
          "business_name_ar, business_name_en, slug, logo, whatsapp_number, categories, is_active",
        )
        .or(`user_id.eq.${requestingUser.id},id.eq.${requestingUser.id}`)
        .limit(1)
        .single();

    if (profileFetchError) {
      console.warn(
        "Could not find super admin profile:",
        profileFetchError.message,
      );
    }

    // Get the new user data from the request body
    const body = await readBody(event);
    const { email, password, role } = body;

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: "البريد الإلكتروني وكلمة المرور مطلوبان",
      });
    }

    // 1. Create the auth user using service role
    const { data: newUser, error: authError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: role || "admin" }, // Store role in metadata too
      });

    if (authError) {
      console.error("Auth Creation Error:", authError.message);
      throw createError({
        statusCode: 400,
        message:
          authError.message === "User already registered"
            ? "هذا البريد الإلكتروني مسجل بالفعل"
            : authError.message,
      });
    }

    if (!newUser?.user) {
      throw createError({
        statusCode: 500,
        message: "فشل إنشاء حساب المستخدم",
      });
    }

    // 2. Create/Update profile for the new user
    const { error: profileError } = await adminClient.from("profiles").upsert(
      {
        id: newUser.user.id,
        user_id: newUser.user.id,
        email: email,
        role: role || "admin",
        owner_id: requestingUser.id,
        business_name_ar:
          superAdminProfile?.business_name_ar || body.business_name_ar || null,
        business_name_en: superAdminProfile?.business_name_en || null,
        slug: superAdminProfile?.slug || null,
        logo: superAdminProfile?.logo || null,
        whatsapp_number: superAdminProfile?.whatsapp_number || null,
        categories: superAdminProfile?.categories || null,
        is_active: superAdminProfile?.is_active ?? true,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      console.error("Profile Upsert Error:", profileError);
      // We don't throw yet, as the user is already created in Auth
    }

    return {
      success: true,
      userId: newUser.user.id,
      message: "تم إنشاء الحساب بنجاح",
    };
  } catch (error: any) {
    console.error("Global Create User Error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "حدث خطأ داخلي في الخادم",
    });
  }
});
