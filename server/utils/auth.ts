import type { H3Event } from "h3";
import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

export interface CallerContext {
  adminClient: ReturnType<typeof serverSupabaseServiceRole>;
  userId: string;
  callerProfile: Record<string, any>;
  callerRole: string;
  effectiveOwnerId: string;
}

export async function requireCallerProfile(event: H3Event): Promise<CallerContext> {
  const requestingUser = await serverSupabaseUser(event);
  if (!requestingUser) {
    throw createError({ statusCode: 401, message: "يجب تسجيل الدخول أولاً" });
  }

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

  const adminClient = serverSupabaseServiceRole(event);

  const { data: callerProfile, error } = await adminClient
    .from("profiles")
    .select(
      "id, user_id, owner_id, role, business_name, business_name_ar, business_name_en, logo, whatsapp_number, categories, is_active",
    )
    .or(`user_id.eq.${userId},id.eq.${userId}`)
    .limit(1)
    .single();

  if (error || !callerProfile) {
    throw createError({
      statusCode: 403,
      message: "تعذر التحقق من صلاحيات الحساب",
    });
  }

  const callerRole = String(callerProfile.role || "").toLowerCase();
  const effectiveOwnerId = callerProfile.owner_id || userId;

  return {
    adminClient,
    userId,
    callerProfile,
    callerRole,
    effectiveOwnerId,
  };
}

export async function requireRestaurantManager(event: H3Event): Promise<CallerContext> {
  const ctx = await requireCallerProfile(event);
  const isOwnerOrPlatform =
    ctx.callerRole === "super_admin" ||
    (ctx.callerRole === "admin" && !ctx.callerProfile.owner_id);

  if (!isOwnerOrPlatform) {
    throw createError({
      statusCode: 403,
      message: "عذراً، هذه الصلاحية لصاحب المطعم فقط",
    });
  }

  return ctx;
}

export async function requirePlatformOwner(event: H3Event): Promise<CallerContext> {
  const ctx = await requireCallerProfile(event);

  if (ctx.callerRole !== "super_admin") {
    throw createError({
      statusCode: 403,
      message: "عذراً، هذه الصلاحية لمدير المنصة فقط",
    });
  }

  return ctx;
}
