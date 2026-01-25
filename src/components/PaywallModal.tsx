// src/components/PaywallModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

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
  const r = roundKr(n);
  const isNo = lang === "no";
  return isNo ? `${r} kr` : `${r} NOK`;
}

async function ensureFirebaseUser(email: string, password: string) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken(true);
    return token;
  } catch (e: any) {
    // Hvis bruker finnes fra før → prøv login
    const code = String(e?.code || "");
    if (code === "auth/email-already-in-use") {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken(true);
      return token;
    }
    throw e;
  }
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
  // ROUTES (Worker)
  // ============================
  const ROUTE_TRIAL_START = "/api/trial/start";
  const ROUTE_CHECKOUT_CREATE = "/api/checkout/create";
  // ============================

  const base = useMemo(() => clampUrlBase(workerBaseUrl), [workerBaseUrl]);

  // Account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Company info
  const [orgName, setOrgName] = useState("");
  const [orgNr, setOrgNr] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");

  const [touched, setTouched] = useState(false);

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
    const obs = new MutationObserver(() => setIsDark(getIsDarkTheme()));
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });

    return () => obs.disconnect();
  }, [open]);

  // Reset per open/mode
  useEffect(() => {
    if (!open) return;

    setStatus(null);
    setError(null);
    setBusy(false);
    setTouched(false);

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
    passwordLabel: isNo ? "Passord" : "Password",

    orgNameLabel: isNo ? "Firmanavn" : "Company name",
    orgNrLabel: isNo ? "Org.nr" : "Org. number",
    contactNameLabel: isNo ? "Kontaktperson" : "Contact name",
    phoneLabel: isNo ? "Telefon" : "Phone",

    requiredHint: isNo ? "Alle felt må fylles ut." : "All fields are required.",

    trialTitle: isNo ? "Prøv Pro gratis i 10 dager" : "Try Pro free for 10 days",
    trialBody: isNo
      ? "Fyll inn firmaopplysninger én gang. Når du starter trial opprettes konto + org automatisk."
      : "Fill in company details once. Starting trial will automatically create your account + org.",
    startTrial: isNo ? "Start 10-dagers trial" : "Start 10-day trial",

    buyTitle: isNo ? "Kjøp Pro-lisens" : "Buy Pro license",
    buyBody: isNo
      ? "Fyll inn firmaopplysninger én gang. Når du trykker Kjøp opprettes konto + org, og du sendes til checkout."
      : "Fill in company details once. Clicking Buy creates your account + org and redirects to checkout.",

    periodLabel: isNo ? "Betalingsperiode" : "Billing period",
    month: isNo ? "Månedlig" : "Monthly",
    year: isNo ? "Årlig" : "Yearly",

    typeLabel: isNo ? "Kjøpstype" : "Purchase type",
    subscription: isNo ? "Abonnement" : "Subscription",
    oneTime: isNo ? "Engangsbetaling" : "One-time payment",

    calcPrice: isNo ? "Pris" : "Price",
    calcVat: isNo ? "Mva" : "VAT",
    calcTotal: isNo ? "Pris inkl. mva" : "Price incl. VAT",

    perMonth: isNo ? "kr/mnd" : "NOK/mo",
    perYear: isNo ? "kr/år" : "NOK/yr",

    goToCheckout: isNo ? "Kjøp og gå til betaling" : "Buy and go to checkout",

    invalidEmail: isNo ? "Skriv inn en gyldig e-postadresse." : "Enter a valid email address.",
    passwordTooShort: isNo ? "Passord må være minst 6 tegn." : "Password must be at least 6 characters.",
    networkError: isNo
      ? "Noe gikk galt. Sjekk at Worker-endepunktene er riktige."
      : "Something went wrong. Check that the Worker endpoints are correct.",
  };

  const emailOk = isValidEmail(email);
  const passwordOk = (password || "").trim().length >= 6;

  const orgNameOk = orgName.trim().length > 0;
  const orgNrOk = orgNr.replace(/\s+/g, "").trim().length > 0;
  const contactNameOk = contactName.trim().length > 0;
  const phoneOk = phone.trim().length > 0;

  const allOk = emailOk && passwordOk && orgNameOk && orgNrOk && contactNameOk && phoneOk;

  const selectedExVat = billingPeriod === "month" ? priceMonthExVat : priceYearExVat;
  const vatAmount = selectedExVat * vatRate;
  const selectedInclVat = selectedExVat + vatAmount;

  async function startTrial() {
    setTouched(true);
    setStatus(null);
    setError(null);
    if (!allOk) return;

    setBusy(true);
    try {
      const idToken = await ensureFirebaseUser(email.trim(), password.trim());

      const res = await fetch(`${base}${ROUTE_TRIAL_START}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          product: "progress",
          lang,
          email: email.trim(),

          orgName: orgName.trim(),
          orgNr: orgNr.replace(/\s+/g, "").trim(),
          contactName: contactName.trim(),
          phone: phone.trim(),
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
    setTouched(true);
    setStatus(null);
    setError(null);
    if (!allOk) return;

    setBusy(true);
    try {
      const idToken = await ensureFirebaseUser(email.trim(), password.trim());

      const successUrl = window.location.origin + "/progress/app";
      const cancelUrl = window.location.href;

      const res = await fetch(`${base}${ROUTE_CHECKOUT_CREATE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          product: "progress",
          email: email.trim(),
          lang,

          // pricing
          billingPeriod,
          purchaseType,

          // redirect
          successUrl,
          cancelUrl,

          // company info
          orgName: orgName.trim(),
          orgNr: orgNr.replace(/\s+/g, "").trim(),
          contactName: contactName.trim(),
          phone: phone.trim(),

          // optional
          tier: "intro",
          quantity: 1,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const data = await res.json().catch(() => null);
      const url = data?.url || data?.checkoutUrl;

      if (!url || typeof url !== "string") {
        throw new Error(isNo ? "Worker returnerte ingen checkout-url (forventet { url })." : "Worker returned no checkout url (expected { url }).");
      }

      window.location.assign(url);
    } catch (e: any) {
      setError(e?.message || t.networkError);
    } finally {
      setBusy(false);
    }
  }

  // Theme-driven styling (MCL)
  const overlayBg = isDark ? "rgba(0,0,0,0.86)" : "rgba(0,0,0,0.45)";
  const overlayBlur = isDark ? "blur(10px)" : "blur(6px)";

  const panelBg = "var(--mcl-surface)";
  const panelBorder = "1px solid var(--mcl-border)";
  const panelShadow = isDark ? "0 18px 60px rgba(0,0,0,0.55)" : "0 18px 60px rgba(0,0,0,0.20)";

  const line = isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.10)";

  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const chipBorder = isDark ? "1px solid rgba(255,255,255,0.20)" : "1px solid rgba(0,0,0,0.16)";

  const title = mode === "trial" ? t.trialTitle : t.buyTitle;
  const sub = mode === "trial" ? t.trialBody : t.buyBody;

  function inputStyle(showBad: boolean) {
    return {
      width: "100%",
      padding: "0.7rem 0.8rem",
      borderRadius: 12,
      border: showBad ? "1px solid rgba(255,80,80,0.75)" : chipBorder,
      background: inputBg,
      color: "inherit",
      outline: "none",
    } as React.CSSProperties;
  }

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
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "0.9rem 1rem",
            borderBottom: line,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <strong style={{ fontSize: 16 }}>{title}</strong>
            <div style={{ fontSize: 13, opacity: 0.8, color: "var(--mcl-text-dim)" }}>{sub}</div>
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
            }}
          >
            {t.close}
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1rem", overflow: "auto" }}>
          {/* Account */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.emailLabel}</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder={isNo ? "navn@firma.no" : "name@company.com"}
                style={inputStyle(touched && !emailOk)}
              />
              {touched && !emailOk && <div style={{ fontSize: 13, marginTop: 6 }}>{t.invalidEmail}</div>}
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.passwordLabel}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder={isNo ? "minst 6 tegn" : "min. 6 characters"}
                style={inputStyle(touched && !passwordOk)}
              />
              {touched && !passwordOk && <div style={{ fontSize: 13, marginTop: 6 }}>{t.passwordTooShort}</div>}
            </div>
          </div>

          {/* Company info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.orgNameLabel}</label>
              <input value={orgName} onChange={(e) => setOrgName(e.target.value)} onBlur={() => setTouched(true)} style={inputStyle(touched && !orgNameOk)} />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.orgNrLabel}</label>
              <input value={orgNr} onChange={(e) => setOrgNr(e.target.value)} onBlur={() => setTouched(true)} style={inputStyle(touched && !orgNrOk)} />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.contactNameLabel}</label>
              <input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                onBlur={() => setTouched(true)}
                style={inputStyle(touched && !contactNameOk)}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.phoneLabel}</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => setTouched(true)} style={inputStyle(touched && !phoneOk)} />
            </div>
          </div>

          {touched && !allOk && (
            <div style={{ fontSize: 13, opacity: 0.85, marginBottom: "1rem", color: "var(--mcl-text-dim)" }}>
              {t.requiredHint}
            </div>
          )}

          {mode === "trial" ? (
            <button
              type="button"
              onClick={startTrial}
              disabled={busy}
              style={{
                padding: "0.8rem 1rem",
                borderRadius: 12,
                border: chipBorder,
                background: "rgba(255,255,255,0.10)",
                color: "inherit",
                cursor: busy ? "default" : "pointer",
                fontWeight: 900,
              }}
            >
              {t.startTrial}
            </button>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr minmax(220px, 300px)",
                  gap: "1rem",
                  alignItems: "start",
                }}
              >
                {/* LEFT */}
                <div>
                  <div style={{ marginBottom: "0.9rem" }}>
                    <div style={{ fontWeight: 800, marginBottom: 6 }}>{t.periodLabel}</div>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="radio" name="billingPeriod" checked={billingPeriod === "month"} onChange={() => setBillingPeriod("month")} />
                        {t.month}
                      </label>
                      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="radio" name="billingPeriod" checked={billingPeriod === "year"} onChange={() => setBillingPeriod("year")} />
                        {t.year}
                      </label>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 6 }}>{t.typeLabel}</div>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="radio" name="purchaseType" checked={purchaseType === "subscription"} onChange={() => setPurchaseType("subscription")} />
                        {t.subscription}
                      </label>
                      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="radio" name="purchaseType" checked={purchaseType === "one_time"} onChange={() => setPurchaseType("one_time")} />
                        {t.oneTime}
                      </label>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div
                  style={{
                    border: chipBorder,
                    background: inputBg,
                    borderRadius: 12,
                    padding: "0.85rem 0.9rem",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      rowGap: 8,
                      columnGap: 14,
                      alignItems: "baseline",
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>{t.calcPrice}:</div>
                    <div style={{ textAlign: "right", fontWeight: 800 }}>{formatKr(selectedExVat, lang)}</div>

                    <div style={{ fontWeight: 800 }}>{t.calcVat}:</div>
                    <div style={{ textAlign: "right", fontWeight: 800 }}>{formatKr(vatAmount, lang)}</div>

                    <div style={{ fontWeight: 900 }}>{t.calcTotal}:</div>
                    <div style={{ textAlign: "right", fontWeight: 900 }}>
                      {formatKr(selectedInclVat, lang)}
                      {purchaseType === "subscription" && (billingPeriod === "year" ? ` ${t.perYear}` : ` ${t.perMonth}`)}
                    </div>
                  </div>

                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75, color: "var(--mcl-text-dim)" }}>{currency}</div>
                </div>
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
