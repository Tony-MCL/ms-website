import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/useI18n";
import { LINKS } from "../config/links";

type WhyBullet = { title: string; body: string };
type Tile = { title: string; body: string };

const ProgressPage: React.FC = () => {
  const { t } = useI18n();

  const heroTagline = t<string>("progress.hero.tagline");
  const heroLead1 = t<string>("progress.hero.lead1");
  const heroLead2 = t<string>("progress.hero.lead2");
  const heroLead3 = t<string>("progress.hero.lead3");
  const heroLead4 = t<string>("progress.hero.lead4");

  const ctaMoreBtn = t<string>("progress.cta.moreBtn");
  const ctaAppBtn = t<string>("progress.cta.appBtn");
  const ctaPricesBtn = t<string>("progress.cta.pricesBtn");

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
      {/* HERO */}
      <section className="fs-hero">
        <h1>Manage Progress</h1>

        <p className="fs-tagline" style={{ maxWidth: 980 }}>
          {heroTagline}
        </p>

        <p style={{ maxWidth: 980 }}>{heroLead1}</p>
        <p style={{ maxWidth: 980, marginTop: "0.75rem" }}>{heroLead2}</p>
        <p style={{ maxWidth: 980, marginTop: "0.75rem" }}>{heroLead3}</p>
        <p style={{ maxWidth: 980, marginTop: "0.75rem" }}>{heroLead4}</p>

        {/* CTA buttons */}
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
            {ctaMoreBtn}
          </Link>

          {/* Ekstern lenke til Progress-appen */}
          <a className="hero-cta" href={LINKS.progress} rel="noopener noreferrer">
            {ctaAppBtn}
          </a>

          <Link className="hero-cta" to="/progress/priser">
            {ctaPricesBtn}
          </Link>
        </div>
      </section>

      {/* WHY */}
      <section className="intro-grid two-columns" style={{ marginTop: 0 }}>
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

      {/* TILES */}
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

      {/* CTA (content only) */}
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
