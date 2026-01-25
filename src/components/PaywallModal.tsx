import React, { useEffect, useMemo, useState } from "react";
import { useAuthUser } from "../auth/useAuthUser";

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
  const ROUTE_TRIAL_START = "/trial/start";
  const ROUTE_CHECKOUT_CREATE_AUTH = "/checkout/create_auth";
  // ============================

  const base = useMemo(() => clampUrlBase(workerBaseUrl), [workerBaseUrl]);

  // Firebase auth (minimal)
  const { user, ready: authReady, signIn, register, getIdToken } = useAuthUser();

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  // Only used when not signed in
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "register">("register");

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

    // keep email if already signed in (nice UX), otherwise reset
    if (!user?.email) setEmail("");
    setPassword("");

    if (mode === "buy") {
      setBillingPeriod("month");
      setPurchaseType("subscription");
    }

    // default: register for trial, sign-in for buy
    setAuthMode(mode === "trial" ? "register" : "signin");
  }, [open, mode, user?.email]);

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

    passwordLabel: isNo ? "Passord" : "Password",
    passwordHelp: isNo
      ? "Bruk et passord du husker. Du kan logge inn senere i appen."
      : "Use a password you’ll remember. You can sign in later in the app.",

    authModeLabel: isNo ? "Konto" : "Account",
    authSignin: isNo ? "Logg inn" : "Sign in",
    authRegister: isNo ? "Registrer" : "Register",

    trialTitle: isNo ? "Prøv Pro gratis i 10 dager" : "Try Pro free for 10 days",
    trialBody: isNo
      ? "Full Pro-funksjonalitet i 10 dager. Registrer deg eller logg inn for å starte."
      : "Full Pro functionality for 10 days. Register or sign in to start.",
    startTrial: isNo ? "Start 10-dagers trial" : "Start 10-day trial",

    buyTitle: isNo ? "Kjøp Pro-lisens" : "Buy Pro license",
    buyBody: isNo
      ? "Velg betalingsperiode og kjøpstype. Du blir sendt til Stripe Checkout."
      : "Choose billing period and purchase type. You’ll be redirected to Stripe Checkout.",

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
    missingPassword: isNo ? "Skriv inn et passord." : "Enter a password.",
    networkError: isNo
      ? "Noe gikk galt. Sjekk at Worker-endepunktene er riktige."
      : "Something went wrong. Check that the Worker endpoints are correct.",
    notReady: isNo ? "Auth initialiseres …" : "Auth is initializing …",
  };

  const emailOk = isValidEmail(email);
  const showEmailError = emailTouched && !emailOk;

  const needPassword = !user; // only require password if not already signed in
  const passwordOk = !needPassword ? true : password.trim().length >= 6;

  const selectedExVat = billingPeriod === "month" ? priceMonthExVat : priceYearExVat;
  const vatAmount = selectedExVat * vatRate;
  const selectedInclVat = selectedExVat + vatAmount;

  // Same suffix behavior as original (kept)
  const totalSuffix =
    purchaseType === "one_time"
      ? ""
      : billingPeriod === "year"
        ? ` ${t.perYear}`
        : ` ${t.perMonth}`;

  async function ensureSignedIn() {
    if (user) return;

    setEmailTouched(true);
    if (!emailOk) throw new Error(t.invalidEmail);
    if (!passwordOk) throw new Error(t.missingPassword);

    if (!authReady) throw new Error(t.notReady);

    const e = email.trim();
    const p = password;

    if (authMode === "register") {
      await register(e, p);
    } else {
      await signIn(e, p);
    }
  }

  async function requireIdToken(): Promise<string> {
    const token = await getIdToken(true);
    if (!token) throw new Error(isNo ? "Ikke innlogget." : "Not signed in.");
    return token;
  }

  async function startTrial() {
    setEmailTouched(true);
    setStatus(null);
    setError(null);
    if (!emailOk) return;

    setBusy(true);
    try {
      await ensureSignedIn();
      const token = await requireIdToken();

      const res = await fetch(`${base}${ROUTE_TRIAL_START}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: "progress",
          // optional: could also send orgName later if you add input
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
      await ensureSignedIn();
      const token = await requireIdToken();

      const successUrl =
        window.location.origin + "/progress/app?from=checkout&refresh=1";
      const cancelUrl = window.location.href;

      const res = await fetch(`${base}${ROUTE_CHECKOUT_CREATE_AUTH}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interval: billingPeriod, // "month" | "year"
          purchaseType, // "subscription" | "one_time" (worker may ignore for now)
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

  // Theme-driven styling (kept)
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
  const chipBorder = isDark
    ? "1px solid rgba(255,255,255,0.20)"
    : "1px solid rgba(0,0,0,0.16)";

  const title = mode === "trial" ? t.trialTitle : t.buyTitle;
  const sub = mode === "trial" ? t.trialBody : t.buyBody;

  const showAuthBlock = !user; // when signed in, we keep modal clean

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
            }}
          >
            {t.close}
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1rem", overflow: "auto" }}>
          {/* Auth block (minimal, matches the existing style) */}
          {showAuthBlock ? (
            <div
              style={{
                border: chipBorder,
                background: inputBg,
                borderRadius: 12,
                padding: "0.85rem 0.9rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div style={{ fontWeight: 900 }}>{t.authModeLabel}</div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    style={{
                      padding: "0.45rem 0.7rem",
                      borderRadius: 10,
                      border: chipBorder,
                      background: authMode === "signin" ? "rgba(255,255,255,0.10)" : "transparent",
                      color: "inherit",
                      cursor: "pointer",
                      fontWeight: 800,
                    }}
                  >
                    {t.authSignin}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode("register")}
                    style={{
                      padding: "0.45rem 0.7rem",
                      borderRadius: 10,
                      border: chipBorder,
                      background: authMode === "register" ? "rgba(255,255,255,0.10)" : "transparent",
                      color: "inherit",
                      cursor: "pointer",
                      fontWeight: 800,
                    }}
                  >
                    {t.authRegister}
                  </button>
                </div>
              </div>

              {/* Email */}
              <div style={{ marginTop: 12 }}>
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
                    background: "transparent",
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

              {/* Password */}
              <div style={{ marginTop: 12 }}>
                <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>
                  {t.passwordLabel}
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder={isNo ? "Minst 6 tegn" : "At least 6 characters"}
                  style={{
                    width: "100%",
                    padding: "0.7rem 0.8rem",
                    borderRadius: 12,
                    border: (!passwordOk && emailTouched)
                      ? "1px solid rgba(255,80,80,0.75)"
                      : chipBorder,
                    background: "transparent",
                    color: "inherit",
                    outline: "none",
                  }}
                />
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6, color: "var(--mcl-text-dim)" }}>
                  {t.passwordHelp}
                </div>
              </div>
            </div>
          ) : null}

          {/* BUY options (kept exactly like original) */}
          {mode === "buy" ? (
            <>
              {/* Left: radios | Right: calculation */}
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

                {/* RIGHT: “Regnestykke” */}
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
                    <div style={{ textAlign: "right", fontWeight: 800 }}>
                      {formatKr(selectedExVat, lang)}
                    </div>

                    <div style={{ fontWeight: 800 }}>{t.calcVat}:</div>
                    <div style={{ textAlign: "right", fontWeight: 800 }}>
                      {formatKr(vatAmount, lang)}
                    </div>

                    <div style={{ fontWeight: 900 }}>{t.calcTotal}:</div>
                    <div style={{ textAlign: "right", fontWeight: 900 }}>
                      {formatKr(selectedInclVat, lang)}
                      {purchaseType === "subscription" &&
                        (billingPeriod === "year" ? ` ${t.perYear}` : ` ${t.perMonth}`)}
                      {/* totalSuffix kept (unused in UI), but logic preserved */}
                      {purchaseType !== "subscription" ? totalSuffix : ""}
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
                  disabled={busy || !authReady}
                  style={{
                    padding: "0.8rem 1rem",
                    borderRadius: 12,
                    border: chipBorder,
                    background: "rgba(255,255,255,0.10)",
                    color: "inherit",
                    cursor: busy ? "default" : "pointer",
                    fontWeight: 900,
                    opacity: !authReady ? 0.7 : 1,
                  }}
                >
                  {t.goToCheckout}
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={startTrial}
              disabled={busy || !authReady}
              style={{
                padding: "0.8rem 1rem",
                borderRadius: 12,
                border: chipBorder,
                background: "rgba(255,255,255,0.10)",
                color: "inherit",
                cursor: busy ? "default" : "pointer",
                fontWeight: 900,
                opacity: !authReady ? 0.7 : 1,
              }}
            >
              {t.startTrial}
            </button>
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
