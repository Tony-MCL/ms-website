import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { LINKS } from "../config/links";

function setMeta(title: string, description: string) {
  if (typeof document === "undefined") return;
  document.title = title;

  let meta = document.querySelector(
    'meta[name="description"]'
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.content = description;
}

const ProgressFremdriftsplanPage: React.FC = () => {
  const { t } = useI18n();

  const title = t<string>("progressArticles.fremdriftsplan.meta.title");
  const description = t<string>("progressArticles.fremdriftsplan.meta.description");

  const heroTagline = t<string>("progressArticles.fremdriftsplan.hero.tagline");

  const ctaBack = t<string>("progressArticles.fremdriftsplan.cta.back");
  const ctaOpen = t<string>("progressArticles.fremdriftsplan.cta.openApp");
  const ctaNext = t<string>("progressArticles.fremdriftsplan.cta.next");

  const sWhatTitle = t<string>("progressArticles.fremdriftsplan.sections.what.title");
  const sWhatBody = t<string>("progressArticles.fremdriftsplan.sections.what.body");

  const sWhyTitle = t<string>("progressArticles.fremdriftsplan.sections.why.title");
  const sWhyP1 = t<string>("progressArticles.fremdriftsplan.sections.why.p1");
  const sWhyLead = t<string>("progressArticles.fremdriftsplan.sections.why.lead");
  const sWhyBullets = t<string[]>("progressArticles.fremdriftsplan.sections.why.bullets") || [];
  const sWhyClose = t<string>("progressArticles.fremdriftsplan.sections.why.close");

  const sStaticTitle = t<string>("progressArticles.fremdriftsplan.sections.static.title");
  const sStaticP1 = t<string>("progressArticles.fremdriftsplan.sections.static.p1");
  const sStaticLead = t<string>("progressArticles.fremdriftsplan.sections.static.lead");
  const sStaticBullets = t<string[]>("progressArticles.fremdriftsplan.sections.static.bullets") || [];
  const sStaticP2 = t<string>("progressArticles.fremdriftsplan.sections.static.p2");
  const sStaticP3 = t<string>("progressArticles.fremdriftsplan.sections.static.p3");

  const sRealityTitle = t<string>("progressArticles.fremdriftsplan.sections.reality.title");
  const sRealityP1 = t<string>("progressArticles.fremdriftsplan.sections.reality.p1");
  const sRealityP2 = t<string>("progressArticles.fremdriftsplan.sections.reality.p2");

  const sLivingTitle = t<string>("progressArticles.fremdriftsplan.sections.living.title");
  const sLivingP1 = t<string>("progressArticles.fremdriftsplan.sections.living.p1");
  const sLivingLead = t<string>("progressArticles.fremdriftsplan.sections.living.lead");
  const sLivingP2 = t<string>("progressArticles.fremdriftsplan.sections.living.p2");

  const sWhoTitle = t<string>("progressArticles.fremdriftsplan.sections.who.title");
  const sWhoP1 = t<string>("progressArticles.fremdriftsplan.sections.who.p1");

  const sWhoBuildTitle = t<string>("progressArticles.fremdriftsplan.sections.who.build.title");
  const sWhoBuildBullets = t<string[]>("progressArticles.fremdriftsplan.sections.who.build.bullets") || [];

  const sWhoItTitle = t<string>("progressArticles.fremdriftsplan.sections.who.it.title");
  const sWhoItBullets = t<string[]>("progressArticles.fremdriftsplan.sections.who.it.bullets") || [];

  const sWhoSchoolTitle = t<string>("progressArticles.fremdriftsplan.sections.who.school.title");
  const sWhoSchoolBody = t<string>("progressArticles.fremdriftsplan.sections.who.school.body");

  const sWhoHealthTitle = t<string>("progressArticles.fremdriftsplan.sections.who.health.title");
  const sWhoHealthBody = t<string>("progressArticles.fremdriftsplan.sections.who.health.body");

  const sWhoPersonalTitle = t<string>("progressArticles.fremdriftsplan.sections.who.personal.title");
  const sWhoPersonalBullets =
    t<string[]>("progressArticles.fremdriftsplan.sections.who.personal.bullets") || [];

  const sGainTitle = t<string>("progressArticles.fremdriftsplan.sections.gain.title");
  const sGainBullets = t<string[]>("progressArticles.fremdriftsplan.sections.gain.bullets") || [];
  const sGainClose = t<string>("progressArticles.fremdriftsplan.sections.gain.close");

  const sPracticeTitle = t<string>("progressArticles.fremdriftsplan.sections.practice.title");
  const sPracticeP1 = t<string>("progressArticles.fremdriftsplan.sections.practice.p1");
  const sPracticeP2 = t<string>("progressArticles.fremdriftsplan.sections.practice.p2");
  const sPracticeCtaTry = t<string>("progressArticles.fremdriftsplan.sections.practice.ctaTry");
  const sPracticeCtaPrices = t<string>("progressArticles.fremdriftsplan.sections.practice.ctaPrices");

  useEffect(() => {
    setMeta(title, description);
  }, [title, description]);

  return (
    <main className="page">
      <section className="fs-hero">
        <h1>{title}</h1>

        <p className="fs-tagline" style={{ maxWidth: 980 }}>
          {heroTagline}
        </p>

        {/* Ingen knapper i toppen (som ønsket) */}
      </section>

      <section className="intro-grid two-columns" style={{ marginTop: 0 }}>
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sWhatTitle}</h2>
          <p style={{ marginTop: "0.5rem" }}>{sWhatBody}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sWhyTitle}</h2>
          <p style={{ marginTop: "0.5rem" }}>{sWhyP1}</p>

          <p style={{ marginTop: "0.75rem" }}>{sWhyLead}</p>

          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
            {sWhyBullets.map((x, i) => (
              <li key={`${i}-${x}`}>{x}</li>
            ))}
          </ul>

          <p style={{ marginBottom: 0, marginTop: "0.75rem" }}>{sWhyClose}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sStaticTitle}</h2>

          <p style={{ marginTop: "0.5rem" }}>{sStaticP1}</p>

          <p style={{ marginTop: "0.75rem" }}>{sStaticLead}</p>

          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
            {sStaticBullets.map((x, i) => (
              <li key={`${i}-${x}`}>{x}</li>
            ))}
          </ul>

          <p style={{ marginTop: "0.75rem" }}>{sStaticP2}</p>
          <p style={{ marginBottom: 0 }}>{sStaticP3}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sRealityTitle}</h2>
          <p style={{ marginTop: "0.5rem" }}>{sRealityP1}</p>
          <p style={{ marginBottom: 0, marginTop: "0.75rem" }}>{sRealityP2}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sLivingTitle}</h2>

          <p style={{ marginTop: "0.5rem" }}>{sLivingP1}</p>

          <p style={{ marginTop: "0.75rem" }}>{sLivingLead}</p>

          <p style={{ marginBottom: 0 }}>{sLivingP2}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sWhoTitle}</h2>

          <p style={{ marginTop: "0.5rem" }}>{sWhoP1}</p>

          <h3 style={{ marginTop: "1rem" }}>{sWhoBuildTitle}</h3>
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
            {sWhoBuildBullets.map((x, i) => (
              <li key={`${i}-${x}`}>{x}</li>
            ))}
          </ul>

          <h3 style={{ marginTop: "1rem" }}>{sWhoItTitle}</h3>
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
            {sWhoItBullets.map((x, i) => (
              <li key={`${i}-${x}`}>{x}</li>
            ))}
          </ul>

          <h3 style={{ marginTop: "1rem" }}>{sWhoSchoolTitle}</h3>
          <p style={{ marginTop: "0.5rem" }}>{sWhoSchoolBody}</p>

          <h3 style={{ marginTop: "1rem" }}>{sWhoHealthTitle}</h3>
          <p style={{ marginTop: "0.5rem" }}>{sWhoHealthBody}</p>

          <h3 style={{ marginTop: "1rem" }}>{sWhoPersonalTitle}</h3>
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
            {sWhoPersonalBullets.map((x, i) => (
              <li key={`${i}-${x}`}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sGainTitle}</h2>

          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem" }}>
            {sGainBullets.map((x, i) => (
              <li key={`${i}-${x}`}>{x}</li>
            ))}
          </ul>

          <p style={{ marginBottom: 0, marginTop: "0.75rem" }}>{sGainClose}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sPracticeTitle}</h2>

          <p style={{ marginTop: "0.5rem" }}>{sPracticeP1}</p>
          <p style={{ marginBottom: 0 }}>{sPracticeP2}</p>
        </div>

        {/* CTA-blokk i bunnen (som ønsket): Tilbake + eksisterende knapper + Neste */}
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.8rem",
              alignItems: "center",
            }}
          >
            <Link className="hero-cta" to="/progress">
              {ctaBack}
            </Link>

            <a className="hero-cta" href={LINKS.progress} rel="noopener noreferrer">
              {sPracticeCtaTry}
            </a>

            <Link className="hero-cta" to="/progress/priser">
              {sPracticeCtaPrices}
            </Link>

            <Link className="hero-cta" to="/progress/fremdriftsplan-bruk">
              {ctaNext}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProgressFremdriftsplanPage;
