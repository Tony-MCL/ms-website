import React, { useMemo, useState } from "react";
import { useI18n } from "../i18n/useI18n";
import { LINKS } from "../config/links";

type Pair = {
  factTitle: string;
  factBody: string;
  imgAlt: string;
  imgCaption: string;
};

const assetBase = import.meta.env.BASE_URL || "/";

const ProgressOverviewPage: React.FC = () => {
  const { t } = useI18n();

  // i18n
  const title = t<string>("progressOverview.title");
  const lead = t<string>("progressOverview.lead");
  const tryFreeCta = t<string>("progressOverview.tryFreeCta");
  const closeLabel = t<string>("progressOverview.closeLabel");
  const imageViewerLabel = t<string>("progressOverview.imageViewerLabel");
  const screenshotLabel = t<string>("progressOverview.screenshotLabel");
  const missingTitle = t<string>("progressOverview.missingTitle");
  const missingBodyPrefix = t<string>("progressOverview.missingBodyPrefix");

  const pairs = useMemo(() => {
    const raw = t<Pair[]>("progressOverview.pairs") || [];
    return raw.map((p, idx) => ({
      ...p,
      imgSrc: `${assetBase}progress/progress-0${idx + 1}.png`,
    }));
  }, [t]);

  // Lightbox state
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [missing, setMissing] = useState<Record<number, boolean>>({});

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
          <a className="hero-cta" href={LINKS.progress} rel="noopener noreferrer">
            {tryFreeCta}
          </a>
        </div>
      </section>

      {/* Kombinert: fakta ↔ bilde ↔ fakta ↔ bilde */}
      <section className="intro-grid two-columns" style={{ marginTop: 0 }}>
        {pairs.map((p: any, idx: number) => {
          const isMissing = !!missing[idx];

          const factCard = (
            <div className="intro-card" key={`fact-${idx}`}>
              <h3 style={{ marginTop: 0 }}>{p.factTitle}</h3>
              <p style={{ marginBottom: 0 }}>{p.factBody}</p>
            </div>
          );

          const imageCard = (
            <button
              key={`img-${idx}`}
              type="button"
              className="intro-card"
              onClick={() => setOpenIndex(idx)}
              style={{
                textAlign: "left",
                cursor: "pointer",
                padding: "1rem",
                border: "none",
                background: "var(--card-bg, rgba(255,255,255,0.06))",
              }}
            >
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.06)",
                  aspectRatio: "16 / 9",
                  width: "100%",
                }}
              >
                {!isMissing ? (
                  <img
                    src={p.imgSrc}
                    alt={p.imgAlt}
                    loading="lazy"
                    onError={() => setMissing((prev) => ({ ...prev, [idx]: true }))}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "1rem",
                      opacity: 0.85,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ maxWidth: 520 }}>
                      <strong style={{ display: "block", marginBottom: 8 }}>
                        {missingTitle}
                      </strong>
                      <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                        {missingBodyPrefix}{" "}
                        <code>{`public/progress/progress-0${idx + 1}.png`}</code>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p style={{ marginTop: "0.75rem", marginBottom: 0 }}>
                {p.imgCaption}
              </p>
            </button>
          );

          return idx % 2 === 0 ? (
            <React.Fragment key={`row-${idx}`}>
              {factCard}
              {imageCard}
            </React.Fragment>
          ) : (
            <React.Fragment key={`row-${idx}`}>
              {imageCard}
              {factCard}
            </React.Fragment>
          );
        })}
      </section>

      {/* Lightbox */}
      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={imageViewerLabel}
          onClick={() => setOpenIndex(null)}
          style={{
            position: "fixed",
            top: "var(--header-height)",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(1200px, 100%)",
              borderRadius: 16,
              overflow: "hidden",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              maxHeight: "calc(100vh - var(--header-height) - 2rem)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderBottom: "1px solid rgba(255,255,255,0.10)",
                flex: "0 0 auto",
              }}
            >
              <strong>
                {screenshotLabel} {openIndex + 1} / {pairs.length}
              </strong>

              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "transparent",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                {closeLabel}
              </button>
            </div>

            <div
              style={{
                background: "rgba(0,0,0,0.08)",
                flex: "1 1 auto",
                minHeight: 0,
                padding: "0.75rem",
                overflow: "auto",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              {missing[openIndex] ? (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1.25rem",
                    opacity: 0.9,
                  }}
                >
                  <div style={{ maxWidth: 520 }}>
                    <strong style={{ display: "block", marginBottom: 8 }}>
                      {missingTitle}
                    </strong>
                    <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                      {missingBodyPrefix}{" "}
                      <code>{`public/progress/progress-0${openIndex + 1}.png`}</code>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={pairs[openIndex].imgSrc}
                  alt={pairs[openIndex].imgAlt}
                  onError={() => setMissing((prev) => ({ ...prev, [openIndex]: true }))}
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                    margin: "0 auto",
                  }}
                />
              )}
            </div>

            <div style={{ padding: "0.9rem 1rem", flex: "0 0 auto" }}>
              <p style={{ margin: 0 }}>{pairs[openIndex].imgCaption}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProgressOverviewPage;
