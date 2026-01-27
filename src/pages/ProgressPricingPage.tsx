import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import PaywallModal from "../components/PaywallModal";

// Eksterne lenker tilbake til Morning Coffee Labs (HashRouter)
const MCL_ORIGIN = "https://morningcoffeelabs.no";
function mclHref(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${MCL_ORIGIN}/#${p}`;
}

// Worker base (kan overstyres via env)
const DEFAULT_WORKER_BASE = "https://gentle-wildflower-980e.morningcoffeelabs.workers.dev";
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
  const { lang } = useI18n();
  const isNo = lang === "no";

  const location = useLocation();
  const navigate = useNavigate();

  const sp = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const from = sp.get("from") || "";
  const success = sp.get("success") === "1";
  const canceled = sp.get("canceled") === "1";

  const showCheckoutBanner = from === "checkout" && (success || canceled);

  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallMode, setPaywallMode] = useState<"trial" | "buy">("buy");

  const title = isNo ? "Priser og lisens" : "Pricing & license";
  const lead = isNo
    ? "Velg nivået som passer. Du kan starte gratis og oppgradere når du vil."
    : "Choose the level that fits. Start free and upgrade anytime.";

  // Renaming
  const freeTitle = isNo ? "Gratisversjon" : "Free version";
  const proTitle = isNo ? "Fullversjon" : "Full version";

  const freeLead = isNo
    ? "Start uten friksjon. Gratisversjonen krever ingen registrering – du kan åpne Progress og planlegge med en gang."
    : "Start with zero friction. The free version requires no registration — open Progress and plan immediately.";

  const proLead = isNo
    ? "For deg som bruker Progress jevnlig – spesielt hvis du jobber i flere prosjekter samtidig og vil ha full flyt med skylagring og eksport."
    : "For regular use — especially if you work across multiple projects and want the full workflow with cloud storage and exports.";

  const freeWhatYouGetTitle = isNo ? "Dette får du i gratisversjonen" : "What you get in the free version";
  const freeWhatYouGet = isNo
    ? [
        "Lokal lagring, begrenset til ett prosjekt av gangen",
        "Utskrift / PDF-eksport med vannmerke",
        "Import av prosjekter eksportert fra Fullversjon-brukere",
      ]
    : [
        "Local storage, limited to one project at a time",
        "Print / PDF export with watermark",
        "Import projects exported by full-version users",
      ];

  const trialTitle = isNo ? "Prøv Fullversjon gratis i 10 dager" : "Try Full version free for 10 days";
  const trialBody = isNo
    ? "Du kan teste full funksjonalitet i 10 dager – helt gratis. Det eneste du trenger å gjøre er å registrere deg."
    : "You can test full functionality for 10 days — completely free. All you need to do is register.";

  const proWhatYouGetTitle = isNo ? "Dette får du i fullversjonen" : "What you get in the full version";
  const proWhatYouGet = isNo
    ? [
        "Alt i gratisversjonen",
        "Skylagring av flere prosjekter",
        "Utskrift / PDF uten vannmerke",
        "Eksport av prosjekter (lagre lokalt hvor du vil) – åpne senere eller del med andre",
        "Eksport til .TSV",
        "Lisens for profesjonell bruk",
      ]
    : [
        "Everything in the free version",
        "Cloud storage for multiple projects",
        "Print / PDF with no watermark",
        "Project export (save anywhere locally) — reopen later or share with others",
        ".TSV export",
        "License for professional use",
      ];

  const introNote = isNo
    ? "Introduksjonspris for tidlige brukere. Denne prisen beholdes så lenge lisensen er aktiv."
    : "Introductory price for early users. This price is kept for as long as the license remains active.";

  const footerNote = isNo
    ? "Progress videreutvikles fortløpende. Nye funksjoner kan på sikt danne grunnlag for et utvidet lisensutvalg. Fullversjonen vil under ingen omstendigheter miste funksjonalitet."
    : "Progress will continue to evolve. New features may later support an expanded license structure. The full version will never lose functionality.";

  const openApp = isNo ? "Åpne Progress-appen" : "Open the Progress app";

  const buyLabel = isNo ? "Kjøp lisens for Fullversjon" : "Buy Full version license";
  const startTrialLabel = isNo ? "Start prøveperiode →" : "Start trial →";

  const priceHeader = isNo ? "Pris" : "Price";
  const priceLine = isNo
    ? `${PRO_MONTH_EX_VAT} kr/mnd eller ${PRO_YEAR_EX_VAT} kr/år (eks. mva)`
    : `${PRO_MONTH_EX_VAT} NOK/mo or ${PRO_YEAR_EX_VAT} NOK/yr (ex. VAT)`;

  function openTrial() {
    setPaywallMode("trial");
    setPaywallOpen(true);
  }
  function openBuy() {
    setPaywallMode("buy");
    setPaywallOpen(true);
  }

  function dismissBanner() {
    navigate({ pathname: location.pathname, search: stripCheckoutParams(location.search) }, { replace: true });
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

    const msg = success
      ? isNo
        ? "✅ Betaling registrert. Åpne appen – status oppdateres automatisk (evt. etter en refresh)."
        : "✅ Payment registered. Open the app — status updates automatically (sometimes after a refresh)."
      : isNo
      ? "↩️ Kjøpet ble avbrutt. Du er ikke oppgradert."
      : "↩️ Checkout was canceled. You were not upgraded.";

    return (
      <div style={baseStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontWeight: 800 }}>{msg}</div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {isExternalUrl(PROGRESS_APP_URL) ? (
              <a className="hero-cta" href={appHrefFromCheckout} style={{ textDecoration: "none" }}>
                {openApp}
              </a>
            ) : (
              <Link className="hero-cta" to={appHrefFromCheckout} style={{ textDecoration: "none" }}>
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
                {isNo ? "Prøv igjen" : "Try again"}
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={dismissBanner}
          aria-label={isNo ? "Lukk melding" : "Dismiss"}
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
            <a className="hero-cta" href={appHrefDefault} style={{ textDecoration: "none" }}>
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

          <strong style={{ display: "block", marginTop: "0.75rem" }}>{freeWhatYouGetTitle}</strong>

          <ul style={{ marginTop: "0.6rem", paddingLeft: "1.25rem" }}>
            {freeWhatYouGet.map((x) => (
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
            <strong style={{ display: "block", marginBottom: 6 }}>{trialTitle}</strong>
            <p style={{ margin: 0, opacity: 0.92 }}>{trialBody}</p>

            <div style={{ marginTop: "0.75rem" }}>
              <button type="button" onClick={openTrial} style={outlineBtnStyle}>
                {startTrialLabel}
              </button>
            </div>
          </div>
        </div>

        {/* FULL VERSION */}
        <div className="intro-card">
          <h3 style={{ marginTop: 0 }}>{proTitle}</h3>
          <p style={{ marginTop: "0.75rem" }}>{proLead}</p>

          <strong style={{ display: "block", marginTop: "0.75rem" }}>{proWhatYouGetTitle}</strong>

          <ul style={{ marginTop: "0.6rem", paddingLeft: "1.25rem" }}>
            {proWhatYouGet.map((x) => (
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
