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
    ? "Velg nivået som passer. Du kan starte gratis, teste Pro, og oppgradere når du vil."
    : "Choose the level that fits. Start free, try Pro, and upgrade anytime.";

  const freeTitle = isNo ? "Free" : "Free";
  const proTitle = isNo ? "Pro" : "Pro";

  const freeLead = isNo
    ? "For deg som vil planlegge uten å betale – og fortsatt få en ryddig plan."
    : "For planning at no cost — still clean and usable.";

  const proLead = isNo
    ? "For deg som bruker Progress jevnlig og vil ha full funksjonalitet."
    : "For regular use and full functionality.";

  // Free: “hva du får”
  const freeList = isNo
    ? [
        "Full planlegging i tabell og Gantt",
        "Utskrift / eksport som grunnfunksjon",
        "Perfekt for å teste flyt og metode",
      ]
    : [
        "Full planning in table + Gantt",
        "Print/export as a core capability",
        "Perfect for testing workflow and method",
      ];

  // Free: “restriksjoner vs Pro”
  const freeLimitsTitle = isNo ? "Begrensninger i Free" : "Free limitations";
  const freeLimits = isNo
    ? [
        "Vannmerke på utskrift / deling",
        "Begrensninger i avanserte funksjoner (Pro låser opp alt)",
        "Egnet for enkel planlegging – Pro for profesjonell bruk",
      ]
    : [
        "Watermark on print / sharing",
        "Limitations in advanced features (Pro unlocks everything)",
        "Great for simple planning — Pro for professional use",
      ];

  // Pro: “hva du får”
  const proList = isNo
    ? [
        "Alt i Free",
        "Lisens for profesjonell bruk",
        "Bedre flyt for deling, eksport og arbeid i større planer",
        "Ingen vannmerke",
      ]
    : [
        "Everything in Free",
        "License for professional use",
        "Smoother workflow for sharing, exports, and larger plans",
        "No watermark",
      ];

  const note = isNo
    ? "Priser og endelig innhold i Pro kan justeres frem mot lansering. Målet er enkelhet, ikke forvirring."
    : "Pricing and final Pro scope may be adjusted before launch. The goal is simplicity, not complexity.";

  const buyLabel = isNo ? "Kjøp Pro-lisens" : "Buy Pro license";
  const soon = isNo ? "Kommer snart" : "Coming soon";

  const back = isNo ? "← Tilbake til Progress" : "← Back to Progress";
  const openApp = isNo ? "Åpne Progress-appen" : "Open the Progress app";
  const contact = isNo ? "Kontakt oss →" : "Contact us →";

  // Trial card copy (lett å justere)
  const trialTitle = isNo ? "Trial / prøvetid" : "Trial period";
  const trialBody = isNo
    ? "Hvis dere ønsker det, kan dere tilby en kort Pro-prøvetid før kjøp. Da kan teamet teste flyt og utskrift i egne prosjekter — før dere bestemmer dere."
    : "If you want, you can offer a short Pro trial before purchase. This lets the team test the workflow and printing in real projects — before deciding.";

  const trialHint = isNo
    ? "Dette kan aktiveres senere når checkout og lisensflyt er helt klar."
    : "This can be enabled later once checkout and the license flow are fully ready.";

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

          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem" }}>
            {freeList.map((x) => (
              <li key={x} style={{ marginBottom: "0.35rem" }}>
                {x}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "1rem" }}>
            <strong style={{ display: "block", marginBottom: 8 }}>
              {freeLimitsTitle}
            </strong>
            <ul style={{ margin: 0, paddingLeft: "1.25rem", opacity: 0.92 }}>
              {freeLimits.map((x) => (
                <li key={x} style={{ marginBottom: "0.35rem" }}>
                  {x}
                </li>
              ))}
            </ul>
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

          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem" }}>
            {proList.map((x) => (
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
