import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { LINKS } from "../config/links";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ProgressCheckoutPage: React.FC = () => {
  const { t } = useI18n();
  const q = useQuery();

  const success = q.get("success") === "1";
  const canceled = q.get("canceled") === "1";

  const titleKey = success
    ? "checkout.titleSuccess"
    : canceled
    ? "checkout.titleCanceled"
    : "checkout.titleDefault";

  const bodyKey = success
    ? "checkout.bodySuccess"
    : canceled
    ? "checkout.bodyCanceled"
    : "checkout.bodyDefault";

  const primaryHref = success ? LINKS.progress : "/progress/priser";
  const primaryTextKey = success
    ? "checkout.primaryOpenProgress"
    : "checkout.primaryToPricing";

  const secondaryHref = canceled
    ? "/progress/priser?openPaywall=1"
    : "/progress/priser";
  const secondaryTextKey = canceled
    ? "checkout.secondaryTryAgain"
    : "checkout.secondarySeePricing";

  return (
    <main
      className="page"
      style={{ minHeight: "calc(100vh - var(--header-height))" }}
    >
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
          <h1 style={{ margin: 0, fontSize: 22 }}>{t(titleKey)}</h1>
          <p
            style={{
              marginTop: 10,
              marginBottom: 0,
              color: "var(--mcl-text-dim)",
              lineHeight: 1.45,
            }}
          >
            {t(bodyKey)}
          </p>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {success ? (
              <a
                href={primaryHref}
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
              {t(primaryTextKey)}
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
              {t(secondaryTextKey)}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProgressCheckoutPage;
