import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

const ProgressPage: React.FC = () => {
  const { t, lang } = useI18n();

  const copy =
    lang === "no"
      ? {
          heroTagline: "Fremdriftsplanlegging uten støy.",
          heroLead:
            "Progress er et enkelt verktøy for å planlegge det som faktisk må bli gjort – uten overflødige funksjoner, kompliserte oppsett eller unødvendige begreper.",
          heroLead2:
            "En fremdriftsplan handler om oversikt, prioritering og å komme i mål. Den har alltid vært en naturlig del av hvordan mennesker planlegger arbeid – lenge før det fantes metoder, verktøy og begreper for prosjektstyring.",
          heroLead3:
            "Når noe skal bygges, læres eller gjennomføres over tid, oppstår det samme behovet igjen og igjen: å se helheten, forstå rekkefølgen, og vite når noe faktisk er ferdig.",
          heroLead4:
            "Progress er laget for å støtte dette behovet i praksis – enten det er et prosjekt, et semester, et salgsarbeid eller en privat plan.",

          whyTitle: "Hva gir en fremdriftsplan deg egentlig?",
          whyLead:
            "Mange vet at de burde planlegge. Færre vet hva de faktisk får igjen for det.",
          whyBullets: [
            { title: "Oversikt", body: "Hva skal gjøres – og i hvilken rekkefølge." },
            { title: "Forutsigbarhet", body: "Hva skjer nå, og hva kommer senere." },
            { title: "Prioritering", body: "Hva er viktig, og hva kan vente." },
            { title: "Fremdrift", body: "En tydelig følelse av å komme videre." },
            { title: "Beslutningsgrunnlag", body: "Du ser konsekvensene før du tar valgene." },
          ],
          whyClose:
            "Progress hjelper deg å få dette på plass i praksis – ved å gjøre fremdrift synlig, forståelig og enkel å justere underveis.\n\nDet samme behovet dukker opp i mange ulike situasjoner. Under ser du noen typiske eksempler.",

          tiles: [
            {
              title: "Prosjektledere",
              body:
                "Når flere aktiviteter henger sammen, og du må se rekkefølge, milepæler og frister, og kunne justere uten at alt faller fra hverandre.",
            },
            {
              title: "Salgsrepresentanter",
              body:
                "Når et tilbud har mange del-løp: innhenting, oppfølging, avklaringer og interne frister, og du trenger oversikt på hva som haster nå og hva som venter.",
            },
            {
              title: "Lærere",
              body:
                "Når undervisning, perioder og innleveringer skal henge sammen over tid, og du vil kunne flytte på ting uten å miste oversikten.",
            },
            {
              title: "Elever og studenter",
              body:
                "Når du har flere oppgaver og frister samtidig, og trenger en plan som gjør arbeidsmengden håndterbar uke for uke.",
            },
            {
              title: "Reisende",
              body:
                "Når en reise består av et tidsløp med transport, opphold og aktiviteter, og du vil se helheten og unngå «hull» i planen.",
            },
            {
              title: "Privatpersoner",
              body:
                "Når noe skal gjennomføres i flere steg, oppussing, flytting eller arrangement, og du vil se hva som kommer først og hva som må bli ferdig til slutt.",
            },
          ],
          tilesNote:
            "Hvis det må planlegges, passer Progress.\nUansett rolle handler det om det samme: å se rekkefølgen, holde frister og gjøre fremdrift synlig.",

          seeTitle: "Vil du se hvordan Progress faktisk fungerer?",
          seeLead: "Progress er best når du ser det i bruk.",

          ctaMoreBtn: "Les mer om Progress",
          ctaAppBtn: "Åpne Progress",
          ctaPricesBtn: "Se priser og lisens",
        }
      : {
          heroTagline: "Project planning without the noise.",
          heroLead:
            "Progress is a simple tool for planning what actually needs to get done — without unnecessary features, complicated setup, or buzzwords.",
          heroLead2:
            "A schedule is about clarity, prioritization, and getting things over the finish line. It has always been a natural part of how people plan work — long before project management became a discipline with methods, tools, and terminology.",
          heroLead3:
            "When something needs to be built, learned, or delivered over time, the same need appears again and again: to see the whole picture, understand the sequence — and know when something is truly finished.",
          heroLead4:
            "Progress is built to support that need in practice — whether it’s a project, a semester, a sales process, or a personal plan.",

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
            "Progress helps you put this into practice — by making progress visible, easy to understand, and simple to adjust as things change.\n\nThe same need shows up in many different situations. Below are a few typical examples.",

          tiles: [
            {
              title: "Project managers",
              body:
                "When multiple activities depend on each other, and you need to see sequence, milestones, and deadlines — and adjust without everything falling apart.",
            },
            {
              title: "Sales reps",
              body:
                "When a quote has many moving parts: sourcing, follow-ups, clarifications, and internal deadlines — and you need to know what matters now and what can wait.",
            },
            {
              title: "Teachers",
              body:
                "When lessons, periods, and submissions need to connect over time — and you want to move things around without losing the overview.",
            },
            {
              title: "Students",
              body:
                "When you have several assignments and deadlines at once — and need a plan that makes the workload manageable week by week.",
            },
            {
              title: "Travelers",
              body:
                "When a trip is a timeline of transport, stays, and activities — and you want to see the whole plan and avoid gaps.",
            },
            {
              title: "Personal planning",
              body:
                "When something happens in stages — renovations, moving, or events — and you want to see what comes first and what must be finished at the end.",
            },
          ],
          tilesNote:
            "If it needs planning — Progress fits.\nNo matter the role, it’s the same thing: see the sequence, keep deadlines, and make progress visible.",

          seeTitle: "Want to see how Progress actually works?",
          seeLead: "Progress is best when you see it in action.",

          ctaMoreBtn: "Learn how it works",
          ctaAppBtn: "Open Progress",
          ctaPricesBtn: "Pricing & license",
        };

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
        <p style={{ maxWidth: 980, marginTop: "0.75rem" }}>{copy.heroLead4}</p>

        {/* CTA buttons (replaces badge + contact link) */}
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
            {copy.ctaMoreBtn}
          </Link>

          <Link className="hero-cta" to="/progress/app">
            {copy.ctaAppBtn}
          </Link>

          <Link className="hero-cta" to="/progress/priser">
            {copy.ctaPricesBtn}
          </Link>
        </div>
      </section>

      {/* WHY (nå samlet i én flis) */}
      <section className="intro-grid two-columns" style={{ marginTop: 0 }}>
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{copy.whyTitle}</h3>

          <p style={{ marginTop: "0.5rem" }}>{copy.whyLead}</p>

          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem" }}>
            {copy.whyBullets.map((b) => (
              <li key={b.title} style={{ marginBottom: "0.45rem" }}>
                <strong>{b.title}</strong> – {b.body}
              </li>
            ))}
          </ul>

          <p style={{ marginBottom: 0, marginTop: "0.75rem", whiteSpace: "pre-line" }}>
            {copy.whyClose}
          </p>
        </div>
      </section>

      {/* TILES */}
      <section className="intro-grid two-columns">
        {copy.tiles.map((tile) => (
          <div className="intro-card" key={tile.title}>
            <h3 style={{ marginTop: 0 }}>{tile.title}</h3>
            <p>{tile.body}</p>
          </div>
        ))}

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <p style={{ margin: 0, whiteSpace: "pre-line" }}>{copy.tilesNote}</p>
        </div>
      </section>

      {/* CTA (now purely content, no links) */}
      <section className="intro-grid two-columns">
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{copy.seeTitle}</h3>
          <p style={{ marginBottom: 0 }}>{copy.seeLead}</p>
        </div>
      </section>
    </main>
  );
};

export default ProgressPage;
