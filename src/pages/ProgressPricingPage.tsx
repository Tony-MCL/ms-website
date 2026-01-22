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
    ? "Velg nivået som passer. Du kan starte gratis, teste flyt, og oppgradere når du vil."
    : "Choose the level that fits. Start free, test the workflow, and upgrade anytime.";

  const freeTitle = "Free";
  const proTitle = "Pro";

  const freeLead = isNo
    ? "For deg som vil planlegge uten å betale – og fortsatt få en ryddig plan."
    : "For planning at no cost — still clean and usable.";

  const proLead = isNo
    ? "For deg som bruker Progress jevnlig og vil ha full funksjonalitet og flyt."
    : "For regular use with full functionality and a smoother workflow.";

  const freeWhatYouGetTitle = isNo ? "Dette får du i Free" : "What you get in Free";
  const freeWhatYouGet = isNo
    ? ["Full planlegging i tabell og Gantt", "Kan åpne prosjekter andre har eksportert"]
    : ["Full planning in table + Gantt", "Can open projects exported by others"];

  const freeLimitsTitle = isNo ? "Begrensninger i Free" : "Free limitations";
  const freeLimits = isNo
    ? [
        "Kun lokal lagring av ett prosjekt om gangen",
        "Utskrift / PDF-eksport med vannmerke",
        "Kan åpne eksporterte prosjekter, men kan ikke eksportere selv",
        "Ingen eksport til .TSV",
      ]
    : [
        "Local-only storage of one project at a time",
        "Print / PDF export with watermark",
        "Can open exported projects, but cannot export your own",
        "No .TSV export",
      ];

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

  const trialTitle = isNo ? "Trial / prøvetid" : "Trial period";
  const trialBody = isNo
    ? "Vi kan tilby en kort Pro-prøvetid for å teste skylagring, eksport og utskrift i egne prosjekter før kjøp."
    : "We can offer a short Pro trial so you can test cloud storage, exports, and printing in real projects before purchase.";
  const trialHint = isNo
    ? "Dette aktiveres når checkout og lisensflyt er helt klar."
    : "This will be enabled once checkout and the license flow are fully ready.";

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

          <strong style={{ display: "block", marginTop: "0.9rem" }}>
            {freeLimitsTitle}
          </strong>
          <ul style={{ marginTop: "0.6rem", paddingLeft: "1.25rem", opacity: 0.92 }}>
            {freeLimits.map((x) => (
              <li key={x} style={{ marginBottom: "0.35rem" }}>
                {x}
              </li>
            ))}
          </ul>
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

        {/* TRIAL (full bredde) */}
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{trialTitle}</h3>
          <p style={{ marginBottom: "0.75rem" }}>{trialBody}</p>
          <p style={{ margin: 0, opacity: 0.85 }}>{trialHint}</p>
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
