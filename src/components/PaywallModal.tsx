import React, { useEffect, useMemo, useState } from "react";

type Mode = "trial" | "buy";
type BillingPeriod = "month" | "year";
type PurchaseType = "subscription" | "one_time";

type Props = {
  open: boolean;
  mode: Mode;
  onClose: () => void;

  lang: string; // "no" | "en"
  workerBaseUrl: string;

  // Pricing (ex VAT) shown in modal
  priceMonthExVat: number; // e.g. 129
  priceYearExVat: number; // e.g. 1290
  vatRate: number; // e.g. 0.25

  currency: string; // "NOK"
};

function clampUrlBase(u: string) {
  return (u || "").replace(/\/+$/, "");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getIsDarkTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function roundKr(v: number) {
  return Math.round(v);
}

function formatKr(n: number, lang: string) {
  // Vi runder til hele kroner for visning
  const r = roundKr(n);
  const isNo = lang === "no";
  return isNo ? `${r} kr` : `${r} NOK`;
}

const PaywallModal: React.FC<Props> = ({
  open,
  mode,
  onClose,
  lang,
  workerBaseUrl,
  priceMonthExVat,
  priceYearExVat,
  vatRate,
  currency,
}) => {
  const isNo = lang === "no";

  // ============================
  // JUSTER ROUTES HER VED BEHOV
  // ============================
  const ROUTE_TRIAL_START = "/api/trial/start";
  const ROUTE_CHECKOUT_CREATE = "/api/checkout/create";
  // ============================

  const base = useMemo(() => clampUrlBase(workerBaseUrl), [workerBaseUrl]);

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("month");
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("subscription");

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Theme awareness while open
  const [isDark, setIsDark] = useState(() => getIsDarkTheme());
  useEffect(() => {
    if (!open) return;

    setIsDark(getIsDarkTheme());

    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      setIsDark(getIsDarkTheme());
    });
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });

    return () => obs.disconnect();
  }, [open]);

  // Reset per open/mode
  useEffect(() => {
    if (!open) return;

    setStatus(null);
    setError(null);
    setBusy(false);
    setEmailTouched(false);

    // Default “sane” selections for buy
    if (mode === "buy") {
      setBillingPeriod("month");
      setPurchaseType("subscription");
    }
  }, [open, mode]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const t = {
    close: isNo ? "Lukk" : "Close",

    emailLabel: isNo ? "E-postadresse" : "Email address",
    emailHelp: isNo
      ? "Brukes kun for å aktivere trial / knytte lisens til bruker."
      : "Used to activate trial / connect license to a user.",

    trialTitle: isNo ? "Prøv Pro gratis i 10 dager" : "Try Pro free for 10 days",
    trialBody: isNo
      ? "Full Pro-funksjonalitet i 10 dager. Registrer deg med e-postadresse for å starte."
      : "Full Pro functionality for 10 days. Register with an email address to start.",
    startTrial: isNo ? "Start 10-dagers trial" : "Start 10-day trial",

    buyTitle: isNo ? "Kjøp Pro-lisens" : "Buy Pro license",
    buyBody: isNo
      ? "Velg betalingsperiode og kjøpstype. Du blir sendt til checkout."
      : "Choose billing period and purchase type. You’ll be redirected to checkout.",

    periodLabel: isNo ? "Betalingsperiode" : "Billing period",
    month: isNo ? "Månedlig" : "Monthly",
    year: isNo ? "Årlig" : "Yearly",

    typeLabel: isNo ? "Kjøpstype" : "Purchase type",
    subscription: isNo ? "Abonnement" : "Subscription",
    oneTime: isNo ? "Engangsbetaling" : "One-time payment",

    priceHeader: isNo ? "Pris" : "Price",
    exVat: isNo ? "Eks. mva" : "Ex. VAT",
    inclVat: isNo ? "Inkl. mva" : "Incl. VAT",
    vatInfo: isNo
      ? `Mva: ${Math.round(vatRate * 100)}%`
      : `VAT: ${Math.round(vatRate * 100)}%`,

    chosen: isNo ? "Valgt" : "Chosen",
    perMonth: isNo ? "per måned" : "per month",
    perYear: isNo ? "per år" : "per year",

    goToCheckout: isNo ? "Gå til betaling" : "Go to checkout",

    invalidEmail: isNo ? "Skriv inn en gyldig e-postadresse." : "Enter a valid email address.",
    networkError: isNo
      ? "Noe gikk galt. Sjekk at Worker-endepunktene er riktige."
      : "Something went wrong. Check that the Worker endpoints are correct.",
  };

  const emailOk = isValidEmail(email);
  const showEmailError = emailTouched && !emailOk;

  const selectedExVat =
    billingPeriod === "month" ? priceMonthExVat : priceYearExVat;
  const selectedInclVat = selectedExVat * (1 + vatRate);

  const monthInclVat = priceMonthExVat * (1 + vatRate);
  const yearInclVat = priceYearExVat * (1 + vatRate);

  async function startTrial() {
    setEmailTouched(true);
    setStatus(null);
    setError(null);
    if (!emailOk) return;

    setBusy(true);
    try {
      const res = await fetch(`${base}${ROUTE_TRIAL_START}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), lang }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }

      let msg = isNo
        ? "Trial er startet. Du kan nå bruke Pro-funksjoner i 10 dager."
        : "Trial started. You can now use Pro features for 10 days.";
      try {
        const data = await res.json();
        if (data?.message) msg = String(data.message);
      } catch {
        // ignore
      }
      setStatus(msg);
    } catch (e: any) {
      setError(e?.message || t.networkError);
    } finally {
      setBusy(false);
    }
  }

  async function goToCheckout() {
    setEmailTouched(true);
    setStatus(null);
    setError(null);
    if (!emailOk) return;

    setBusy(true);
    try {
      const successUrl = window.location.origin + "/progress/app";
      const cancelUrl = window.location.href;

      const res = await fetch(`${base}${ROUTE_CHECKOUT_CREATE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          lang,
          billingPeriod,
          purchaseType,
          successUrl,
          cancelUrl,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const data = await res.json().catch(() => null);
      const url = data?.url || data?.checkoutUrl;

      if (!url || typeof url !== "string") {
        throw new Error(
          isNo
            ? "Worker returnerte ingen checkout-url (forventet { url })."
            : "Worker returned no checkout url (expected { url })."
        );
      }

      window.location.assign(url);
    } catch (e: any) {
      setError(e?.message || t.networkError);
    } finally {
      setBusy(false);
    }
  }

  // Theme-driven styling
  const overlayBg = isDark ? "rgba(0,0,0,0.86)" : "rgba(0,0,0,0.45)";
  const overlayBlur = isDark ? "blur(10px)" : "blur(6px)";

  const panelBg = "var(--mcl-surface)";
  const panelBorder = "1px solid var(--mcl-border)";
  const panelShadow = isDark
    ? "0 18px 60px rgba(0,0,0,0.55)"
    : "0 18px 60px rgba(0,0,0,0.20)";

  const line = isDark
    ? "1px solid rgba(255,255,255,0.12)"
    : "1px solid rgba(0,0,0,0.10)";

  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const chipBgActive = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)";
  const chipBorder = isDark
    ? "1px solid rgba(255,255,255,0.20)"
    : "1px solid rgba(0,0,0,0.16)";

  const title = mode === "trial" ? t.trialTitle : t.buyTitle;
  const sub = mode === "trial" ? t.trialBody : t.buyBody;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: "fixed",
        top: "var(--header-height)",
        left: 0,
        right: 0,
        bottom: 0,
        background: overlayBg,
        backdropFilter: overlayBlur,
        WebkitBackdropFilter: overlayBlur,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(760px, 100%)",
          maxHeight: "calc(100vh - var(--header-height) - 2rem)",
          display: "flex",
          flexDirection: "column",
          borderRadius: 16,
          overflow: "hidden",
          background: panelBg,
          border: panelBorder,
          boxShadow: panelShadow,
          color: "var(--mcl-text)",
        }}
      >
        {/* Top bar: Title + close */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.9rem 1rem",
            borderBottom: line,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <strong style={{ fontSize: 16 }}>{title}</strong>
            <div style={{ fontSize: 13, opacity: 0.8, color: "var(--mcl-text-dim)" }}>
              {sub}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "0.45rem 0.7rem",
              borderRadius: 10,
              border: chipBorder,
              background: inputBg,
              color: "inherit",
              cursor: "pointer",
              flex: "0 0 auto",
              height: 36,
              alignSelf: "flex-start",
            }}
          >
            {t.close}
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1rem", overflow: "auto" }}>
          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>
              {t.emailLabel}
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              placeholder={isNo ? "navn@firma.no" : "name@company.com"}
              style={{
                width: "100%",
                padding: "0.7rem 0.8rem",
                borderRadius: 12,
                border: showEmailError
                  ? "1px solid rgba(255,80,80,0.75)"
                  : chipBorder,
                background: inputBg,
                color: "inherit",
                outline: "none",
              }}
            />
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6, color: "var(--mcl-text-dim)" }}>
              {t.emailHelp}
            </div>
            {showEmailError && (
              <div style={{ fontSize: 13, marginTop: 6, opacity: 0.95 }}>
                {t.invalidEmail}
              </div>
            )}
          </div>

          {mode === "trial" ? (
            <>
              <button
                type="button"
                onClick={startTrial}
                disabled={busy}
                style={{
                  padding: "0.8rem 1rem",
                  borderRadius: 12,
                  border: chipBorder,
                  background: chipBgActive,
                  color: "inherit",
                  cursor: busy ? "default" : "pointer",
                  fontWeight: 900,
                }}
              >
                {t.startTrial}
              </button>
            </>
          ) : (
            <>
              {/* Pricing summary (month vs year) */}
              <div
                style={{
                  border: chipBorder,
                  background: inputBg,
                  borderRadius: 12,
                  padding: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <strong>{t.priceHeader}</strong>
                  <span style={{ fontSize: 13, opacity: 0.8, color: "var(--mcl-text-dim)" }}>
                    {t.vatInfo}
                  </span>
                </div>

                <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                  {/* Month row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 10,
                      alignItems: "center",
                      padding: "0.65rem 0.7rem",
                      borderRadius: 10,
                      border: billingPeriod === "month" ? chipBorder : "1px solid transparent",
                      background: billingPeriod === "month" ? chipBgActive : "transparent",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800 }}>
                        {t.month} ({formatKr(priceMonthExVat, lang)} {t.exVat})
                      </div>
                      <div style={{ fontSize: 13, opacity: 0.85, color: "var(--mcl-text-dim)" }}>
                        {formatKr(monthInclVat, lang)} {t.inclVat} • {t.perMonth}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, opacity: billingPeriod === "month" ? 1 : 0.75 }}>
                      {billingPeriod === "month" ? `✓ ${t.chosen}` : ""}
                    </div>
                  </div>

                  {/* Year row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 10,
                      alignItems: "center",
                      padding: "0.65rem 0.7rem",
                      borderRadius: 10,
                      border: billingPeriod === "year" ? chipBorder : "1px solid transparent",
                      background: billingPeriod === "year" ? chipBgActive : "transparent",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800 }}>
                        {t.year} ({formatKr(priceYearExVat, lang)} {t.exVat})
                      </div>
                      <div style={{ fontSize: 13, opacity: 0.85, color: "var(--mcl-text-dim)" }}>
                        {formatKr(yearInclVat, lang)} {t.inclVat} • {t.perYear}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, opacity: billingPeriod === "year" ? 1 : 0.75 }}>
                      {billingPeriod === "year" ? `✓ ${t.chosen}` : ""}
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing period */}
              <div style={{ marginTop: "0.2rem" }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{t.periodLabel}</div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="radio"
                      name="billingPeriod"
                      checked={billingPeriod === "month"}
                      onChange={() => setBillingPeriod("month")}
                    />
                    {t.month}
                  </label>
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="radio"
                      name="billingPeriod"
                      checked={billingPeriod === "year"}
                      onChange={() => setBillingPeriod("year")}
                    />
                    {t.year}
                  </label>
                </div>
              </div>

              {/* Purchase type */}
              <div style={{ marginTop: "0.9rem" }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{t.typeLabel}</div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="radio"
                      name="purchaseType"
                      checked={purchaseType === "subscription"}
                      onChange={() => setPurchaseType("subscription")}
                    />
                    {t.subscription}
                  </label>
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="radio"
                      name="purchaseType"
                      checked={purchaseType === "one_time"}
                      onChange={() => setPurchaseType("one_time")}
                    />
                    {t.oneTime}
                  </label>
                </div>
              </div>

              {/* Selected total line */}
              <div style={{ marginTop: "0.9rem", opacity: 0.9, color: "var(--mcl-text-dim)" }}>
                <strong style={{ color: "var(--mcl-text)" }}>
                  {formatKr(selectedExVat, lang)} {t.exVat}
                </strong>{" "}
                /{" "}
                <strong style={{ color: "var(--mcl-text)" }}>
                  {formatKr(selectedInclVat, lang)} {t.inclVat}
                </strong>{" "}
                • {billingPeriod === "month" ? t.perMonth : t.perYear} ({currency})
              </div>

              <div style={{ marginTop: "1.1rem" }}>
                <button
                  type="button"
                  onClick={goToCheckout}
                  disabled={busy}
                  style={{
                    padding: "0.8rem 1rem",
                    borderRadius: 12,
                    border: chipBorder,
                    background: chipBgActive,
                    color: "inherit",
                    cursor: busy ? "default" : "pointer",
                    fontWeight: 900,
                  }}
                >
                  {t.goToCheckout}
                </button>
              </div>
            </>
          )}

          {(status || error) && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 0.9rem",
                borderRadius: 12,
                border: chipBorder,
                background: inputBg,
                opacity: 0.98,
              }}
            >
              {error ? <div>{error}</div> : <div>{status}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
