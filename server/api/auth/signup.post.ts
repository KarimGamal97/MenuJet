import { serverSupabaseServiceRole } from "#supabase/server";
import {
  buildTechnicalPhoneEmail,
  canonicalPhoneDigits,
  getPhoneSuffixPattern,
  isValidPhoneInput,
  phonesMatch,
} from "../../utils/phone";

interface SignupBody {
  ownerName?: string;
  businessName?: string;
  whatsappNumber?: string;
  primaryColor?: string;
  categories?: string[];
  whatsappOrderingEnabled?: boolean;
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody<SignupBody>(event)) || {};

    const ownerName = String(body.ownerName || "").trim();
    const businessName = String(body.businessName || "").trim();
    const whatsappNumber = String(body.whatsappNumber || "").trim();
    const rawEmail = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const primaryColor = String(body.primaryColor || "#ea580c").trim();
    const categories = Array.isArray(body.categories) ? body.categories : [];
    const whatsappOrderingEnabled =
      typeof body.whatsappOrderingEnabled === "boolean"
        ? body.whatsappOrderingEnabled
        : true;

    if (!ownerName || !businessName) {
      throw createError({
        statusCode: 400,
        message: "الاسم واسم المطعم مطلوبان",
      });
    }

    if (!isValidPhoneInput(whatsappNumber)) {
      throw createError({
        statusCode: 400,
        message: "يرجى إدخال رقم هاتف / واتساب صحيح",
      });
    }

    if (rawEmail && !EMAIL_REGEX.test(rawEmail)) {
      throw createError({
        statusCode: 400,
        message: "البريد الإلكتروني غير صالح",
      });
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
      });
    }

    const adminClient = serverSupabaseServiceRole(event);
    const suffix = getPhoneSuffixPattern(whatsappNumber);

    // Ensure phone is not already registered to another restaurant owner
    if (suffix) {
      const { data: matchingOwners, error: lookupError } = await adminClient
        .from("profiles")
        .select("id, whatsapp_number")
        .is("owner_id", null)
        .ilike("whatsapp_number", `%${suffix}`)
        .limit(10);

      if (lookupError) throw lookupError;

      const duplicate = (matchingOwners || []).some((row) =>
        phonesMatch(row.whatsapp_number, whatsappNumber),
      );
      if (duplicate) {
        throw createError({
          statusCode: 409,
          message: "رقم الهاتف مسجل بالفعل لحساب آخر",
        });
      }
    }

    const authEmail = rawEmail || buildTechnicalPhoneEmail(whatsappNumber);

    const { data: created, error: authError } =
      await adminClient.auth.admin.createUser({
        email: authEmail,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: ownerName,
          business_name: businessName,
          whatsapp_number: whatsappNumber,
          primary_color: primaryColor,
          categories,
          whatsapp_ordering_enabled: whatsappOrderingEnabled,
          phone_canonical: canonicalPhoneDigits(whatsappNumber),
        },
      });

    if (authError) {
      const msg = authError.message || "";
      if (
        msg.includes("already registered") ||
        msg.includes("already been registered")
      ) {
        throw createError({
          statusCode: 409,
          message: rawEmail
            ? "هذا البريد الإلكتروني مسجل بالفعل"
            : "رقم الهاتف مسجل بالفعل لحساب آخر",
        });
      }
      throw createError({
        statusCode: 400,
        message: msg || "تعذر إنشاء الحساب",
      });
    }

    const userId = created?.user?.id;
    if (!userId) {
      throw createError({
        statusCode: 500,
        message: "فشل إنشاء حساب المستخدم",
      });
    }

    const profileUpdates: Record<string, any> = {
      full_name: ownerName,
      business_name: businessName,
      business_name_ar: businessName,
      whatsapp_number: whatsappNumber,
      primary_color: primaryColor,
      categories,
      whatsapp_ordering_enabled: whatsappOrderingEnabled,
    };

    if (rawEmail) {
      profileUpdates.email = rawEmail;
    }

    const { data: existingProfile } = await adminClient
      .from("profiles")
      .select("id")
      .or(`user_id.eq.${userId},id.eq.${userId}`)
      .maybeSingle();

    if (existingProfile?.id) {
      const { error: updateError } = await adminClient
        .from("profiles")
        .update(profileUpdates)
        .eq("id", existingProfile.id);

      if (updateError) {
        await adminClient.auth.admin.deleteUser(userId);
        throw updateError;
      }
    } else {
      const { error: insertError } = await adminClient
        .from("profiles")
        .insert({
          id: userId,
          user_id: userId,
          role: "admin",
          email: rawEmail || null,
          ...profileUpdates,
        });

      if (insertError) {
        await adminClient.auth.admin.deleteUser(userId);
        throw insertError;
      }
    }

    return {
      success: true,
      loginIdentifier: rawEmail || whatsappNumber,
    };
  } catch (error: any) {
    console.error("Signup API error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "حدث خطأ أثناء إنشاء الحساب",
    });
  }
});
