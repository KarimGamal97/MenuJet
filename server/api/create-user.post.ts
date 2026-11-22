export default defineEventHandler(async (event) => {
  try {
    const {
      adminClient,
      callerProfile,
      effectiveOwnerId,
    } = await requireRestaurantManager(event);

    const body = await readBody(event);
    const { email, password, full_name } = body;

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: "البريد الإلكتروني وكلمة المرور مطلوبان",
      });
    }

    // Staff created under a restaurant are always assigned 'user'
    const assignedRole = "user";

    const { data: newUser, error: authError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: assignedRole,
          full_name: full_name?.trim() || null,
        },
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

    const profilePayload = {
      user_id: newUser.user.id,
      email: email,
      full_name: full_name?.trim() || null,
      role: assignedRole,
      owner_id: effectiveOwnerId,
      business_name: callerProfile?.business_name || null,
      business_name_ar:
        callerProfile?.business_name_ar || body.business_name_ar || null,
      business_name_en: callerProfile?.business_name_en || null,
      slug: null,
      logo: callerProfile?.logo || null,
      whatsapp_number: callerProfile?.whatsapp_number || null,
      categories: callerProfile?.categories || null,
      is_active: callerProfile?.is_active ?? true,
    };

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
