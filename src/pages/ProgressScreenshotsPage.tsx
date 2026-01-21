import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

type Shot = {
  src: string;
  altNo: string;
  altEn: string;
  captionNo: string;
  captionEn: string;
};

const assetBase = import.meta.env.BASE_URL || "/";

const ProgressScreenshotsPage: React.FC = () => {
  const { lang } = useI18n();

  const shots: Shot[] = useMemo(
    () => [
      {
        src: `${assetBase}progress/progress-01.png`,
        altNo: "Skjermbilde: Plan i tabell og Gantt",
        altEn: "Screenshot: Table and Gantt plan",
        captionNo: "Tabell og Gantt henger sammen – samme rader, samme plan.",
        captionEn: "Table and Gantt stay aligned — same rows, same plan.",
      },
      {
        src: `${assetBase}progress/progress-02.png`,
        altNo: "Skjermbilde: Oversikt og lesbarhet",
        altEn: "Screenshot: Overview and readability",
        captionNo: "Lesbarhet først: rolig layout som er enkel å dele.",
        captionEn: "Readability first: a calm layout that’s easy to share.",
      },
      {
        src: `${assetBase}progress/progress-03.png`,
        altNo: "Skjermbilde: Utskrift / deling",
        altEn: "Screenshot: Print / sharing",
        captionNo: "Bygget for deling og utskrift – uten at det blir rot.",
        captionEn: "Built for sharing and printing — without the clutter.",
      },
      {
        src: `${assetBase}progress/progress-04.png`,
        altNo: "Skjermbilde: Detaljer og flyt",
        altEn: "Screenshot: Details and flow",
        captionNo: "Detaljer når du trenger det – uten å miste flyten.",
        captionEn: "Details when you need them — without losing flow.",
      },
    ],
    []
  );

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [missing, setMissing] = useState<Record<number, boolean>>({});

  const isNo = lang === "no";

  const title = isNo ? "Skjermbilder" : "Screenshots";
  const lead = isNo
    ? "Her ser du Progress i praksis. Klikk på et bilde for full visning."
    : "See Progress in action. Click an image to view it full size.";

  const back = isNo ? "← Tilbake til Progress" : "← Back to Progress";
  const backOverview = isNo ? "Les mer om hvordan det fungerer" : "Learn how it works";

  const closeLabel = isNo ? "Lukk" : "Close";

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
          <Link className="hero-cta" to="/progress/oversikt">
            {backOverview}
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
        {shots.map((s, idx) => {
          const alt = isNo ? s.altNo : s.altEn;
          const caption = isNo ? s.captionNo : s.captionEn;

          const isMissing = !!missing[idx];

          return (
            <button
              key={s.src}
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
                }}
              >
                {!isMissing ? (
                  <img
                    src={s.src}
                    alt={alt}
                    loading="lazy"
                    style={{ width: "100%", display: "block" }}
                    onError={() =>
                      setMissing((prev) => ({ ...prev, [idx]: true }))
                    }
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16 / 9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "1rem",
                      opacity: 0.8,
                    }}
                  >
                    <div style={{ maxWidth: 420 }}>
                      <strong style={{ display: "block", marginBottom: 8 }}>
                        {isNo ? "Legg til screenshot" : "Add a screenshot"}
                      </strong>
                      <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                        {isNo
                          ? `Mangler fil: public/progress/progress-0${idx + 1}.png`
                          : `Missing file: public/progress/progress-0${idx + 1}.png`}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p style={{ marginTop: "0.75rem", marginBottom: 0 }}>{caption}</p>
            </button>
          );
        })}
      </section>

      {/* Lightbox */}
      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isNo ? "Bildevisning" : "Image viewer"}
          onClick={() => setOpenIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
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
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderBottom: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <strong>
                {isNo ? "Skjermbilde" : "Screenshot"} {openIndex + 1} /{" "}
                {shots.length}
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

            <div style={{ background: "rgba(0,0,0,0.08)" }}>
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
                      {isNo ? "Mangler bilde" : "Missing image"}
                    </strong>
                    <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                      {isNo
                        ? `Legg filen i public/progress/progress-0${
                            openIndex + 1
                          }.png`
                        : `Place the file at public/progress/progress-0${
                            openIndex + 1
                          }.png`}
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={shots[openIndex].src}
                  alt={isNo ? shots[openIndex].altNo : shots[openIndex].altEn}
                  style={{ width: "100%", display: "block" }}
                  onError={() =>
                    setMissing((prev) => ({ ...prev, [openIndex]: true }))
                  }
                />
              )}
            </div>

            <div style={{ padding: "0.9rem 1rem" }}>
              <p style={{ margin: 0 }}>
                {isNo
                  ? shots[openIndex].captionNo
                  : shots[openIndex].captionEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProgressScreenshotsPage;
