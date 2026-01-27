// src/components/PaywallModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

type Mode = "trial" | "buy";
type BillingPeriod = "month" | "year";
type PurchaseType = "subscription" | "one_time";
type CustomerType = "company" | "individual";

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

function normalizeOrgNr(s: string) {
  return (s || "").replace(/\s+/g, "").trim();
}

function isProbablyOrgNr(s: string) {
  const x = normalizeOrgNr(s);
  // enkel sjekk (9 siffer) – ikke “hard” validering
  return !x || /^\d{9}$/.test(x);
}

function getQueryParam(name: string) {
  try {
    const u = new URL(window.location.href);
    return u.searchParams.get(name);
  } catch {
    return null;
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
  // JUSTER ROUTES HER VED BEHOV
  // ============================
  const ROUTE_TRIAL_START = "/api/trial/start";
  const ROUTE_CHECKOUT_CREATE = "/api/checkout/create";
  // ============================

  const base = useMemo(() => clampUrlBase(workerBaseUrl), [workerBaseUrl]);

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Buy: company vs individual
  const [customerType, setCustomerType] = useState<CustomerType>("company");

  // Person / Company fields (buy)
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgNr, setOrgNr] = useState("");

  // Common (buy) – optional
  const [country, setCountry] = useState("NO");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");

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
    setPasswordTouched(false);

    // Ikke nullstill epost/passord automatisk
    if (mode === "trial") {
      // Trial har ikke kjøpsfelter
      setCustomerType("company");
      setFullName("");
      setOrgName("");
      setOrgNr("");
      setCountry("NO");
      setContactName("");
      setPhone("");
    }

    if (mode === "buy") {
      setBillingPeriod("month");
      setPurchaseType("subscription");
      // behold customerType osv mellom åpninger om du vil – men vi setter safe defaults
      if (!country) setCountry("NO");
    }
  }, [open, mode]); // eslint-disable-line react-hooks/exhaustive-deps

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
      ? "Brukes til å opprette konto og knytte lisens/trial til bruker."
      : "Used to create an account and connect license/trial to the user.",

    passwordLabel: isNo ? "Passord" : "Password",
    passwordHelp: isNo
      ? "Brukes til å opprette/logge inn brukeren før trial/kjøp."
      : "Used to create/sign in the user before trial/purchase.",

    buyCustomerType: isNo ? "Kjøper som" : "Buying as",
    company: isNo ? "Bedrift" : "Company",
    individual: isNo ? "Privat" : "Individual",

    detailsTitle: isNo ? "Opplysninger" : "Details",
    fullName: isNo ? "Navn" : "Full name",
    orgTitle: isNo ? "Firmanavn" : "Company name",
    orgNr: isNo ? "Org.nr" : "Org number",
    country: isNo ? "Land" : "Country",

    contactOptionalTitle: isNo ? "Kontakt (valgfritt)" : "Contact (optional)",
    contactName: isNo ? "Kontaktperson" : "Contact person",
    phone: isNo ? "Telefon" : "Phone",

    trialTitle: isNo ? "Prøv Pro gratis i 10 dager" : "Try Pro free for 10 days",
    trialBody: isNo
      ? "Full Pro-funksjonalitet i 10 dager. Skriv inn e-post og passord for å starte."
      : "Full Pro functionality for 10 days. Enter email and password to start.",
    startTrial: isNo ? "Start 10-dagers trial" : "Start 10-day trial",
    trialOk: isNo
      ? "Trial er startet. Du kan nå bruke Pro-funksjoner i 10 dager."
      : "Trial started. You can now use Pro features for 10 days.",
    openApp: isNo ? "Åpne Progress-appen" : "Open the Progress app",

    buyTitle: isNo ? "Kjøp Pro-lisens" : "Buy Pro license",
    buyBody: isNo
      ? "Velg privat eller bedrift, fyll inn det som trengs, og gå til betaling."
      : "Choose individual or company, fill what’s required, and proceed to checkout.",

    requiredNote: isNo ? "* Påkrevd" : "* Required",

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

    goToCheckout: isNo ? "Gå til betaling" : "Go to checkout",

    invalidEmail: isNo ? "Skriv inn en gyldig e-postadresse." : "Enter a valid email address.",
    invalidPassword: isNo ? "Passord må være minst 6 tegn." : "Password must be at least 6 characters.",
    missingRequired: isNo ? "Fyll inn alle påkrevde felt." : "Fill in all required fields.",
    invalidOrgNr: isNo ? "Org.nr ser ikke riktig ut (9 siffer)." : "Org number looks wrong (9 digits).",
    networkError: isNo
      ? "Noe gikk galt. Sjekk at Worker-endepunktene er riktige."
      : "Something went wrong. Check that the Worker endpoints are correct.",
  };

  const emailOk = isValidEmail(email);
  const passwordOk = password.trim().length >= 6;

  const showEmailError = emailTouched && !emailOk;
  const showPasswordError = passwordTouched && !passwordOk;

  const orgNrOk = isProbablyOrgNr(orgNr);

  // Required fields for BUY
  const countryOk = Boolean((country || "").trim());
  const buyRequiredOk =
    customerType === "individual"
      ? Boolean(fullName.trim() && countryOk)
      : Boolean(orgName.trim() && normalizeOrgNr(orgNr) && orgNrOk && countryOk);

  const selectedExVat = billingPeriod === "month" ? priceMonthExVat : priceYearExVat;
  const vatAmount = selectedExVat * vatRate;
  const selectedInclVat = selectedExVat + vatAmount;

  const title = mode === "trial" ? t.trialTitle : t.buyTitle;
  const sub = mode === "trial" ? t.trialBody : t.buyBody;

  async function ensureAuthAndGetIdToken() {
    const e = email.trim();
    const p = password;

    try {
      const cred = await createUserWithEmailAndPassword(auth, e, p);
      return await cred.user.getIdToken(true);
    } catch (err: any) {
      const code = String(err?.code || "");
      if (code.includes("email-already-in-use")) {
        const cred = await signInWithEmailAndPassword(auth, e, p);
        return await cred.user.getIdToken(true);
      }
      throw err;
    }
  }

  async function startTrial() {
    setEmailTouched(true);
    setPasswordTouched(true);
    setStatus(null);
    setError(null);

    if (!emailOk) return;
    if (!passwordOk) return;

    setBusy(true);
    try {
      const idToken = await ensureAuthAndGetIdToken();

      const res = await fetch(`${base}${ROUTE_TRIAL_START}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          product: "progress",
          lang,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }

      setStatus(t.trialOk);
    } catch (e: any) {
      setError(e?.message || t.networkError);
    } finally {
      setBusy(false);
    }
  }

  async function goToCheckout() {
    setEmailTouched(true);
    setPasswordTouched(true);
    setStatus(null);
    setError(null);

    if (!emailOk) return;
    if (!passwordOk) return;

    if (!buyRequiredOk) {
      if (customerType === "company" && !orgNrOk) setError(t.invalidOrgNr);
      else setError(t.missingRequired);
      return;
    }

    setBusy(true);
    try {
      const idToken = await ensureAuthAndGetIdToken();

      const origin = window.location.origin;
      const successUrl = `${origin}/progress/pricing?from=checkout&refresh=1`;
      const cancelUrl = `${origin}/progress/pricing?canceled=1`;

      const payload: any = {
        email: email.trim(),
        lang,
        billingPeriod,
        purchaseType,
        successUrl,
        cancelUrl,

        customerType,
        country: country.trim(),

        // optional contact
        contactName: contactName.trim() || undefined,
        phone: phone.trim() || undefined,

        quantity: 1,
        tier: "intro",
      };

      if (customerType === "individual") {
        payload.fullName = fullName.trim();
      } else {
        payload.orgName = orgName.trim();
        payload.orgNr = normalizeOrgNr(orgNr);
      }

      const res = await fetch(`${base}${ROUTE_CHECKOUT_CREATE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
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

  const goToAppHref = "/progress/app";

  // Theme-driven styling
  const overlayBg = isDark ? "rgba(0,0,0,0.86)" : "rgba(0,0,0,0.45)";
  const overlayBlur = isDark ? "blur(10px)" : "blur(6px)";

  const panelBg = "var(--mcl-surface)";
  const panelBorder = "1px solid var(--mcl-border)";
  const panelShadow = isDark ? "0 18px 60px rgba(0,0,0,0.55)" : "0 18px 60px rgba(0,0,0,0.20)";

  const line = isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.10)";

  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const chipBorder = isDark ? "1px solid rgba(255,255,255,0.20)" : "1px solid rgba(0,0,0,0.16)";

  const dangerBorder = "1px solid rgba(255,80,80,0.75)";

  const requiredStar = <span style={{ opacity: 0.85 }}>*</span>;

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
        {/* Top bar */}
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
          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>
              {t.emailLabel} {requiredStar}
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
                border: showEmailError ? dangerBorder : chipBorder,
                background: inputBg,
                color: "inherit",
                outline: "none",
              }}
            />
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6, color: "var(--mcl-text-dim)" }}>{t.emailHelp}</div>
            {showEmailError && <div style={{ fontSize: 13, marginTop: 6, opacity: 0.95 }}>{t.invalidEmail}</div>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>
              {t.passwordLabel} {requiredStar}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              placeholder={isNo ? "Minst 6 tegn" : "At least 6 characters"}
              style={{
                width: "100%",
                padding: "0.7rem 0.8rem",
                borderRadius: 12,
                border: showPasswordError ? dangerBorder : chipBorder,
                background: inputBg,
                color: "inherit",
                outline: "none",
              }}
            />
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6, color: "var(--mcl-text-dim)" }}>{t.passwordHelp}</div>
            {showPasswordError && <div style={{ fontSize: 13, marginTop: 6, opacity: 0.95 }}>{t.invalidPassword}</div>}
          </div>

          {/* BUY: customer type + required fields */}
          {mode === "buy" && (
            <div style={{ marginBottom: "1rem" }}>
              {/* subtle subheading (still "one bolk") */}
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", marginBottom: 10 }}>
                <div style={{ fontWeight: 900 }}>{t.detailsTitle}</div>
                <div style={{ fontSize: 12, opacity: 0.75, color: "var(--mcl-text-dim)" }}>{t.requiredNote}</div>
              </div>

              {/* toggle */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>{t.buyCustomerType}</div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="radio"
                      name="customerType"
                      checked={customerType === "company"}
                      onChange={() => setCustomerType("company")}
                    />
                    {t.company}
                  </label>
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="radio"
                      name="customerType"
                      checked={customerType === "individual"}
                      onChange={() => setCustomerType("individual")}
                    />
                    {t.individual}
                  </label>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {customerType === "individual" ? (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>
                      {t.fullName} {requiredStar}
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isNo ? "Ola Nordmann" : "Jane Doe"}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.8rem",
                        borderRadius: 12,
                        border: chipBorder,
                        background: inputBg,
                        color: "inherit",
                        outline: "none",
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>
                        {t.orgTitle} {requiredStar}
                      </label>
                      <input
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder={isNo ? "Firma AS" : "Company Ltd"}
                        style={{
                          width: "100%",
                          padding: "0.7rem 0.8rem",
                          borderRadius: 12,
                          border: chipBorder,
                          background: inputBg,
                          color: "inherit",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>
                        {t.orgNr} {requiredStar}
                      </label>
                      <input
                        value={orgNr}
                        onChange={(e) => setOrgNr(e.target.value)}
                        placeholder={isNo ? "9 siffer" : "9 digits"}
                        style={{
                          width: "100%",
                          padding: "0.7rem 0.8rem",
                          borderRadius: 12,
                          border: !orgNrOk ? dangerBorder : chipBorder,
                          background: inputBg,
                          color: "inherit",
                          outline: "none",
                        }}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>
                    {t.country} {requiredStar}
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.8rem",
                      borderRadius: 12,
                      border: chipBorder,
                      background: inputBg,
                      color: "inherit",
                      outline: "none",
                    }}
                  >
                    <option value="NO">{isNo ? "Norge" : "Norway"}</option>
                    <option value="SE">Sweden</option>
                    <option value="DK">Denmark</option>
                    <option value="FI">Finland</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="DE">Germany</option>
                    <option value="NL">Netherlands</option>
                    <option value="FR">France</option>
                    <option value="OTHER">{isNo ? "Annet" : "Other"}</option>
                  </select>
                </div>
              </div>

              {/* optional contact */}
              <div style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 900, marginBottom: 10 }}>{t.contactOptionalTitle}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.contactName}</label>
                    <input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={isNo ? "Ola Nordmann" : "Jane Doe"}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.8rem",
                        borderRadius: 12,
                        border: chipBorder,
                        background: inputBg,
                        color: "inherit",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.phone}</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={isNo ? "+47 ..." : "+47 ..."}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.8rem",
                        borderRadius: 12,
                        border: chipBorder,
                        background: inputBg,
                        color: "inherit",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  background: "rgba(255,255,255,0.10)",
                  color: "inherit",
                  cursor: busy ? "default" : "pointer",
                  fontWeight: 900,
                }}
              >
                {t.startTrial}
              </button>

              {status && (
                <div style={{ marginTop: "0.75rem" }}>
                  <a
                    href={goToAppHref}
                    className="hero-cta"
                    style={{ display: "inline-block", textDecoration: "none" }}
                  >
                    {t.openApp}
                  </a>
                </div>
              )}
            </>
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

                  <div>
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

                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75, color: "var(--mcl-text-dim)" }}>
                    {currency}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "1.1rem" }}>
                <button
                  type="button"
                  onClick={goToCheckout}
                  disabled={busy || !emailOk || !passwordOk || !buyRequiredOk}
                  style={{
                    padding: "0.8rem 1rem",
                    borderRadius: 12,
                    border: chipBorder,
                    background: "rgba(255,255,255,0.10)",
                    color: "inherit",
                    cursor: busy ? "default" : "pointer",
                    fontWeight: 900,
                    opacity: busy || !emailOk || !passwordOk || !buyRequiredOk ? 0.6 : 1,
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
