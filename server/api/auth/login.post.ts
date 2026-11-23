import {
  serverSupabaseClient,
  serverSupabaseServiceRole,
} from "#supabase/server";
import {
  buildTechnicalPhoneEmail,
  getPhoneSuffixPattern,
  phonesMatch,
} from "../../utils/phone";

interface LoginBody {
  identifier?: string;
  password?: string;
}

const GENERIC_AUTH_ERROR = "بيانات الدخول غير صحيحة";

async function resolveAuthEmail(
  adminClient: ReturnType<typeof serverSupabaseServiceRole>,
  identifier: string,
): Promise<string | null> {
  if (identifier.includes("@")) {
    return identifier.toLowerCase();
  }

  const suffix = getPhoneSuffixPattern(identifier);
  if (suffix) {
    const { data: candidates, error } = await adminClient
      .from("profiles")
      .select("user_id, email, whatsapp_number")
      .is("owner_id", null)
      .ilike("whatsapp_number", `%${suffix}`)
      .limit(10);

    if (!error && candidates) {
      const matched = candidates.find((row) =>
        phonesMatch(row.whatsapp_number, identifier),
      );

      if (matched?.user_id) {
        const { data: authData } = await adminClient.auth.admin.getUserById(
          matched.user_id,
        );
        if (authData?.user?.email) {
          return authData.user.email;
        }
      }

      if (matched?.email) {
        return matched.email;
      }
    }
  }

  return buildTechnicalPhoneEmail(identifier);
}

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody<LoginBody>(event)) || {};
    const identifier = String(body.identifier || "").trim();
    const password = String(body.password || "");

    if (!identifier || !password) {
      throw createError({
        statusCode: 400,
        message: "بيانات الدخول مطلوبة",
      });
    }

    const adminClient = serverSupabaseServiceRole(event);
    const resolvedEmail = await resolveAuthEmail(adminClient, identifier);

    if (!resolvedEmail) {
      throw createError({
        statusCode: 401,
        message: GENERIC_AUTH_ERROR,
      });
    }

    const supabase = await serverSupabaseClient(event);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: resolvedEmail,
      password,
    });

    if (error || !data?.session) {
      throw createError({
        statusCode: 401,
        message: GENERIC_AUTH_ERROR,
      });
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user_id: data.user?.id || null,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || GENERIC_AUTH_ERROR,
    });
  }
});
