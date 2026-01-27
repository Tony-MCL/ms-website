import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import type { Lang } from "../i18n";

const assetBase = import.meta.env.BASE_URL || "/";
const logoUrl = `${assetBase}mcl-logo.png`;

// Eksterne lenker tilbake til Morning Coffee Labs (HashRouter)
const MCL_ORIGIN = "https://morningcoffeelabs.no";
function mclHref(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${MCL_ORIGIN}/#${p}`;
}

type ThemeMode = "light" | "dark";

function applyTheme(mode: ThemeMode) {
  const html = document.documentElement;
  if (mode === "dark") html.setAttribute("data-theme", "dark");
  else html.removeAttribute("data-theme");
}

function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem("mcl_theme");
  if (saved === "dark" || saved === "light") return saved;
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const location = useLocation();

  const { t, lang, setLang } = useI18n();

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const closeMenu = () => setOpen(false);
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const navExternal = useMemo(
    () => [
      { key: "home", href: mclHref("/") },
      { key: "services", href: mclHref("/idebank") },
      { key: "about", href: mclHref("/om") },
      { key: "contact", href: mclHref("/kontakt") },
    ],
    []
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
          <a href={mclHref("/")} onClick={closeMenu}>
            <img src={logoUrl} alt={t("header.logoAlt")} />
          </a>
        </div>

        <nav className="header-nav">
          <a href={navExternal[0].href}>{t("header.nav.home")}</a>
          <a href={navExternal[1].href}>{t("header.nav.services")}</a>
          <a href={navExternal[2].href}>{t("header.nav.about")}</a>
          <a href={navExternal[3].href}>{t("header.nav.contact")}</a>

          {/* Progress blir igjen her på managesystem.no */}
          <Link className={isActive("/progress") ? "active" : ""} to="/progress">
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
            aria-label={
              theme === "dark"
                ? t("header.theme.ariaToLight")
                : t("header.theme.ariaToDark")
            }
            title={
              theme === "dark"
                ? t("header.theme.titleLight")
                : t("header.theme.titleDark")
            }
          >
            <span className="theme-icon" aria-hidden="true">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
            <span className="theme-label">
              {theme === "dark"
                ? t("header.theme.labelDark")
                : t("header.theme.labelLight")}
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
        <a href={navExternal[0].href} onClick={closeMenu}>
          {t("header.nav.home")}
        </a>

        <a href={navExternal[1].href} onClick={closeMenu}>
          {t("header.nav.services")}
        </a>

        <a href={navExternal[2].href} onClick={closeMenu}>
          {t("header.nav.about")}
        </a>

        <a href={navExternal[3].href} onClick={closeMenu}>
          {t("header.nav.contact")}
        </a>

        <Link to="/progress" onClick={closeMenu}>
          {t("header.nav.progress")}
        </Link>

        <button
          type="button"
          className="theme-toggle mobile"
          onClick={toggleLang}
        >
          <span className="theme-icon" aria-hidden="true">
            🌐
          </span>
          <span className="theme-label">
            {t("header.lang.label")}:{" "}
            {lang === "no" ? t("header.lang.nb") : t("header.lang.en")}
          </span>
        </button>

        <button
          type="button"
          className="theme-toggle mobile"
          onClick={toggleTheme}
        >
          <span className="theme-icon" aria-hidden="true">
            {theme === "dark" ? "🌙" : "☀️"}
          </span>
          <span className="theme-label">
            {theme === "dark"
              ? t("header.theme.mobileDark")
              : t("header.theme.mobileLight")}
          </span>
        </button>
      </div>
    </>
  );
};

export default Header;
