import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

// Eksterne lenker tilbake til Morning Coffee Labs (HashRouter)
const MCL_ORIGIN = "https://morningcoffeelabs.no";
function mclHref(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${MCL_ORIGIN}/#${p}`;
}

const ProgressOverviewPage: React.FC = () => {
  const { lang } = useI18n();

  const copy =
    lang === "no"
      ? {
          title: "Slik fungerer Progress",
          lead:
            "Progress er laget for rask planlegging i hverdagen – med tydelig struktur, lav friksjon og en visuell plan som alltid henger sammen med dataene du skriver inn.",
          blocks: [
            {
              title: "Tabellen er kilden til sannhet",
              body:
                "Du skriver inn aktivitet, datoer og informasjon i tabellen. Gantt-visningen viser nøyaktig de samme radene – som tidsblokker. Det betyr færre overraskelser og mindre manuelt arbeid.",
            },
            {
              title: "Visuell plan som er lett å lese",
              body:
                "Du får en plan som er enkel å presentere for andre – og enkel å forstå for deg selv. Målet er ro og oversikt, ikke mer administrasjon.",
            },
            {
              title: "Rask å endre når virkeligheten endrer seg",
              body:
                "Planer blir aldri perfekte. Det viktige er at det går fort å oppdatere og justere, uten at du må “redesigne” alt fra bunnen av.",
            },
            {
              title: "Bygget for utskrift og deling",
              body:
                "En plan har ofte en mottaker. Progress er laget med tanke på at du skal kunne vise, dele og skrive ut – uten å miste lesbarhet.",
            },
          ],
          ctaTitle: "Vil du se det i praksis?",
          ctaLead: "Skjermbilder gir ofte mer mening enn lange forklaringer.",
          ctaShots: "Se skjermbilder",
          ctaBack: "← Tilbake til Progress",
          ctaMcl: "Kontakt oss →",
        }
      : {
          title: "How Progress works",
          lead:
            "Progress is built for fast, everyday planning — with a clear structure, low friction, and a visual plan that always matches the data you enter.",
          blocks: [
            {
              title: "The table is the source of truth",
              body:
                "You enter activities, dates, and details in the table. The Gantt view shows the exact same rows — as time blocks. Fewer surprises, less manual work.",
            },
            {
              title: "A visual plan that’s easy to read",
              body:
                "You get a plan that’s easy to present to others — and easy to understand yourself. The goal is calm clarity, not more admin.",
            },
            {
              title: "Fast to adjust when reality changes",
              body:
                "Plans are never perfect. What matters is being able to update and adapt quickly without rebuilding everything from scratch.",
            },
            {
              title: "Built for sharing and printing",
              body:
                "A plan often has an audience. Progress is designed so you can present, share, and print without losing readability.",
            },
          ],
          ctaTitle: "Want to see it in action?",
          ctaLead: "Screenshots often explain more than long paragraphs.",
          ctaShots: "View screenshots",
          ctaBack: "← Back to Progress",
          ctaMcl: "Contact us →",
        };

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
          <Link className="hero-cta" to="/progress/skjermbilder">
            {copy.ctaShots}
          </Link>

          <a
            href={mclHref("/kontakt")}
            style={{ textDecoration: "underline", fontWeight: 600 }}
          >
            {copy.ctaMcl}
          </a>
        </div>

        <p style={{ marginTop: "1.25rem", marginBottom: 0 }}>
          <Link to="/progress">{copy.ctaBack}</Link>
        </p>
      </section>

      <section className="intro-grid two-columns" style={{ marginTop: 0 }}>
        {copy.blocks.map((b) => (
          <div className="intro-card" key={b.title}>
            <h3 style={{ marginTop: 0 }}>{b.title}</h3>
            <p style={{ marginBottom: 0 }}>{b.body}</p>
          </div>
        ))}

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{copy.ctaTitle}</h3>
          <p style={{ marginBottom: 0 }}>{copy.ctaLead}</p>

          <div style={{ marginTop: "1rem" }}>
            <Link className="hero-cta" to="/progress/skjermbilder">
              {copy.ctaShots}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProgressOverviewPage;
