import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { LINKS } from "../config/links";

type WhyBullet = { title: string; body: string };
type Tile = { title: string; body: string };

const ProgressPage: React.FC = () => {
  const { t } = useI18n();

  /* ========= HERO (FAG / INNSIKT) ========= */
  const heroTitle = t<string>("progressHero.title");
  const heroTagline = t<string>("progressHero.tagline");
  const heroLead1 = t<string>("progressHero.lead1");
  const heroLead2 = t<string>("progressHero.lead2");
  const heroLead3 = t<string>("progressHero.lead3");

  const articleLead = t<string>("progressHero.articles.lead");
  const articleCtaWhat = t<string>("progressHero.articles.ctaWhat");
  const articleCtaHow = t<string>("progressHero.articles.ctaHow");

  /* ========= SALG ========= */
  const sellTitle = t<string>("progressSell.title");
  const sellLead = t<string>("progressSell.lead");
  const sellCtaOverview = t<string>("progressSell.ctaOverview");
  const sellCtaApp = t<string>("progressSell.ctaApp");
  const sellCtaPrices = t<string>("progressSell.ctaPrices");

  /* ========= RESTEN (uendret) ========= */
  const whyTitle = t<string>("progress.why.title");
  const whyLead = t<string>("progress.why.lead");
  const whyBullets = t<WhyBullet[]>("progress.why.bullets") || [];
  const whyClose = t<string>("progress.why.close");

  const tiles = t<Tile[]>("progress.tiles") || [];
  const tilesNote = t<string>("progress.tilesNote");

  const seeTitle = t<string>("progress.see.title");
  const seeLead = t<string>("progress.see.lead");

  return (
    <main className="page">
      {/* ================= HERO ================= */}
      <section className="fs-hero">
        <h1>{heroTitle}</h1>

        <p className="fs-tagline" style={{ maxWidth: 980 }}>
          {heroTagline}
        </p>

        <p style={{ maxWidth: 980 }}>{heroLead1}</p>
        <p style={{ maxWidth: 980, marginTop: "0.75rem" }}>{heroLead2}</p>
        <p style={{ maxWidth: 980, marginTop: "0.75rem" }}>{heroLead3}</p>

        {/* Artikler (faglig fordypning) */}
        <p style={{ maxWidth: 980, marginTop: "1.25rem" }}>{articleLead}</p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.25rem",
            marginTop: "0.75rem",
            alignItems: "center",
          }}
        >
          <Link className="hero-link" to="/progress/fremdriftsplan">
            {articleCtaWhat}
          </Link>
        
          <Link className="hero-link" to="/progress/fremdriftsplan-bruk">
            {articleCtaHow}
          </Link>
        </div>
     </section>

      {/* ================= SALGSFLIS ================= */}
      <section className="intro-grid two-columns" style={{ marginTop: 0 }}>
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{sellTitle}</h3>

          <p style={{ marginTop: "0.5rem" }}>{sellLead}</p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.8rem",
              marginTop: "0.75rem",
              alignItems: "center",
            }}
          >
            <Link className="hero-cta" to="/progress/oversikt">
              {sellCtaOverview}
            </Link>

            <a className="hero-cta" href={LINKS.progress} rel="noopener noreferrer">
              {sellCtaApp}
            </a>

            <Link className="hero-cta" to="/progress/priser">
              {sellCtaPrices}
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY ================= */}
      <section className="intro-grid two-columns">
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{whyTitle}</h3>

          <p style={{ marginTop: "0.5rem" }}>{whyLead}</p>

          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem" }}>
            {whyBullets.map((b) => (
              <li key={b.title} style={{ marginBottom: "0.45rem" }}>
                <strong>{b.title}</strong> – {b.body}
              </li>
            ))}
          </ul>

          <p style={{ marginBottom: 0, marginTop: "0.75rem", whiteSpace: "pre-line" }}>
            {whyClose}
          </p>
        </div>
      </section>

      {/* ================= TILES ================= */}
      <section className="intro-grid two-columns">
        {tiles.map((tile) => (
          <div className="intro-card" key={tile.title}>
            <h3 style={{ marginTop: 0 }}>{tile.title}</h3>
            <p>{tile.body}</p>
          </div>
        ))}

        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <p style={{ margin: 0, whiteSpace: "pre-line" }}>{tilesNote}</p>
        </div>
      </section>

      {/* ================= CTA (content only) ================= */}
      <section className="intro-grid two-columns">
        <div className="intro-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ marginTop: 0 }}>{seeTitle}</h3>
          <p style={{ marginBottom: 0 }}>{seeLead}</p>
        </div>
      </section>
    </main>
  );
};

export default ProgressPage;
