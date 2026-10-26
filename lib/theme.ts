export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/** Browser UI colour per theme; matches `--background` in globals.css. */
export const THEME_COLOR: Record<Theme, string> = { dark: "#060609", light: "#f6f6f9" };

/**
 * Inlined in <head> so it runs before first paint: the saved choice, else the OS setting.
 * Without it, light-mode visitors would see a dark flash on every load.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
