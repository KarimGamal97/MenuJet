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

    // Service role client — bypasses RLS for admin operations
    const adminClient = serverSupabaseServiceRole(event);

    const userId =
      requestingUser.id ||
      (requestingUser as any).sub ||
      (requestingUser as any).user?.id;
    if (!userId) {
      throw createError({
        statusCode: 401,
        message: "لم يتم التعرف على هوية المستخدم. الرجاء تسجيل الدخول مجدداً.",
      });
    }

    // Fetch the caller's profile to check their role and get restaurant data
    const { data: callerProfile, error: profileFetchError } = await adminClient
      .from("profiles")
      .select(
        "role, business_name, business_name_ar, business_name_en, slug, logo, whatsapp_number, categories, is_active",
      )
      .or(`user_id.eq.${userId},id.eq.${userId}`)
      .limit(1)
      .single();

    if (profileFetchError) {
      console.warn("Could not find caller profile:", profileFetchError.message);
    }

    const callerRole = (
      callerProfile?.role ||
      requestingUser?.user_metadata?.role ||
      requestingUser?.app_metadata?.role ||
      ""
    ).toLowerCase();

    if (callerRole !== "super_admin") {
      throw createError({
        statusCode: 403,
        message: "عذراً، هذه الصلاحية للمدير العام فقط",
      });
    }

    const superAdminProfile = callerProfile;

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
      let errorCode = "UNKNOWN_ERROR";
      let userFriendlyMessage = authError.message;

      if (
        authError.message.includes("already registered") ||
        authError.message.includes("already been registered")
      ) {
        errorCode = "EMAIL_ALREADY_EXISTS";
        userFriendlyMessage = "هذا البريد الإلكتروني مسجل بالفعل لمستخدم آخر";
      } else if (
        authError.message.includes("Password should contain") ||
        authError.message.toLowerCase().includes("password")
      ) {
        errorCode = "PASSWORD_WEAK";
        userFriendlyMessage =
          "كلمة المرور ضعيفة! يجب أن تحتوي على: حرف كبير (A-Z)، حرف صغير (a-z)، رقم (0-9)، ورمز خاص (مثل #)";
      }

      throw createError({
        statusCode: 400,
        message: userFriendlyMessage,
        data: { code: errorCode },
      });
    }

    if (!newUser?.user) {
      throw createError({
        statusCode: 500,
        message: "فشل إنشاء حساب المستخدم",
      });
    }

    // 2. Create/Update profile for the new user
    const profilePayload = {
      user_id: newUser.user.id,
      email: email,
      role: role || "admin",
      owner_id: userId,
      business_name: superAdminProfile?.business_name || null,
      business_name_ar:
        superAdminProfile?.business_name_ar || body.business_name_ar || null,
      business_name_en: superAdminProfile?.business_name_en || null,
      slug: null, // Sub-admins don't need the restaurant's unique slug
      logo: superAdminProfile?.logo || null,
      whatsapp_number: superAdminProfile?.whatsapp_number || null,
      categories: superAdminProfile?.categories || null,
      is_active: superAdminProfile?.is_active ?? true,
    };

    // Check if profile was already auto-created by a Supabase trigger
    const { data: existingProfile } = await adminClient
      .from("profiles")
      .select("id")
      .or(`user_id.eq.${newUser.user.id},id.eq.${newUser.user.id}`)
      .maybeSingle();

    let profileError;
    if (existingProfile?.id) {
      const { error } = await adminClient
        .from("profiles")
        .update(profilePayload)
        .eq("id", existingProfile.id);
      profileError = error;
    } else {
      const { error } = await adminClient
        .from("profiles")
        .insert({ id: newUser.user.id, ...profilePayload });
      profileError = error;
    }

    if (profileError) {
      console.error("Profile Upsert Error:", profileError);
      // Clean up the auth user if profile creation fails so it doesn't get orphaned
      await adminClient.auth.admin.deleteUser(newUser.user.id);
      throw createError({
        statusCode: 500,
        message: `فشل إنشاء بيانات الملف الشخصي: ${profileError.message}`,
      });
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
