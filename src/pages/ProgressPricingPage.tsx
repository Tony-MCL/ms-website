import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import PaywallModal from "../components/PaywallModal";

// Eksterne lenker tilbake til Morning Coffee Labs (HashRouter)
const MCL_ORIGIN = "https://morningcoffeelabs.no";
function mclHref(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${MCL_ORIGIN}/#${p}`;
}

// Worker base (kan overstyres via env)
const DEFAULT_WORKER_BASE =
  "https://gentle-wildflower-980e.morningcoffeelabs.workers.dev";
const WORKER_BASE_URL =
  (import.meta as any).env?.VITE_PROGRESS_WORKER_BASE_URL || DEFAULT_WORKER_BASE;

// Intropriser (eks mva)
const PRO_MONTH_EX_VAT = 129;
const PRO_YEAR_EX_VAT = 1290;

// MVA for visning i modal
const VAT_RATE = 0.25;
const CURRENCY = "NOK";

const ProgressPricingPage: React.FC = () => {
  const { lang } = useI18n();
  const isNo = lang === "no";

  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallMode, setPaywallMode] = useState<"trial" | "buy">("buy");

  const title = isNo ? "Priser og lisens" : "Pricing & license";
  const lead = isNo
    ? "Velg nivået som passer. Du kan starte gratis og oppgradere når du vil."
    : "Choose the level that fits. Start free and upgrade anytime.";

  const freeTitle = "Free";
  const proTitle = "Pro";

  const freeLead = isNo
    ? "Start uten friksjon. Free krever ingen registrering – du kan åpne Progress og planlegge med en gang."
    : "Start with zero friction. Free requires no registration — open Progress and plan immediately.";

  const proLead = isNo
    ? "For deg som bruker Progress jevnlig – spesielt hvis du jobber i flere prosjekter samtidig og vil ha full flyt med skylagring og eksport."
    : "For regular use — especially if you work across multiple projects and want the full workflow with cloud storage and exports.";

  const freeWhatYouGetTitle = isNo ? "Dette får du i Free" : "What you get in Free";
  const freeWhatYouGet = isNo
    ? [
        "Lokal lagring, begrenset til ett prosjekt av gangen",
        "Utskrift / PDF-eksport med vannmerke",
        "Import av prosjekter eksportert fra Pro-brukere",
      ]
    : [
        "Local storage, limited to one project at a time",
        "Print / PDF export with watermark",
        "Import projects exported by Pro users",
      ];

  const trialTitle = isNo ? "Prøv Pro gratis i 10 dager" : "Try Pro free for 10 days";
  const trialBody = isNo
    ? "Du kan teste full Pro-funksjonalitet i 10 dager – helt gratis. Det eneste du trenger å gjøre er å registrere deg med e-postadresse."
    : "You can test full Pro functionality for 10 days — completely free. The only thing you need is to register with an email address.";

  const proWhatYouGetTitle = isNo ? "Dette får du i Pro" : "What you get in Pro";
  const proWhatYouGet = isNo
    ? [
        "Alt i Free",
        "Skylagring av flere prosjekter",
        "Utskrift / PDF uten vannmerke",
        "Eksport av prosjekter (lagre lokalt hvor du vil) – åpne senere eller del med andre",
        "Eksport til .TSV",
        "Lisens for profesjonell bruk",
      ]
    : [
        "Everything in Free",
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
    ? "Progress videreutvikles fortløpende. Nye funksjoner kan på sikt danne grunnlag for et utvidet lisensutvalg. Pro vil under ingen omstendigheter miste funksjonalitet."
    : "Progress will continue to evolve. New features may later support an expanded license structure. Pro will never lose functionality.";

  const back = isNo ? "← Tilbake til Progress" : "← Back to Progress";
  const openApp = isNo ? "Åpne Progress-appen" : "Open the Progress app";
  const contact = isNo ? "Kontakt oss →" : "Contact us →";

  const buyLabel = isNo ? "Kjøp Pro-lisens" : "Buy Pro license";
  const startTrialLabel = isNo ? "Start trial →" : "Start trial →";

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

  return (
    <main className="page">
      <section className="fs-hero">
        <h1>{title}</h1>
        <p className="fs-tagline" style={{ maxWidth: 980 }}>
          {lead}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8rem",
            marginTop: "1rem",
            alignItems: "center",
          }}
        >
          <Link className="hero-cta" to="/progress/app">
            {openApp}
          </Link>

          <a
            href={mclHref("/kontakt")}
            style={{ textDecoration: "underline", fontWeight: 600 }}
          >
            {contact}
          </a>

          <Link
            to="/progress"
            style={{ textDecoration: "underline", fontWeight: 600 }}
          >
            {back}
          </Link>
        </div>
      </section>

      <section className="intro-grid two-columns" style={{ marginTop: 0 }}>
        {/* FREE */}
        <div className="intro-card">
          <h3 style={{ marginTop: 0 }}>{freeTitle}</h3>
          <p>{freeLead}</p>

          <strong style={{ display: "block", marginTop: "0.75rem" }}>
            {freeWhatYouGetTitle}
          </strong>

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
            <strong style={{ display: "block", marginBottom: 6 }}>
              {trialTitle}
            </strong>
            <p style={{ margin: 0, opacity: 0.92 }}>{trialBody}</p>

            <div style={{ marginTop: "0.75rem" }}>
              <button
                type="button"
                onClick={openTrial}
                style={{
                  padding: "0.6rem 0.9rem",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "transparent",
                  color: "inherit",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                {startTrialLabel}
              </button>
            </div>
          </div>
        </div>

        {/* PRO */}
        <div className="intro-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <h3 style={{ marginTop: 0, marginBottom: 0 }}>{proTitle}</h3>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700 }}>{priceHeader}</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>{priceLine}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{introNote}</div>
            </div>
          </div>

          <p style={{ marginTop: "0.75rem" }}>{proLead}</p>

          <strong style={{ display: "block", marginTop: "0.75rem" }}>
            {proWhatYouGetTitle}
          </strong>

          <ul style={{ marginTop: "0.6rem", paddingLeft: "1.25rem" }}>
            {proWhatYouGet.map((x) => (
              <li key={x} style={{ marginBottom: "0.35rem" }}>
                {x}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "1rem" }}>
            <button
              type="button"
              onClick={openBuy}
              className="hero-cta"
              style={{
                border: "none",
                cursor: "pointer",
              }}
            >
              {buyLabel}
            </button>
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
