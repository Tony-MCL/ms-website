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

const ProgressFremdriftsplanBrukPage: React.FC = () => {
  const { t } = useI18n();

  const title = t<string>("progressArticles.bruk.meta.title");
  const description = t<string>("progressArticles.bruk.meta.description");

  const heroTagline = t<string>("progressArticles.bruk.hero.tagline");

  const ctaBack = t<string>("progressArticles.bruk.cta.back");
  const ctaOpen = t<string>("progressArticles.bruk.cta.openApp");
  const ctaPrices = t<string>("progressArticles.bruk.cta.prices");

  const sStep1Title = t<string>("progressArticles.bruk.sections.step1.title");
  const sStep1P1 = t<string>("progressArticles.bruk.sections.step1.p1");
  const sStep1Lead = t<string>("progressArticles.bruk.sections.step1.lead");
  const sStep1Quote = t<string>("progressArticles.bruk.sections.step1.quote");
  const sStep1Bullets = t<string[]>("progressArticles.bruk.sections.step1.bullets") || [];

  const sDepsTitle = t<string>("progressArticles.bruk.sections.deps.title");
  const sDepsP1 = t<string>("progressArticles.bruk.sections.deps.p1");
  const sDepsBullets = t<string[]>("progressArticles.bruk.sections.deps.bullets") || [];
  const sDepsClose = t<string>("progressArticles.bruk.sections.deps.close");

  const sEstTitle = t<string>("progressArticles.bruk.sections.estimates.title");
  const sEstP1 = t<string>("progressArticles.bruk.sections.estimates.p1");
  const sEstP2 = t<string>("progressArticles.bruk.sections.estimates.p2");

  const sStaticTitle = t<string>("progressArticles.bruk.sections.static.title");
  const sStaticP1 = t<string>("progressArticles.bruk.sections.static.p1");
  const sStaticP2 = t<string>("progressArticles.bruk.sections.static.p2");

  const sExecTitle = t<string>("progressArticles.bruk.sections.execution.title");
  const sExecP1 = t<string>("progressArticles.bruk.sections.execution.p1");
  const sExecBullets = t<string[]>("progressArticles.bruk.sections.execution.bullets") || [];

  const sCommsTitle = t<string>("progressArticles.bruk.sections.comms.title");
  const sCommsP1 = t<string>("progressArticles.bruk.sections.comms.p1");
  const sCommsP2 = t<string>("progressArticles.bruk.sections.comms.p2");

  const sPayoffTitle = t<string>("progressArticles.bruk.sections.payoff.title");
  const sPayoffP1 = t<string>("progressArticles.bruk.sections.payoff.p1");

  const bottomTry = t<string>("progressArticles.bruk.bottomCtas.try");
  const bottomScreens = t<string>("progressArticles.bruk.bottomCtas.screens");
  const bottomBack = t<string>("progressArticles.bruk.bottomCtas.back");

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
          <h2 style={{ marginTop: 0 }}>{sStep1Title}</h2>

          <p style={{ marginTop: "0.5rem" }}>{sStep1P1}</p>

          <p style={{ marginTop: "0.75rem" }}>{sStep1Lead}</p>
          <p style={{ marginTop: "0.25rem", marginBottom: 0 }}>
            <strong>{sStep1Quote}</strong>
          </p>

          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem" }}>
            {sStep1Bullets.map((x, i) => (
              <li key={`${i}-${x}`}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sDepsTitle}</h2>

          <p style={{ marginTop: "0.5rem" }}>{sDepsP1}</p>

          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem" }}>
            {sDepsBullets.map((x, i) => (
              <li key={`${i}-${x}`}>{x}</li>
            ))}
          </ul>

          <p style={{ marginBottom: 0, marginTop: "0.75rem" }}>{sDepsClose}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sEstTitle}</h2>

          <p style={{ marginTop: "0.5rem" }}>{sEstP1}</p>
          <p style={{ marginBottom: 0, marginTop: "0.75rem" }}>{sEstP2}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sStaticTitle}</h2>

          <p style={{ marginTop: "0.5rem" }}>{sStaticP1}</p>
          <p style={{ marginBottom: 0, marginTop: "0.75rem" }}>{sStaticP2}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sExecTitle}</h2>

          <p style={{ marginTop: "0.5rem" }}>{sExecP1}</p>

          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem" }}>
            {sExecBullets.map((x, i) => (
              <li key={`${i}-${x}`}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sCommsTitle}</h2>

          <p style={{ marginTop: "0.5rem" }}>{sCommsP1}</p>
          <p style={{ marginBottom: 0, marginTop: "0.75rem" }}>{sCommsP2}</p>
        </div>

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h2 style={{ marginTop: 0 }}>{sPayoffTitle}</h2>

          <p style={{ marginTop: "0.5rem" }}>{sPayoffP1}</p>
        </div>

        {/* CTA-blokk i bunnen (som ønsket):
            <-- Tilbake: Hva er en fremdriftsplan  <Eksisterende knapper>  Tilbake til Progress */}
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.8rem",
              alignItems: "center",
            }}
          >
            <Link className="hero-cta" to="/progress/fremdriftsplan">
              {ctaBack}
            </Link>

            <a className="hero-cta" href={LINKS.progress} rel="noopener noreferrer">
              {bottomTry}
            </a>

            <Link className="hero-cta" to="/progress/oversikt">
              {bottomScreens}
            </Link>

            <Link className="hero-cta" to="/progress">
              {bottomBack}
            </Link>

            {/* Hvis du ønsker å beholde “Se priser” også på bunnen, kan den stå her: */}
            <Link className="hero-cta" to="/progress/priser">
              {ctaPrices}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProgressFremdriftsplanBrukPage;
