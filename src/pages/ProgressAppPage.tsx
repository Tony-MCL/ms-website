import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

// TODO: Sett inn faktisk URL til Progress-appen når den er klar
// Eksempel senere: "https://progress.managesystem.no" eller tilsvarende
const PROGRESS_APP_URL = "#";

const ProgressAppPage: React.FC = () => {
  const { lang } = useI18n();
  const isNo = lang === "no";
  const disabled = PROGRESS_APP_URL === "#";

  const title = isNo ? "Progress-appen" : "The Progress app";
  const lead = isNo
    ? "Herfra går du direkte til selve Progress-appen. Denne siden fungerer også som et stabilt “inngangspunkt” du kan linke til fra andre steder."
    : "From here you can open the Progress app directly. This page also serves as a stable entry-point you can link to from elsewhere.";

  const open = isNo ? "Åpne Progress" : "Open Progress";
  const soon = isNo ? "Kommer snart" : "Coming soon";

  const back = isNo ? "← Tilbake til Progress" : "← Back to Progress";
  const pricing = isNo ? "Se priser og lisens" : "Pricing & license";

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
          <a
            className="hero-cta"
            href={PROGRESS_APP_URL}
            style={{
              opacity: disabled ? 0.6 : 1,
              pointerEvents: disabled ? "none" : "auto",
            }}
            aria-disabled={disabled ? "true" : undefined}
            title={disabled ? soon : undefined}
          >
            {open}
            {disabled ? ` · ${soon}` : ""}
          </a>

          <Link
            to="/progress/priser"
            style={{ textDecoration: "underline", fontWeight: 600 }}
          >
            {pricing}
          </Link>

          <Link
            to="/progress"
            style={{ textDecoration: "underline", fontWeight: 600 }}
          >
            {back}
          </Link>
        </div>
      </section>

      <section className="intro-grid two-columns" style={{ marginTop: 0 }}>
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>
            {isNo ? "Når appen er klar" : "When the app is ready"}
          </h3>
          <p style={{ marginBottom: 0 }}>
            {isNo
              ? "Når dere har valgt endelig app-URL, bytter vi bare ut PROGRESS_APP_URL i denne fila – så vil alle lenker fungere uten å endre resten av siden."
              : "Once you’ve decided the final app URL, you only replace PROGRESS_APP_URL in this file — and all links work without changing the rest of the page."}
          </p>
        </div>
      </section>
    </main>
  );
};

export default ProgressAppPage;
