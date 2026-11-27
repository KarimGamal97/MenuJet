import { serverSupabaseServiceRole } from "#supabase/server";

const SITE_URL = "https://getmenujet.com";

interface SitemapProfileRow {
  slug: string | null;
  created_at: string | null;
  subscription_status: string | null;
  subscription_end_date: string | null;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isProfileExpired(profile: SitemapProfileRow): boolean {
  const status = String(profile.subscription_status || "").toLowerCase();
  if (status === "expired" || status === "inactive" || status === "cancelled") {
    return true;
  }
  if (!profile.subscription_end_date) return false;
  let s = String(profile.subscription_end_date).trim();
  if (s.includes(" ") && !s.includes("T")) s = s.replace(" ", "T");
  s = s.replace(/([+-]\d{2})$/, "$1:00");
  const ts = new Date(s).getTime();
  return !Number.isNaN(ts) && ts < Date.now();
}

function buildUrlEntry(path: string, priority: string, changefreq: string, lastmod?: string): string {
  const arLoc = `${SITE_URL}${path === "/" ? "" : path}`;
  const enLoc = `${SITE_URL}/en${path === "/" ? "" : path}`;
  const lastmodTag = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : "";

  const makeEntry = (loc: string) => `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(arLoc)}" />
    <xhtml:link rel="alternate" hreflang="ar-EG" href="${escapeXml(arLoc)}" />
    <xhtml:link rel="alternate" hreflang="ar-SA" href="${escapeXml(arLoc)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enLoc)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(arLoc)}" />
  </url>`;

  return `${makeEntry(arLoc)}\n${makeEntry(enLoc)}`;
}

export default defineEventHandler(async (event) => {
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  setHeader(event, "Cache-Control", "public, s-maxage=3600, stale-while-revalidate=7200");

  const entries: string[] = [
    buildUrlEntry("/", "1.0", "daily"),
    buildUrlEntry("/faq", "0.8", "weekly"),
    buildUrlEntry("/privacy", "0.4", "monthly"),
    buildUrlEntry("/terms", "0.4", "monthly"),
    buildUrlEntry("/refund", "0.4", "monthly"),
  ];

  try {
    const adminClient = serverSupabaseServiceRole(event);
    const { data: profiles } = await adminClient
      .from("profiles")
      .select("slug, created_at, subscription_status, subscription_end_date")
      .is("owner_id", null)
      .neq("role", "super_admin")
      .not("slug", "is", null);

    const seen = new Set<string>();
    for (const row of (profiles || []) as SitemapProfileRow[]) {
      const slug = String(row.slug || "").trim();
      if (!slug || seen.has(slug) || isProfileExpired(row)) continue;
      seen.add(slug);
      const lastmod = row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : undefined;
      entries.push(
        buildUrlEntry(`/menu/${encodeURIComponent(slug)}`, "0.7", "daily", lastmod)
      );
    }
  } catch (err) {
    console.error("Sitemap restaurant fetch error:", err);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>`;
});
