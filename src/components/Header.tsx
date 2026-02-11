import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import type { Lang } from "../i18n";
import { LINKS } from "../config/links";

const assetBase = import.meta.env.BASE_URL || "/";
const logoUrl = `${assetBase}mcl-logo.png`;

type ThemeMode = "light" | "dark";

function applyTheme(mode: ThemeMode) {
  const html = document.documentElement;
  if (mode === "dark") html.setAttribute("data-theme", "dark");
  else html.removeAttribute("data-theme");
}

function readPrefsFromUrl(): { theme?: ThemeMode; lang?: Lang } {
  const href = window.location.href;
  const url = new URL(href);

  const out: { theme?: ThemeMode; lang?: Lang } = {};

  const lang = url.searchParams.get("lang");
  const theme = url.searchParams.get("theme");

  if (lang === "no" || lang === "en") out.lang = lang;
  if (theme === "dark" || theme === "light") out.theme = theme;

  if (url.hash && url.hash.includes("?")) {
    const idx = url.hash.indexOf("?");
    const qs = url.hash.slice(idx + 1);
    const sp = new URLSearchParams(qs);

    const hLang = sp.get("lang");
    const hTheme = sp.get("theme");

    if (!out.lang && (hLang === "no" || hLang === "en")) out.lang = hLang;
    if (!out.theme && (hTheme === "dark" || hTheme === "light")) out.theme = hTheme as ThemeMode;
  }

  return out;
}

function getInitialTheme(): ThemeMode {
  const fromUrl = readPrefsFromUrl().theme;
  if (fromUrl === "dark" || fromUrl === "light") return fromUrl;

  const saved = localStorage.getItem("mcl_theme");
  if (saved === "dark" || saved === "light") return saved;

  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

// Eksterne lenker tilbake til Morning Coffee Labs (HashRouter)
// Vi legger lang/theme i query FØR hash: https://mcl.no/?lang=no&theme=dark#/om
function mclHref(path: string, prefs: { lang: Lang; theme: ThemeMode }) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const u = new URL(LINKS.mcl);
  u.searchParams.set("lang", prefs.lang);
  u.searchParams.set("theme", prefs.theme);
  u.hash = `#${p}`;
  return u.toString();
}

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const location = useLocation();

  const { t, lang, setLang } = useI18n();

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    localStorage.setItem("mcl_theme", initial);
    applyTheme(initial);
  }, []);

  const closeMenu = () => setOpen(false);
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const navExternal = useMemo(
    () => [
      { key: "home", href: mclHref("/", { lang, theme }) },
      { key: "services", href: mclHref("/idebank", { lang, theme }) },
      { key: "about", href: mclHref("/om", { lang, theme }) },
      { key: "contact", href: mclHref("/kontakt", { lang, theme }) },
    ],
    [lang, theme]
  );

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("mcl_theme", next);
    applyTheme(next);
  };

  const toggleLang = () => {
    const next: Lang = lang === "no" ? "en" : "no";
    setLang(next);
    closeMenu();
  };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          {/* Logo tar deg tilbake til MCL */}
          <a href={navExternal[0].href} onClick={closeMenu} rel="noopener noreferrer">
            <img src={logoUrl} alt={t("header.logoAlt")} />
          </a>
        </div>

        <nav className="header-nav">
          <a href={navExternal[0].href} rel="noopener noreferrer">
            {t("header.nav.home")}
          </a>
          <a href={navExternal[1].href} rel="noopener noreferrer">
            {t("header.nav.services")}
          </a>
          <a href={navExternal[2].href} rel="noopener noreferrer">
            {t("header.nav.about")}
          </a>
          <a href={navExternal[3].href} rel="noopener noreferrer">
            {t("header.nav.contact")}
          </a>

          {/* Progress blir igjen her på managesystem.no */}
          <Link className={isActive("/progress") ? "active" : ""} to="/progress" onClick={closeMenu}>
            {t("header.nav.progress")}
          </Link>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleLang}
            aria-label={t("header.lang.aria")}
            title={t("header.lang.label")}
          >
            <span className="theme-icon" aria-hidden="true">
              🌐
            </span>
            <span className="theme-label">
              {lang === "no" ? t("header.lang.nb") : t("header.lang.en")}
            </span>
          </button>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t("header.theme.ariaToLight") : t("header.theme.ariaToDark")}
            title={theme === "dark" ? t("header.theme.titleLight") : t("header.theme.titleDark")}
          >
            <span className="theme-icon" aria-hidden="true">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
            <span className="theme-label">
              {theme === "dark" ? t("header.theme.labelDark") : t("header.theme.labelLight")}
            </span>
          </button>

          <div
            className="hamburger"
            role="button"
            tabIndex={0}
            aria-label={open ? t("header.mobileMenu.close") : t("header.mobileMenu.open")}
            onClick={() => setOpen((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setOpen((prev) => !prev);
            }}
          >
            ☰
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <a href={navExternal[0].href} onClick={closeMenu} rel="noopener noreferrer">
          {t("header.nav.home")}
        </a>

        <a href={navExternal[1].href} onClick={closeMenu} rel="noopener noreferrer">
          {t("header.nav.services")}
        </a>

        <a href={navExternal[2].href} onClick={closeMenu} rel="noopener noreferrer">
          {t("header.nav.about")}
        </a>

        <a href={navExternal[3].href} onClick={closeMenu} rel="noopener noreferrer">
          {t("header.nav.contact")}
        </a>

        <Link to="/progress" onClick={closeMenu}>
          {t("header.nav.progress")}
        </Link>

        <button type="button" className="theme-toggle mobile" onClick={toggleLang}>
          <span className="theme-icon" aria-hidden="true">
            🌐
          </span>
          <span className="theme-label">
            {t("header.lang.label")}: {lang === "no" ? t("header.lang.nb") : t("header.lang.en")}
          </span>
        </button>

        <button type="button" className="theme-toggle mobile" onClick={toggleTheme}>
          <span className="theme-icon" aria-hidden="true">
            {theme === "dark" ? "🌙" : "☀️"}
          </span>
          <span className="theme-label">
            {theme === "dark" ? t("header.theme.mobileDark") : t("header.theme.mobileLight")}
          </span>
        </button>
      </div>
    </>
  );
};

export default Header;
