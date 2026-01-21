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

const ProgressPricingPage: React.FC = () => {
  const { lang } = useI18n();
  const isNo = lang === "no";
  const disabled = CHECKOUT_URL === "#";

  const title = isNo ? "Priser og lisens" : "Pricing & license";
  const lead = isNo
    ? "Velg nivået som passer. Du kan starte gratis og oppgradere når du vil."
    : "Choose the level that fits. Start free and upgrade anytime.";

  const freeTitle = isNo ? "Free" : "Free";
  const proTitle = isNo ? "Pro" : "Pro";

  const freeLead = isNo
    ? "For deg som vil planlegge uten å betale – og fortsatt få en ryddig plan."
    : "For planning at no cost — still clean and usable.";

  const proLead = isNo
    ? "For deg som bruker Progress jevnlig og vil ha full funksjonalitet."
    : "For regular use and full functionality.";

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

  const proList = isNo
    ? [
        "Alt i Free",
        "Lisens for profesjonell bruk",
        "Bedre flyt for deling, eksport og arbeid i større planer",
      ]
    : [
        "Everything in Free",
        "License for professional use",
        "Smoother workflow for sharing, exports, and larger plans",
      ];

  const note = isNo
    ? "Priser og endelig innhold i Pro kan justeres frem mot lansering. Målet er enkelhet, ikke forvirring."
    : "Pricing and final Pro scope may be adjusted before launch. The goal is simplicity, not complexity.";

  const buyLabel = isNo ? "Kjøp Pro-lisens" : "Buy Pro license";
  const soon = isNo ? "Kommer snart" : "Coming soon";

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
        </div>

        <div className="intro-card">
          <h3 style={{ marginTop: 0 }}>{proTitle}</h3>
          <p>{proLead}</p>
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
              }}
              aria-disabled={disabled ? "true" : undefined}
              title={disabled ? soon : undefined}
            >
              {buyLabel}
              {disabled ? ` · ${soon}` : ""}
            </a>
          </div>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <p style={{ margin: 0, opacity: 0.85 }}>{note}</p>
        </div>
      </section>
    </main>
  );
};

export default ProgressPricingPage;
