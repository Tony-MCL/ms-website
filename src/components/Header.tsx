import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import type { Lang } from "../i18n";

const assetBase = import.meta.env.BASE_URL || "/";
const logoUrl = `${assetBase}mcl-logo.png`;

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
  const isActive = (path: string) => location.pathname === path;

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("mcl_theme", next);
    applyTheme(next);
  };

  const toggleLang = () => {
    const next: Lang = lang === "no" ? "en" : "no";
    setLang(next);
    closeMenu(); // nice: lukker mobilmeny ved språkbytte
  };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <Link to="/" onClick={closeMenu}>
            <img src={logoUrl} alt="Morning Coffee Labs" />
          </Link>
        </div>

        <nav className="header-nav">
          <Link className={isActive("/") ? "active" : ""} to="/">
            {t("header.nav.home")}
          </Link>

          {/* Ren label-endring: /idebank beholdes */}
          <Link className={isActive("/idebank") ? "active" : ""} to="/idebank">
            {t("header.nav.services")}
          </Link>

          <Link className={isActive("/om") ? "active" : ""} to="/om">
            {t("header.nav.about")}
          </Link>
          <Link className={isActive("/kontakt") ? "active" : ""} to="/kontakt">
            {t("header.nav.contact")}
          </Link>
          <Link className={isActive("/progress") ? "active" : ""} to="/progress">
            {t("header.nav.progress")}
          </Link>
        </nav>

        <div className="header-actions">
          {/* Språk-toggle (super enkel, skalerbar) */}
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleLang}
            aria-label={t("header.lang.aria")}
            title={t("header.lang.label")}
          >
            <span className="theme-icon" aria-hidden="true">🌐</span>
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

          <div className="hamburger" onClick={() => setOpen((prev) => !prev)}>
            ☰
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <Link to="/" onClick={closeMenu}>
          {t("header.nav.home")}
        </Link>

        <Link to="/idebank" onClick={closeMenu}>
          {t("header.nav.services")}
        </Link>

        <Link to="/om" onClick={closeMenu}>
          {t("header.nav.about")}
        </Link>
        <Link to="/kontakt" onClick={closeMenu}>
          {t("header.nav.contact")}
        </Link>
        <Link to="/progress" onClick={closeMenu}>
          {t("header.nav.progress")}
        </Link>

        {/* Språk i mobilmeny (samme stil) */}
        <button type="button" className="theme-toggle mobile" onClick={toggleLang}>
          <span className="theme-icon" aria-hidden="true">🌐</span>
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
