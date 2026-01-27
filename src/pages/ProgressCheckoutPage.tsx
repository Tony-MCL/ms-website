import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ProgressCheckoutPage: React.FC = () => {
  const { lang } = useI18n();
  const isNo = lang === "no";
  const q = useQuery();

  const success = q.get("success") === "1";
  const canceled = q.get("canceled") === "1";

  const title = success
    ? isNo ? "Kjøp fullført 🎉" : "Purchase completed 🎉"
    : canceled
    ? isNo ? "Kjøp avbrutt" : "Purchase canceled"
    : isNo ? "Status" : "Status";

  const body = success
    ? isNo
      ? "Du er nå oppgradert til Pro. Hvis statusen ikke oppdateres umiddelbart, gjør en refresh i appen."
      : "You are now upgraded to Pro. If the status doesn’t update immediately, refresh the app."
    : canceled
    ? isNo
      ? "Kjøpet ble avbrutt. Du kan prøve igjen når du vil."
      : "The purchase was canceled. You can try again anytime."
    : isNo
      ? "Vi fant ingen status i lenken. Gå tilbake til priser og prøv igjen."
      : "No status found in the link. Go back to pricing and try again.";

  const primaryHref = success ? "/progress" : "/progress/priser";
  const primaryText = success
    ? isNo ? "Åpne Progress" : "Open Progress"
    : isNo ? "Til priser" : "Back to pricing";

  const secondaryHref = canceled ? "/progress/priser?openPaywall=1" : "/progress/priser";
  const secondaryText = canceled
    ? isNo ? "Prøv igjen" : "Try again"
    : isNo ? "Se priser" : "See pricing";

  return (
    <main className="page" style={{ minHeight: "calc(100vh - var(--header-height))" }}>
      <section
        style={{
          minHeight: "calc(100vh - var(--header-height))",
          display: "grid",
          placeItems: "center",
          padding: "2rem 1rem",
        }}
      >
        <div
          style={{
            width: "min(720px, 100%)",
            borderRadius: 16,
            border: "1px solid var(--mcl-border)",
            background: "var(--mcl-surface)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
            padding: "1.2rem",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 22 }}>{title}</h1>
          <p style={{ marginTop: 10, marginBottom: 0, color: "var(--mcl-text-dim)", lineHeight: 1.45 }}>
            {body}
          </p>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              to={primaryHref}
              className="btn"
              style={{
                textDecoration: "none",
                padding: "0.75rem 1rem",
                borderRadius: 12,
                border: "1px solid var(--mcl-border)",
                background: "rgba(255,255,255,0.10)",
                fontWeight: 800,
                color: "var(--mcl-text)",
              }}
            >
              {primaryText}
            </Link>

            <Link
              to={secondaryHref}
              className="btn"
              style={{
                textDecoration: "none",
                padding: "0.75rem 1rem",
                borderRadius: 12,
                border: "1px solid var(--mcl-border)",
                background: "transparent",
                fontWeight: 800,
                color: "var(--mcl-text)",
              }}
            >
              {secondaryText}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProgressCheckoutPage;
