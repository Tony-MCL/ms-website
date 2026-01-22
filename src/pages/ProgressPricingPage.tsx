import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

// Eksterne lenker tilbake til Morning Coffee Labs (HashRouter)
const MCL_ORIGIN = "https://morningcoffeelabs.no";
function mclHref(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${MCL_ORIGIN}/#${p}`;
}

// TODO: Sett inn faktisk checkout-lenke når den er klar
const CHECKOUT_URL = "#";

// TODO: Juster priser når dere har landet endelig nivå
const PRICE_PRO_NO = "199 NOK / bruker / måned";
const PRICE_PRO_EN = "199 NOK / user / month";

const ProgressPricingPage: React.FC = () => {
  const { lang } = useI18n();
  const isNo = lang === "no";
  const disabled = CHECKOUT_URL === "#";

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
    ? "For deg som bruker Progress jevnlig og vil ha full flyt med skylagring og eksport."
    : "For regular use with full workflow, cloud storage, and exports.";

  const freeWhatYouGetTitle = isNo ? "Dette får du i Free" : "What you get in Free";
  const freeWhatYouGet = isNo
    ? [
        "Lokal lagring, begrenset til ett prosjekt av gangen",
        "Utskrift / pdf-eksport med vannmerke",
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
        "Skylagring av “ubegrenset” antall prosjekter",
        "Utskrift / PDF uten vannmerke",
        "Eksport av prosjekter (lagre lokalt hvor du vil) – åpne senere eller del med andre",
        "Eksport til .TSV",
        "Lisens for profesjonell bruk",
      ]
    : [
        "Everything in Free",
        "Cloud storage for a “unlimited” number of projects",
        "Print / PDF with no watermark",
        "Project export (save anywhere locally) — reopen later or share with others",
        ".TSV export",
        "License for professional use",
      ];

  const buyLabel = isNo ? "Kjøp Pro-lisens" : "Buy Pro license";
  const soon = isNo ? "Kommer snart" : "Coming soon";

  const note = isNo
    ? "Priser og endelig innhold i Pro kan justeres frem mot lansering. Målet er enkelhet, ikke forvirring."
    : "Pricing and final Pro scope may be adjusted before launch. The goal is simplicity, not complexity.";

  const back = isNo ? "← Tilbake til Progress" : "← Back to Progress";
  const openApp = isNo ? "Åpne Progress-appen" : "Open the Progress app";
  const contact = isNo ? "Kontakt oss →" : "Contact us →";

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
          </div>
        </div>

        {/* PRO */}
        <div className="intro-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <h3 style={{ marginTop: 0, marginBottom: 0 }}>{proTitle}</h3>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700 }}>
                {isNo ? PRICE_PRO_NO : PRICE_PRO_EN}
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {isNo ? "Lisens per bruker" : "Per-user license"}
              </div>
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
            <a
              className="hero-cta"
              href={CHECKOUT_URL}
              style={{
                opacity: disabled ? 0.6 : 1,
                pointerEvents: disabled ? "none" : "auto",
                display: "inline-block",
              }}
              aria-disabled={disabled ? "true" : undefined}
              title={disabled ? soon : undefined}
            >
              {buyLabel}
              {disabled ? ` · ${soon}` : ""}
            </a>

            <div style={{ marginTop: "0.6rem", fontSize: 13, opacity: 0.85 }}>
              {isNo
                ? "Kjøp åpner checkout og aktiverer Pro på lisensen."
                : "Purchase opens checkout and activates Pro on the license."}
            </div>
          </div>
        </div>

        {/* NOTE */}
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <p style={{ margin: 0, opacity: 0.85 }}>{note}</p>
        </div>
      </section>
    </main>
  );
};

export default ProgressPricingPage;
