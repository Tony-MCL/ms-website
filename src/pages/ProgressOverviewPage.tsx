import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

// Eksterne lenker tilbake til Morning Coffee Labs (HashRouter)
const MCL_ORIGIN = "https://morningcoffeelabs.no";
function mclHref(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${MCL_ORIGIN}/#${p}`;
}

type Pair = {
  factTitle: string;
  factBody: string;
  imgSrc: string;
  imgAlt: string;
  imgCaption: string;
};

const assetBase = import.meta.env.BASE_URL || "/";

const ProgressOverviewPage: React.FC = () => {
  const { lang } = useI18n();

  const isNo = lang === "no";

  const copy = isNo
    ? {
        title: "Slik fungerer Progress",
        lead:
          "Her er den korte forklaringen – med skjermbilder. Progress er laget for å gjøre fremdrift synlig, forståelig og enkel å justere underveis.",
        backToProgress: "← Tilbake til Progress",
        contactCta: "Kontakt oss →",
        closeLabel: "Lukk",
        imageViewerLabel: "Bildevisning",
        screenshotLabel: "Skjermbilde",
        missingTitle: "Mangler bilde",
        missingBodyPrefix: "Legg filen i",
        pairs: [
          {
            factTitle: "Tabellen er kilden til sannhet",
            factBody:
              "Du skriver inn aktivitet, datoer og informasjon i tabellen. Gantt-visningen viser nøyaktig de samme radene – som tidsblokker. Det betyr færre overraskelser og mindre manuelt arbeid.",
            imgSrc: `${assetBase}progress/progress-01.png`,
            imgAlt: "Skjermbilde: Plan i tabell og Gantt",
            imgCaption: "Tabell og Gantt henger sammen – samme rader, samme plan.",
          },
          {
            factTitle: "Visuell plan som er lett å lese",
            factBody:
              "Du får en plan som er enkel å presentere for andre – og enkel å forstå for deg selv. Målet er ro og oversikt, ikke mer administrasjon.",
            imgSrc: `${assetBase}progress/progress-02.png`,
            imgAlt: "Skjermbilde: Oversikt og lesbarhet",
            imgCaption: "Lesbarhet først: rolig layout som er enkel å dele.",
          },
          {
            factTitle: "Rask å endre når virkeligheten endrer seg",
            factBody:
              "Planer blir aldri perfekte. Det viktige er at det går fort å oppdatere og justere, uten at du må “redesigne” alt fra bunnen av.",
            imgSrc: `${assetBase}progress/progress-03.png`,
            imgAlt: "Skjermbilde: Utskrift / deling",
            imgCaption: "Bygget for deling og utskrift – uten at det blir rot.",
          },
          {
            factTitle: "Bygget for utskrift og deling",
            factBody:
              "En plan har ofte en mottaker. Progress er laget med tanke på at du skal kunne vise, dele og skrive ut – uten å miste lesbarhet.",
            imgSrc: `${assetBase}progress/progress-04.png`,
            imgAlt: "Skjermbilde: Detaljer og flyt",
            imgCaption: "Detaljer når du trenger det – uten å miste flyten.",
          },
        ] as Pair[],
        backToMcl: "← Tilbake til Morning Coffee Labs",
      }
    : {
        title: "How Progress works",
        lead:
          "Here’s the short explanation — with screenshots. Progress is built to make progress visible, easy to understand, and simple to adjust as things change.",
        backToProgress: "← Back to Progress",
        contactCta: "Contact us →",
        closeLabel: "Close",
        imageViewerLabel: "Image viewer",
        screenshotLabel: "Screenshot",
        missingTitle: "Missing image",
        missingBodyPrefix: "Place the file at",
        pairs: [
          {
            factTitle: "The table is the source of truth",
            factBody:
              "You enter activities, dates, and details in the table. The Gantt view shows the exact same rows — as time blocks. Fewer surprises, less manual work.",
            imgSrc: `${assetBase}progress/progress-01.png`,
            imgAlt: "Screenshot: Table and Gantt plan",
            imgCaption: "Table and Gantt stay aligned — same rows, same plan.",
          },
          {
            factTitle: "A visual plan that’s easy to read",
            factBody:
              "You get a plan that’s easy to present to others — and easy to understand yourself. The goal is calm clarity, not more admin.",
            imgSrc: `${assetBase}progress/progress-02.png`,
            imgAlt: "Screenshot: Overview and readability",
            imgCaption: "Readability first: a calm layout that’s easy to share.",
          },
          {
            factTitle: "Fast to adjust when reality changes",
            factBody:
              "Plans are never perfect. What matters is being able to update and adapt quickly without rebuilding everything from scratch.",
            imgSrc: `${assetBase}progress/progress-03.png`,
            imgAlt: "Screenshot: Print / sharing",
            imgCaption: "Built for sharing and printing — without the clutter.",
          },
          {
            factTitle: "Built for sharing and printing",
            factBody:
              "A plan often has an audience. Progress is designed so you can present, share, and print without losing readability.",
            imgSrc: `${assetBase}progress/progress-04.png`,
            imgAlt: "Screenshot: Details and flow",
            imgCaption: "Details when you need them — without losing flow.",
          },
        ] as Pair[],
        backToMcl: "← Back to Morning Coffee Labs",
      };

  // Lightbox state
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [missing, setMissing] = useState<Record<number, boolean>>({});

  const pairs: Pair[] = useMemo(() => copy.pairs, [copy.pairs]);

  return (
    <main className="page">
      <section className="fs-hero">
        <h1>{copy.title}</h1>
        <p className="fs-tagline" style={{ maxWidth: 980 }}>
          {copy.lead}
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
          <Link className="hero-cta" to="/progress">
            {copy.backToProgress}
          </Link>

          <a
            href={mclHref("/kontakt")}
            style={{ textDecoration: "underline", fontWeight: 600 }}
          >
            {copy.contactCta}
          </a>
        </div>
      </section>

      {/* Kombinert: fakta ↔ bilde ↔ fakta ↔ bilde */}
      <section className="intro-grid two-columns" style={{ marginTop: 0 }}>
        {pairs.map((p, idx) => {
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

        // 🔒 Fast bilde-ramme (hindrer varierende flishøyde)
        aspectRatio: "16 / 9",
        width: "100%",
      }}
    >
      {!isMissing ? (
        <img
          src={p.imgSrc}
          alt={p.imgAlt}
          loading="lazy"
          onError={() =>
            setMissing((prev) => ({ ...prev, [idx]: true }))
          }
          style={{
            width: "100%",
            height: "100%",
            display: "block",

            // 🎯 Skaler bildet inn i ramma uten å endre flishøyde
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
              {copy.missingTitle}
            </strong>
            <div style={{ fontSize: 14, lineHeight: 1.4 }}>
              {copy.missingBodyPrefix}{" "}
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

          // Annenhver: (fakta + bilde), så (bilde + fakta)
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

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <p style={{ marginBottom: 0 }}>
            <a href={mclHref("/")}>{copy.backToMcl}</a>
          </p>
        </div>
      </section>

      {/* Lightbox */}
      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.imageViewerLabel}
          onClick={() => setOpenIndex(null)}
          style={{
            position: "fixed",
            // 👇 legg overlay under headeren (header er fixed)
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
      
              // 👇 behold alt innenfor tilgjengelig høyde (etter header)
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
                {copy.screenshotLabel} {openIndex + 1} / {pairs.length}
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
                {copy.closeLabel}
              </button>
            </div>
      
            <div
              style={{
                background: "rgba(0,0,0,0.08)",
      
                // 👇 dette området tar resten av plassen og skroller ved behov
                flex: "1 1 auto",
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.75rem",
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
                      {copy.missingTitle}
                    </strong>
                    <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                      {copy.missingBodyPrefix}{" "}
                      <code>{`public/progress/progress-0${openIndex + 1}.png`}</code>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={pairs[openIndex].imgSrc}
                  alt={pairs[openIndex].imgAlt}
                  onError={() =>
                    setMissing((prev) => ({ ...prev, [openIndex]: true }))
                  }
                  style={{
                    display: "block",
      
                    // 👇 alltid skaler inn i tilgjengelig plass
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
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
