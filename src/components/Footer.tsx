import React from "react";
import { useI18n } from "../i18n/useI18n";
import { LINKS } from "../config/links";

// Eksterne lenker tilbake til Morning Coffee Labs (HashRouter)
function mclHref(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${LINKS.mcl}/#${p}`;
}

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-copy">
          {t("footer.copyright")} © {year}
        </span>

        <nav className="footer-links">
          <a href={mclHref("/kjopsvilkar")} rel="noopener noreferrer">
            {t("footer.links.termsPurchase")}
          </a>
          <span>·</span>

          <a href={mclHref("/brukervilkar")} rel="noopener noreferrer">
            {t("footer.links.termsUse")}
          </a>
          <span>·</span>

          <a href={mclHref("/personvern")} rel="noopener noreferrer">
            {t("footer.links.privacy")}
          </a>
          <span>·</span>

          <a href={mclHref("/refusjon")} rel="noopener noreferrer">
            {t("footer.links.refund")}
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
