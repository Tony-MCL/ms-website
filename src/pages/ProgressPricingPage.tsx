import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import PaywallModal from "../components/PaywallModal";

// Worker base (kan overstyres via env)
const DEFAULT_WORKER_BASE =
  "https://gentle-wildflower-980e.morningcoffeelabs.workers.dev";
const WORKER_BASE_URL =
  (import.meta as any).env?.VITE_PROGRESS_WORKER_BASE_URL || DEFAULT_WORKER_BASE;

// Progress app URL (ekstern) — kan overstyres via env.
// Viktig: fallback er intern rute, så ingenting knekker om env ikke er satt.
const DEFAULT_PROGRESS_APP_URL = "/progress/app";
const PROGRESS_APP_URL =
  (import.meta as any).env?.VITE_PROGRESS_APP_URL || DEFAULT_PROGRESS_APP_URL;

function isExternalUrl(u: string) {
  return /^https?:\/\//i.test(u);
}

function buildAppHref(params?: Record<string, string>) {
  const base = PROGRESS_APP_URL;

  // Intern fallback: bare bruk ruten
  if (!isExternalUrl(base)) return base;

  // Ekstern: legg til query-parametre (behold evt eksisterende query)
  const url = new URL(base);
  const sp = url.searchParams;

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") sp.set(k, v);
    });
  }

  return url.toString();
}

// Intropriser (eks mva)
const PRO_MONTH_EX_VAT = 129;
const PRO_YEAR_EX_VAT = 1290;

// MVA for visning i modal
const VAT_RATE = 0.25;
const CURRENCY = "NOK";

function stripCheckoutParams(search: string) {
  const sp = new URLSearchParams(search);
  sp.delete("from");
  sp.delete("success");
  sp.delete("canceled");
  const next = sp.toString();
  return next ? `?${next}` : "";
}

// Unified outline button style (same for trial + buy)
const outlineBtnStyle: React.CSSProperties = {
  padding: "0.6rem 0.9rem",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  fontWeight: 800,
};

const ProgressPricingPage: React.FC = () => {
  const { t, lang } = useI18n();

  const location = useLocation();
  const navigate = useNavigate();

  const sp = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const from = sp.get("from") || "";
  const success = sp.get("success") === "1";
  const canceled = sp.get("canceled") === "1";

  const showCheckoutBanner = from === "checkout" && (success || canceled);

  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallMode, setPaywallMode] = useState<"trial" | "buy">("buy");

  // Copy (i18n)
  const title = t<string>("progressPricing.title");
  const lead = t<string>("progressPricing.lead");

  const freeTitle = t<string>("progressPricing.free.title");
  const proTitle = t<string>("progressPricing.pro.title");

  const freeLead = t<string>("progressPricing.free.lead");
  const proLead = t<string>("progressPricing.pro.lead");

  const freeWhatTitle = t<string>("progressPricing.free.whatTitle");
  const freeWhat = t<string[]>("progressPricing.free.what") || [];

  const trialTitle = t<string>("progressPricing.free.trial.title");
  const trialBody = t<string>("progressPricing.free.trial.body");
  const startTrialLabel = t<string>("progressPricing.free.trial.cta");

  const proWhatTitle = t<string>("progressPricing.pro.whatTitle");
  const proWhat = t<string[]>("progressPricing.pro.what") || [];

  const introNote = t<string>("progressPricing.pro.introNote");
  const footerNote = t<string>("progressPricing.footerNote");

  const openApp = t<string>("progressPricing.openApp");
  const buyLabel = t<string>("progressPricing.pro.buyCta");

  const priceHeader = t<string>("progressPricing.pro.priceHeader");
  const priceLine = t<string>("progressPricing.pro.priceLine", {
    month: String(PRO_MONTH_EX_VAT),
    year: String(PRO_YEAR_EX_VAT),
  });

  const bannerSuccessMsg = t<string>("progressPricing.banner.successMsg");
  const bannerCanceledMsg = t<string>("progressPricing.banner.canceledMsg");
  const bannerDismissAria = t<string>("progressPricing.banner.dismissAria");
  const bannerTryAgain = t<string>("progressPricing.banner.tryAgain");

  function openTrial() {
    setPaywallMode("trial");
    setPaywallOpen(true);
  }
  function openBuy() {
    setPaywallMode("buy");
    setPaywallOpen(true);
  }

  function dismissBanner() {
    navigate(
      {
        pathname: location.pathname,
        search: stripCheckoutParams(location.search),
      },
      { replace: true }
    );
  }

  // App-lenke: normal vs checkout-return
  const appHrefDefault = buildAppHref({ from: "website" });
  const appHrefFromCheckout = buildAppHref(
    success
      ? { from: "checkout", success: "1", refresh: "1" }
      : canceled
      ? { from: "checkout", canceled: "1" }
      : { from: "website" }
  );

  const banner = (() => {
    if (!showCheckoutBanner) return null;

    const baseStyle: React.CSSProperties = {
      marginTop: "0.9rem",
      padding: "0.75rem 0.9rem",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.14)",
      background: "rgba(255,255,255,0.06)",
      display: "flex",
      gap: 12,
      alignItems: "center",
      justifyContent: "space-between",
      maxWidth: 980,
    };

    const msg = success ? bannerSuccessMsg : bannerCanceledMsg;

    return (
      <div style={baseStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontWeight: 800 }}>{msg}</div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {isExternalUrl(PROGRESS_APP_URL) ? (
              <a
                className="hero-cta"
                href={appHrefFromCheckout}
                style={{ textDecoration: "none" }}
              >
                {openApp}
              </a>
            ) : (
              <Link
                className="hero-cta"
                to={appHrefFromCheckout}
                style={{ textDecoration: "none" }}
              >
                {openApp}
              </Link>
            )}

            {canceled && (
              <button
                type="button"
                onClick={() => {
                  dismissBanner();
                  openBuy();
                }}
                style={outlineBtnStyle}
              >
                {bannerTryAgain}
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={dismissBanner}
          aria-label={bannerDismissAria}
          style={{
            padding: "0.45rem 0.65rem",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
            flex: "0 0 auto",
          }}
        >
          ✕
        </button>
      </div>
    );
  })();

  return (
    <main className="page">
      <section className="fs-hero">
        <h1>{title}</h1>
        <p className="fs-tagline" style={{ maxWidth: 980 }}>
          {lead}
        </p>

        {banner}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8rem",
            marginTop: "1rem",
            alignItems: "center",
          }}
        >
          {isExternalUrl(PROGRESS_APP_URL) ? (
            <a
              className="hero-cta"
              href={appHrefDefault}
              style={{ textDecoration: "none" }}
            >
              {openApp}
            </a>
          ) : (
            <Link className="hero-cta" to={appHrefDefault}>
              {openApp}
            </Link>
          )}
        </div>
      </section>

      <section className="intro-grid two-columns" style={{ marginTop: 0 }}>
        {/* FREE */}
        <div className="intro-card">
          <h3 style={{ marginTop: 0 }}>{freeTitle}</h3>
          <p>{freeLead}</p>

          <strong style={{ display: "block", marginTop: "0.75rem" }}>
            {freeWhatTitle}
          </strong>

          <ul style={{ marginTop: "0.6rem", paddingLeft: "1.25rem" }}>
            {freeWhat.map((x) => (
              <li key={x} style={{ marginBottom: "0.35rem" }}>
                {x}
              </li>
            ))}
          </ul>

          <div
            style={{
              marginTop: "1rem",
              paddingTop: "0.9rem",
              borderTop: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <strong style={{ display: "block", marginBottom: 6 }}>
              {trialTitle}
            </strong>
            <p style={{ margin: 0, opacity: 0.92 }}>{trialBody}</p>

            <div style={{ marginTop: "0.75rem" }}>
              <button
                type="button"
                onClick={openTrial}
                style={outlineBtnStyle}
              >
                {startTrialLabel}
              </button>
            </div>
          </div>
        </div>

        {/* FULL VERSION */}
        <div className="intro-card">
          <h3 style={{ marginTop: 0 }}>{proTitle}</h3>
          <p style={{ marginTop: "0.75rem" }}>{proLead}</p>

          <strong style={{ display: "block", marginTop: "0.75rem" }}>
            {proWhatTitle}
          </strong>

          <ul style={{ marginTop: "0.6rem", paddingLeft: "1.25rem" }}>
            {proWhat.map((x) => (
              <li key={x} style={{ marginBottom: "0.35rem" }}>
                {x}
              </li>
            ))}
          </ul>

          {/* Price + Buy at bottom */}
          <div
            style={{
              marginTop: "1rem",
              paddingTop: "0.9rem",
              borderTop: "1px solid rgba(255,255,255,0.10)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div>
              <div style={{ fontWeight: 800 }}>{priceHeader}</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>{priceLine}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{introNote}</div>
            </div>

            <div>
              <button type="button" onClick={openBuy} style={outlineBtnStyle}>
                {buyLabel}
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <p style={{ margin: 0, opacity: 0.85 }}>{footerNote}</p>
        </div>
      </section>

      <PaywallModal
        open={paywallOpen}
        mode={paywallMode}
        onClose={() => setPaywallOpen(false)}
        lang={lang}
        workerBaseUrl={WORKER_BASE_URL}
        priceMonthExVat={PRO_MONTH_EX_VAT}
        priceYearExVat={PRO_YEAR_EX_VAT}
        vatRate={VAT_RATE}
        currency={CURRENCY}
      />
    </main>
  );
};

export default ProgressPricingPage;
