import React, { useEffect, useMemo, useState } from "react";

type Mode = "trial" | "buy";

type BillingPeriod = "month" | "year";
type PurchaseType = "subscription" | "one_time";

type Props = {
  open: boolean;
  mode: Mode;
  onClose: () => void;

  // "no" | "en"
  lang: string;

  // Worker base URL, f.eks:
  // https://gentle-wildflower-980e.morningcoffeelabs.workers.dev
  workerBaseUrl: string;

  // Intro-pris tekst til visning i modalen (ikke brukt til Stripe-logikk)
  introPriceLabel: string;
};

function clampUrlBase(u: string) {
  return (u || "").replace(/\/+$/, "");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const PaywallModal: React.FC<Props> = ({
  open,
  mode,
  onClose,
  lang,
  workerBaseUrl,
  introPriceLabel,
}) => {
  const isNo = lang === "no";

  // ============================
  // JUSTER ROUTES HER VED BEHOV
  // ============================
  const ROUTE_TRIAL_START = "/api/trial/start";
  const ROUTE_CHECKOUT_CREATE = "/api/checkout/create";
  // ============================

  const base = useMemo(() => clampUrlBase(workerBaseUrl), [workerBaseUrl]);

  const [tab, setTab] = useState<Mode>(mode);

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("month");
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("subscription");

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync mode -> tab when opened / changed
  useEffect(() => {
    if (open) {
      setTab(mode);
      setStatus(null);
      setError(null);
      setBusy(false);
      setEmailTouched(false);
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
    title: isNo ? "Lisens og trial" : "License & trial",
    close: isNo ? "Lukk" : "Close",

    tabTrial: isNo ? "Start trial" : "Start trial",
    tabBuy: isNo ? "Kjøp Pro" : "Buy Pro",

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
    priceLabel: isNo ? "Pris" : "Price",

    periodLabel: isNo ? "Betalingsperiode" : "Billing period",
    month: isNo ? "Månedlig" : "Monthly",
    year: isNo ? "Årlig" : "Yearly",

    typeLabel: isNo ? "Kjøpstype" : "Purchase type",
    subscription: isNo ? "Abonnement" : "Subscription",
    oneTime: isNo ? "Engangsbetaling" : "One-time payment",

    goToCheckout: isNo ? "Gå til betaling" : "Go to checkout",

    invalidEmail: isNo ? "Skriv inn en gyldig e-postadresse." : "Enter a valid email address.",
    networkError: isNo
      ? "Noe gikk galt. Sjekk at Worker-endepunktene er riktige."
      : "Something went wrong. Check that the Worker endpoints are correct.",
  };

  const emailOk = isValidEmail(email);
  const showEmailError = emailTouched && !emailOk;

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
        body: JSON.stringify({
          email: email.trim(),
          lang,
        }),
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
          billingPeriod, // "month" | "year"
          purchaseType, // "subscription" | "one_time"
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      onClick={onClose}
      style={{
        position: "fixed",
        top: "var(--header-height)",
        left: 0,
        right: 0,
        bottom: 0,

        // ✅ Kutt støy: mørkere + blur
        background: "rgba(0,0,0,0.86)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",

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
          width: "min(720px, 100%)",
          maxHeight: "calc(100vh - var(--header-height) - 2rem)",
          display: "flex",
          flexDirection: "column",
          borderRadius: 16,
          overflow: "hidden",

          // ✅ Tett boks: ingen gjennomsikt
          background: "rgba(16,16,16,0.98)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.85rem 1rem",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <strong>{t.title}</strong>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "0.45rem 0.7rem",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.06)",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            {t.close}
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "0.75rem 1rem",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <button
            type="button"
            onClick={() => setTab("trial")}
            style={{
              padding: "0.55rem 0.8rem",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.20)",
              background: tab === "trial" ? "rgba(255,255,255,0.10)" : "transparent",
              color: "inherit",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            {t.tabTrial}
          </button>

          <button
            type="button"
            onClick={() => setTab("buy")}
            style={{
              padding: "0.55rem 0.8rem",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.20)",
              background: tab === "buy" ? "rgba(255,255,255,0.10)" : "transparent",
              color: "inherit",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            {t.tabBuy}
          </button>

          <div style={{ marginLeft: "auto", opacity: 0.9, fontSize: 13 }}>
            {t.priceLabel}: <strong>{introPriceLabel}</strong>
          </div>
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
                  : "1px solid rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.06)",
                color: "inherit",
                outline: "none",
              }}
            />
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
              {t.emailHelp}
            </div>
            {showEmailError && (
              <div style={{ fontSize: 13, marginTop: 6, opacity: 0.95 }}>
                {t.invalidEmail}
              </div>
            )}
          </div>

          {tab === "trial" ? (
            <>
              <h3 style={{ marginTop: 0 }}>{t.trialTitle}</h3>
              <p style={{ opacity: 0.92 }}>{t.trialBody}</p>

              <button
                type="button"
                onClick={startTrial}
                disabled={busy}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.22)",
                  background: "rgba(255,255,255,0.10)",
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
              <h3 style={{ marginTop: 0 }}>{t.buyTitle}</h3>
              <p style={{ opacity: 0.92 }}>{t.buyBody}</p>

              {/* Billing period */}
              <div style={{ marginTop: "0.9rem" }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  {t.periodLabel}
                </div>
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
                <div style={{ fontWeight: 800, marginBottom: 6 }}>
                  {t.typeLabel}
                </div>
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

              <div style={{ marginTop: "1.1rem" }}>
                <button
                  type="button"
                  onClick={goToCheckout}
                  disabled={busy}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "rgba(255,255,255,0.10)",
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

          {/* Status / error */}
          {(status || error) && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 0.9rem",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
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
