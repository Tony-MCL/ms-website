import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";

const assetBase = import.meta.env.BASE_URL || "/";

const copy = {
  no: {
    kicker: "MORNING COFFEE LABS",
    title: "Manage System",
    intro:
      "En enkel arbeidsbenk for nyttige verktøy i tekniske prosjekter. Åpne verktøyet du trenger, gjør jobben og finn resultatene igjen uten å lete deg gjennom flere systemer.",
    availableKicker: "VERKTØYKASSA",
    availableTitle: "Tilgjengelige verktøy",
    availableIntro: "Selvstendige verktøy som kan brukes hver for seg, samlet på ett sted.",
    open: "Åpne verktøyet",
    progressTitle: "Progress",
    progressBody: "Lag, vedlikehold og følg opp fremdriftsplaner for prosjekter.",
    toolsTitle: "Tools",
    toolsBody: "Kabelberegning og tekniske beregningsverktøy for praktisk prosjektarbeid.",
    constructionKicker: "PÅ ARBEIDSBENKEN",
    constructionTitle: "Under konstruksjon",
    constructionIntro:
      "Nye verktøy kommer til når vi finner arbeidsoppgaver som fortjener en enklere løsning.",
    photoTitle: "Photo",
    photoBody:
      "Planlegg bilder før befaring og få riktige bilder tilbake med riktige navn og riktig tilknytning.",
    coming: "Kommer",
  },
  en: {
    kicker: "MORNING COFFEE LABS",
    title: "Manage System",
    intro:
      "A practical workbench for useful tools in technical projects. Open the tool you need, get the job done, and find the results again without searching through multiple systems.",
    availableKicker: "THE TOOLBOX",
    availableTitle: "Available tools",
    availableIntro: "Independent tools that work on their own, collected in one place.",
    open: "Open tool",
    progressTitle: "Progress",
    progressBody: "Create, maintain and follow up project schedules and progress plans.",
    toolsTitle: "Tools",
    toolsBody: "Cable sizing and technical calculation tools for practical project work.",
    constructionKicker: "ON THE WORKBENCH",
    constructionTitle: "Under construction",
    constructionIntro:
      "New tools are added when we find everyday tasks that deserve a simpler solution.",
    photoTitle: "Photo",
    photoBody:
      "Plan site photos before a visit and receive the right images back with the right names and context.",
    coming: "Coming soon",
  },
} as const;

const HomePage: React.FC = () => {
  const { lang } = useI18n();
  const c = copy[lang];

  return (
    <main className="ms-home">
      <section className="ms-home-hero" aria-labelledby="ms-home-title">
        <div className="ms-home-hero-copy">
          <span className="ms-home-kicker">{c.kicker}</span>
          <h1 id="ms-home-title">{c.title}</h1>
          <p>{c.intro}</p>
        </div>
        <div className="ms-home-brand" aria-hidden="true">
          <img src={`${assetBase}mcl-logo_new.png`} alt="" />
        </div>
      </section>

      <section className="ms-home-section" aria-labelledby="available-tools-title">
        <div className="ms-home-section-heading">
          <div>
            <span className="ms-home-kicker">{c.availableKicker}</span>
            <h2 id="available-tools-title">{c.availableTitle}</h2>
          </div>
          <p>{c.availableIntro}</p>
        </div>

        <div className="ms-tool-grid">
          <Link className="ms-tool-card ms-tool-card-progress" to="/progress">
            <div className="ms-tool-icon" aria-hidden="true">P</div>
            <div className="ms-tool-copy">
              <h3>{c.progressTitle}</h3>
              <p>{c.progressBody}</p>
              <span>{c.open} <span aria-hidden="true">→</span></span>
            </div>
          </Link>

          <a className="ms-tool-card ms-tool-card-tools" href="https://tools.managesystem.no">
            <div className="ms-tool-icon" aria-hidden="true">T</div>
            <div className="ms-tool-copy">
              <h3>{c.toolsTitle}</h3>
              <p>{c.toolsBody}</p>
              <span>{c.open} <span aria-hidden="true">→</span></span>
            </div>
          </a>
        </div>
      </section>

      <section className="ms-home-section ms-construction-section" id="under-construction" aria-labelledby="construction-title">
        <div className="ms-home-section-heading ms-home-section-heading-light">
          <div>
            <span className="ms-home-kicker">{c.constructionKicker}</span>
            <h2 id="construction-title">{c.constructionTitle}</h2>
          </div>
          <p>{c.constructionIntro}</p>
        </div>

        <article className="ms-construction-card">
          <div className="ms-construction-image">
            <img src={`${assetBase}mcl_under_construction.png`} alt="" />
          </div>
          <div className="ms-construction-copy">
            <span className="ms-status-pill">{c.coming}</span>
            <h3>{c.photoTitle}</h3>
            <p>{c.photoBody}</p>
          </div>
        </article>
      </section>
    </main>
  );
};

export default HomePage;
