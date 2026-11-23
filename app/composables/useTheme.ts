export type ThemeMode = "light" | "dark";

const THEME_COOKIE_NAME = "menujet_theme";

function syncDomTheme(dark: boolean) {
  if (!import.meta.client) return;
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

export function useTheme() {
  const themeCookie = useCookie<ThemeMode>(THEME_COOKIE_NAME, {
    default: () => "light",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  const isDark = computed(() => themeCookie.value === "dark");

  const setTheme = (mode: ThemeMode) => {
    themeCookie.value = mode;
    syncDomTheme(mode === "dark");
  };

  const toggleTheme = () => {
    setTheme(isDark.value ? "light" : "dark");
  };

  return {
    theme: themeCookie,
    isDark,
    setTheme,
    toggleTheme,
  };
}
