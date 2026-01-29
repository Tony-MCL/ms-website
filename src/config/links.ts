export const LINKS = {
  mcl: "https://morningcoffeelabs.no",
  ms: "https://managesystem.no",
  progress: "https://progress.managesystem.no",
} as const;

type Prefs = { lang?: string; theme?: string };

/**
 * Bygger en URL (base + path) og legger på theme/lang hvis de finnes.
 * - Bevarer eksisterende query params
 * - Funker med hash-ruter også
 */
export function linkWithPrefs(
  base: string,
  path: string = "",
  prefs: Prefs = {},
) {
  const url = new URL(path, base);

  if (prefs.lang) url.searchParams.set("lang", prefs.lang);
  if (prefs.theme) url.searchParams.set("theme", prefs.theme);

  return url.toString();
}
