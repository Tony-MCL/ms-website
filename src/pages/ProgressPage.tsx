import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

// Eksterne lenker tilbake til Morning Coffee Labs (HashRouter)
const MCL_ORIGIN = "https://morningcoffeelabs.no";
function mclHref(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${MCL_ORIGIN}/#${p}`;
}

// TODO (Steg 3): Pek denne til faktisk app-URL når den er klar
const PROGRESS_APP_URL = "#";

const ProgressPage: React.FC = () => {
  const { t, lang } = useI18n();

  const copy =
    lang === "no"
      ? {
          heroTagline: "Fremdriftsplanlegging uten støy.",
          heroLead:
            "Progress er et enkelt verktøy for å planlegge det som faktisk må bli gjort – uten overflødige funksjoner, kompliserte oppsett eller unødvendige begreper.",
          heroLead2:
            "En fremdriftsplan handler ikke om prosjektstyring som fag. Den handler om oversikt, prioritering og å komme i mål.",
          heroLead3:
            "Progress er laget for mennesker som trenger struktur i hverdagen – enten det er et prosjekt, et semester, et salgsarbeid eller en privat plan.",

          whyTitle: "Hva gir en fremdriftsplan deg egentlig?",
          whyLead:
            "Mange vet at de burde planlegge. Færre vet hva de faktisk får igjen for det.",
          whyBullets: [
            {
              title: "Oversikt",
              body: "Hva skal gjøres – og i hvilken rekkefølge.",
            },
            {
              title: "Forutsigbarhet",
              body: "Hva skjer nå, og hva kommer senere.",
            },
            {
              title: "Prioritering",
              body: "Hva er viktig, og hva kan vente.",
            },
            {
              title: "Fremdrift",
              body: "En tydelig følelse av å komme videre.",
            },
            {
              title: "Beslutningsgrunnlag",
              body: "Du ser konsekvensene før du tar valgene.",
            },
          ],
          whyClose:
            "Progress hjelper deg å få dette på plass – raskt, visuelt og uten friksjon.",

          audienceTitle: "Hvem er Progress for?",
          audienceLead:
            "Progress er ikke bygget for én bestemt rolle. Det er bygget for alle som trenger å planlegge tid, oppgaver og sammenheng.",
          tiles: [
            {
              title: "Prosjektledere",
              body:
                "Planlegg aktiviteter, avhengigheter og milepæler – uten å drukne i tunge verktøy eller metodikk.",
            },
            {
              title: "Salgsrepresentanter",
              body:
                "Hold oversikt over tilbud, oppfølging og interne frister i parallelle salgsprosjekter.",
            },
            {
              title: "Lærere",
              body:
                "Planlegg undervisningsløp, perioder og innleveringer – enkelt å justere underveis.",
            },
            {
              title: "Elever og studenter",
              body:
                "Strukturér semesteret, oppgaver og eksamensperioder slik at arbeidsmengden blir håndterbar.",
            },
            {
              title: "Reisende",
              body:
                "Bygg reiseplaner med tydelig tidsløp – transport, opphold og aktiviteter i sammenheng.",
            },
            {
              title: "Privatpersoner",
              body:
                "Planlegg større hendelser, oppussing eller flytting – eller rett og slett hverdagen.",
            },
          ],
          tilesNote: "Hvis det må planlegges – passer Progress.",

          seeTitle: "Vil du se hvordan Progress faktisk fungerer?",
          seeLead: "Progress er best når du ser det i bruk.",
          ctaShots: "Se skjermbilder",
          ctaMore: "Les mer om hvordan Progress fungerer",
          ctaPrices: "Se priser og lisens",
          ctaApp: "Gå til Progress-appen",
          backToMcl: "← Tilbake til Morning Coffee Labs",
          contactCta: "Kontakt oss →",
          comingSoon: "Kommer snart",
        }
      : {
          heroTagline: "Project planning without the noise.",
          heroLead:
            "Progress is a simple tool for planning what actually needs to get done — without unnecessary features, complicated setup, or buzzwords.",
          heroLead2:
            "A schedule isn’t about project management as a discipline. It’s about clarity, prioritization, and getting things over the finish line.",
          heroLead3:
            "Progress is built for people who need structure in everyday work — whether it’s a project, a semester, a sales process, or a personal plan.",

          whyTitle: "What do you actually gain from a schedule?",
          whyLead:
            "Many people know they should plan. Fewer can clearly describe what they get from it.",
          whyBullets: [
            { title: "Overview", body: "What needs doing — and in what order." },
            { title: "Predictability", body: "What happens now, and what’s next." },
            { title: "Priorities", body: "What matters most — and what can wait." },
            { title: "Momentum", body: "A clear sense of progress." },
            { title: "Better decisions", body: "See consequences before you commit." },
          ],
          whyClose:
            "Progress helps you get this in place — fast, visual, and low-friction.",

          audienceTitle: "Who is Progress for?",
          audienceLead:
            "Progress isn’t built for one role. It’s built for anyone who needs to plan time, tasks, and dependencies.",
          tiles: [
            {
              title: "Project managers",
              body:
                "Plan activities, dependencies, and milestones — without drowning in heavy tools or methodology.",
            },
            {
              title: "Sales reps",
              body:
                "Keep track of quotes, follow-ups, and internal deadlines across parallel sales processes.",
            },
            {
              title: "Teachers",
              body:
                "Plan course flow, periods, and submissions — easy to adjust as reality changes.",
            },
            {
              title: "Students",
              body:
                "Structure the semester, assignments, and exam periods to make workload manageable.",
            },
            {
              title: "Travelers",
              body:
                "Build travel plans with a clear timeline — transport, stays, and activities connected.",
            },
            {
              title: "Personal planning",
              body:
                "Plan events, renovations, moving — or simply everyday life with more clarity.",
            },
          ],
          tilesNote: "If it needs planning — Progress fits.",

          seeTitle: "Want to see how Progress actually works?",
          seeLead: "Progress is best when you see it in action.",
          ctaShots: "View screenshots",
          ctaMore: "Learn how Progress works",
          ctaPrices: "Pricing & license",
          ctaApp: "Open the Progress app",
          backToMcl: "← Back to Morning Coffee Labs",
          contactCta: "Contact us →",
          comingSoon: "Coming soon",
        };

  const disabled = PROGRESS_APP_URL === "#";

  return (
    <main className="page">
      {/* HERO */}
      <section className="fs-hero">
        <h1>Manage Progress</h1>

        <p className="fs-tagline" style={{ maxWidth: 980 }}>
          {copy.heroTagline}
        </p>

        <p style={{ maxWidth: 980 }}>{copy.heroLead}</p>
        <p style={{ maxWidth: 980, marginTop: "0.75rem" }}>{copy.heroLead2}</p>
        <p style={{ maxWidth: 980, marginTop: "0.75rem" }}>{copy.heroLead3}</p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.8rem",
            marginTop: "1rem",
            alignItems: "center",
          }}
        >
          <span className="badge">{t("progressPage.hero.badge")}</span>

          <a
            href={mclHref("/kontakt")}
            style={{ fontSize: "0.95rem", textDecoration: "underline" }}
          >
            {copy.contactCta}
          </a>
        </div>
      </section>

      {/* WHY */}
      <section className="intro-grid two-columns" style={{ marginTop: 0 }}>
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{copy.whyTitle}</h3>
          <p style={{ marginBottom: 0 }}>{copy.whyLead}</p>
        </div>

        {copy.whyBullets.map((b) => (
          <div className="intro-card" key={b.title}>
            <h3 style={{ marginTop: 0 }}>{b.title}</h3>
            <p>{b.body}</p>
          </div>
        ))}

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <p style={{ margin: 0, maxWidth: 980 }}>{copy.whyClose}</p>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="intro-grid two-columns">
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{copy.audienceTitle}</h3>
          <p style={{ marginBottom: 0, maxWidth: 980 }}>{copy.audienceLead}</p>
        </div>

        {copy.tiles.map((tile) => (
          <div className="intro-card" key={tile.title}>
            <h3 style={{ marginTop: 0 }}>{tile.title}</h3>
            <p>{tile.body}</p>
          </div>
        ))}

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <p style={{ margin: 0 }}>{copy.tilesNote}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="intro-grid two-columns">
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{copy.seeTitle}</h3>
          <p style={{ marginBottom: 0 }}>{copy.seeLead}</p>

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

            <Link
              to="/progress/oversikt"
              style={{ textDecoration: "underline", fontWeight: 600 }}
            >
              {copy.ctaMore}
            </Link>

            {/* Steg 3 */}
            <span style={{ opacity: 0.7 }}>
              {copy.ctaPrices} · {copy.comingSoon}
            </span>

            <a
              href={PROGRESS_APP_URL}
              style={{
                textDecoration: "underline",
                fontWeight: 600,
                opacity: disabled ? 0.6 : 1,
                pointerEvents: disabled ? "none" : "auto",
              }}
              aria-disabled={disabled ? "true" : undefined}
              title={disabled ? copy.comingSoon : undefined}
            >
              {copy.ctaApp}
            </a>
          </div>

          <p style={{ marginTop: "1.25rem", marginBottom: 0 }}>
            <a href={mclHref("/")}>{copy.backToMcl}</a>
          </p>
        </div>
      </section>
    </main>
  );
};

export default ProgressPage;
