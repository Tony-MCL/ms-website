import React, { useEffect, useMemo, useState } from "react";
import AuthPanel from "./AuthPanel";
import { useAuthUser } from "./useAuthUser";

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

  currency: string; // e.g. "NOK"
};

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

  const { user, loading: authLoading, getIdToken } = useAuthUser();

  const t = useMemo(() => {
    if (isNo) {
      return {
        titleTrial: "Start prøveperiode",
        titleBuy: "Oppgrader til Pro",

        emailLabel: "E-post",
        emailHint: "Bruk samme e-post som du logger inn med.",
        companyTitle: "Firmainfo",
        orgNameLabel: "Firmanavn",
        orgNrLabel: "Org.nr (9 siffer)",
        contactNameLabel: "Kontaktperson",
        phoneLabel: "Telefon",

        billingTitle: "Betaling",
        billingPeriodLabel: "Faktureringsperiode",
        perMonth: "per mnd",
        perYear: "per år",

        purchaseTypeLabel: "Kjøpstype",
        purchaseSub: "Abonnement",
        purchaseOneTime: "Engangsbetaling",

        buttonTrial: "Start prøveperiode",
        buttonCheckout: "Gå til betaling",
        buttonClose: "Lukk",

        trialInfo:
          "Prøveperioden gir deg Pro-funksjoner i 10 dager. Etterpå blir prosjekter arkivert (ikke slettet) iht. 90-dagers regel, og kan gjenopprettes når du aktiverer Pro igjen.",
        buyInfo:
          "Du fyller inn firmainfo én gang. Etter betaling oppgraderes kontoen automatisk når Stripe-webhooken er mottatt.",

        errorEmail: "Skriv inn gyldig e-post.",
        errorOrgName: "Firmanavn må fylles inn.",
        errorOrgNr: "Org.nr må være 9 siffer.",
        errorSignin: "Du må logge inn før du kan fortsette.",
      };
    }

    return {
      titleTrial: "Start trial",
      titleBuy: "Upgrade to Pro",

      emailLabel: "Email",
      emailHint: "Use the same email you sign in with.",
      companyTitle: "Company info",
      orgNameLabel: "Company name",
      orgNrLabel: "Org. no. (9 digits)",
      contactNameLabel: "Contact person",
      phoneLabel: "Phone",

      billingTitle: "Payment",
      billingPeriodLabel: "Billing period",
      perMonth: "per month",
      perYear: "per year",

      purchaseTypeLabel: "Purchase type",
      purchaseSub: "Subscription",
      purchaseOneTime: "One-time payment",

      buttonTrial: "Start trial",
      buttonCheckout: "Proceed to checkout",
      buttonClose: "Close",

      trialInfo:
        "Trial gives you Pro features for 10 days. After that, projects are archived (not deleted) per the 90-day rule, and can be restored when you reactivate Pro.",
      buyInfo:
        "You enter company info once. After payment, your account is upgraded automatically when the Stripe webhook is received.",

      errorEmail: "Please enter a valid email.",
      errorOrgName: "Company name is required.",
      errorOrgNr: "Org. no. must be 9 digits.",
      errorSignin: "Please sign in to continue.",
    };
  }, [isNo]);

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  // Company info (required before trial/checkout)
  const [orgName, setOrgName] = useState("");
  const [orgNr, setOrgNr] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("month");
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("subscription");

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const emailOk = useMemo(() => {
    const e = email.trim().toLowerCase();
    if (!e) return false;
    // super basic
    return /.+@.+\..+/.test(e);
  }, [email]);

  useEffect(() => {
    if (!open) return;
    setBusy(false);
    setStatus(null);
    setError(null);
    setEmailTouched(false);

    if (mode === "trial") {
      setBillingPeriod("month");
      setPurchaseType("subscription");
    }
    if (mode === "buy") {
      setBillingPeriod("month");
      setPurchaseType("subscription");
    }
  }, [open, mode]);

  // Keep email in sync with authenticated user
  useEffect(() => {
    if (!open) return;
    if (user?.email) setEmail(user.email);
  }, [open, user?.email]);

  const totalMonth = useMemo(() => (priceMonthExVat * (1 + vatRate)).toFixed(0), [priceMonthExVat, vatRate]);
  const totalYear = useMemo(() => (priceYearExVat * (1 + vatRate)).toFixed(0), [priceYearExVat, vatRate]);

  const priceLabel = billingPeriod === "year" ? priceYearExVat : priceMonthExVat;
  const totalLabel = billingPeriod === "year" ? totalYear : totalMonth;

  const totalSuffix =
    purchaseType === "one_time"
      ? ""
      : billingPeriod === "year"
        ? ` ${t.perYear}`
        : ` ${t.perMonth}`;

  function normalizeOrgNr(v: string) {
    return String(v || "").replace(/\s+/g, "").trim();
  }

  function validateBeforeContinue(): string | null {
    if (!user) return t.errorSignin;
    if (!email.trim() || !emailOk) return t.errorEmail;
    if (!orgName.trim()) return t.errorOrgName;
    const on = normalizeOrgNr(orgNr);
    if (!/^\d{9}$/.test(on)) return t.errorOrgNr;
    return null;
  }

  const orgNrNormalized = useMemo(() => normalizeOrgNr(orgNr), [orgNr]);

  const ROUTE_TRIAL_START = `${workerBaseUrl.replace(/\/$/, "")}/api/trial/start`;
  const ROUTE_CHECKOUT_CREATE = `${workerBaseUrl.replace(/\/$/, "")}/api/checkout/create`;

  const returnBase = useMemo(() => {
    const origin = window.location.origin;
    return origin;
  }, []);

  const successUrl = useMemo(() => `${returnBase}/progress/app?checkout=success`, [returnBase]);
  const cancelUrl = useMemo(() => `${returnBase}/progress/app?checkout=cancel`, [returnBase]);

  async function startTrial() {
    setEmailTouched(true);
    setStatus(null);
    setError(null);
    const v = validateBeforeContinue();
    if (v) {
      setError(v);
      return;
    }

    setBusy(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) throw new Error(isNo ? "Du er ikke innlogget." : "Not signed in.");

      const r = await fetch(ROUTE_TRIAL_START, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          product: "progress",
          orgName: orgName.trim(),
          orgNr: orgNrNormalized,
          contactName: contactName.trim() || "",
          phone: phone.trim() || "",
        }),
      });

      const data = await r.json().catch(() => null);

      if (!r.ok) {
        const e = data?.error ? String(data.error) : `HTTP_${r.status}`;
        throw new Error(e);
      }

      setStatus(isNo ? "✅ Prøveperiode startet. Du kan lukke dette vinduet." : "✅ Trial started. You can close this window.");
    } catch (e: any) {
      setError(e?.message ? String(e.message) : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function goToCheckout() {
    setEmailTouched(true);
    setStatus(null);
    setError(null);
    const v = validateBeforeContinue();
    if (v) {
      setError(v);
      return;
    }

    setBusy(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) throw new Error(isNo ? "Du er ikke innlogget." : "Not signed in.");

      const r = await fetch(ROUTE_CHECKOUT_CREATE, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          lang,
          billingPeriod,
          purchaseType,
          quantity: 1,
          orgName: orgName.trim(),
          orgNr: orgNrNormalized,
          contactName: contactName.trim() || "",
          phone: phone.trim() || "",
          tier: "intro",
          successUrl,
          cancelUrl,
        }),
      });

      const data = await r.json().catch(() => null);

      if (!r.ok) {
        const e = data?.error ? String(data.error) : `HTTP_${r.status}`;
        throw new Error(e);
      }

      const url = data?.url ? String(data.url) : "";
      if (!url) throw new Error("NO_URL_RETURNED");
      window.location.href = url;
    } catch (e: any) {
      setError(e?.message ? String(e.message) : String(e));
      setBusy(false);
    }
  }

  if (!open) return null;

  const modalBg = "rgba(0,0,0,0.66)";
  const cardBg = "var(--card-bg, #111)";
  const textColor = "var(--text, #fff)";
  const mutedColor = "var(--muted, rgba(255,255,255,0.7))";
  const borderColor = "var(--border, rgba(255,255,255,0.12))";
  const inputBg = "var(--input-bg, rgba(255,255,255,0.06))";
  const btnBg = "var(--btn, #2d6cdf)";
  const btnBg2 = "var(--btn2, rgba(255,255,255,0.08))";

  const title = mode === "trial" ? t.titleTrial : t.titleBuy;

  const showEmailError = emailTouched && !emailOk;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: modalBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "min(720px, 100%)",
          background: cardBg,
          color: textColor,
          border: `1px solid ${borderColor}`,
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem 1rem 0.75rem 1rem",
            borderBottom: `1px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 900 }}>{title}</div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: `1px solid ${borderColor}`,
              background: btnBg2,
              color: textColor,
              borderRadius: 10,
              padding: "8px 10px",
              cursor: "pointer",
              fontWeight: 700,
            }}
            disabled={busy}
          >
            {t.buttonClose}
          </button>
        </div>

                {/* Body */}
        <div style={{ padding: "1rem", overflow: "auto" }}>
          {/* Auth gate */}
          {authLoading ? (
            <div style={{ color: mutedColor, marginBottom: "1rem" }}>{isNo ? "Laster..." : "Loading..."}</div>
          ) : !user ? (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>{isNo ? "Logg inn for å fortsette" : "Sign in to continue"}</div>
              <div style={{ color: mutedColor, marginBottom: 12 }}>
                {isNo
                  ? "Du må være innlogget før vi kan starte prøveperiode eller sende deg til betaling."
                  : "You must be signed in before starting a trial or proceeding to checkout."}
              </div>
              <div
                style={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: 14,
                  padding: 12,
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <AuthPanel lang={lang as any} />
              </div>
            </div>
          ) : (
            <>
              {/* Email (read-only) */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.emailLabel}</label>
                <input
                  value={email}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 12,
                    border: `1px solid ${borderColor}`,
                    background: inputBg,
                    color: textColor,
                    outline: "none",
                    opacity: 0.9,
                  }}
                />
                <div style={{ color: mutedColor, fontSize: 12, marginTop: 6 }}>{t.emailHint}</div>
                {showEmailError ? (
                  <div style={{ marginTop: 8, color: "#ff7b7b", fontWeight: 700, fontSize: 13 }}>{t.errorEmail}</div>
                ) : null}
              </div>

              {/* Company info */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontWeight: 900, marginBottom: 8 }}>{t.companyTitle}</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.orgNameLabel}</label>
                    <input
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder={isNo ? "F.eks. Mathisens Morning Coffee Labs" : "E.g. Morning Coffee Labs"}
                      style={{
                        width: "100%",
                        padding: "12px 12px",
                        borderRadius: 12,
                        border: `1px solid ${borderColor}`,
                        background: inputBg,
                        color: textColor,
                        outline: "none",
                      }}
                      disabled={busy}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.orgNrLabel}</label>
                    <input
                      value={orgNr}
                      onChange={(e) => setOrgNr(e.target.value)}
                      placeholder={isNo ? "9 siffer" : "9 digits"}
                      inputMode="numeric"
                      style={{
                        width: "100%",
                        padding: "12px 12px",
                        borderRadius: 12,
                        border: `1px solid ${borderColor}`,
                        background: inputBg,
                        color: textColor,
                        outline: "none",
                      }}
                      disabled={busy}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.contactNameLabel}</label>
                      <input
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={isNo ? "Valgfritt" : "Optional"}
                        style={{
                          width: "100%",
                          padding: "12px 12px",
                          borderRadius: 12,
                          border: `1px solid ${borderColor}`,
                          background: inputBg,
                          color: textColor,
                          outline: "none",
                        }}
                        disabled={busy}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontWeight: 800, marginBottom: 6 }}>{t.phoneLabel}</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={isNo ? "Valgfritt" : "Optional"}
                        style={{
                          width: "100%",
                          padding: "12px 12px",
                          borderRadius: 12,
                          border: `1px solid ${borderColor}`,
                          background: inputBg,
                          color: textColor,
                          outline: "none",
                        }}
                        disabled={busy}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Plan summary / info */}
          <div
            style={{
              border: `1px solid ${borderColor}`,
              borderRadius: 14,
              padding: 12,
              background: "rgba(255,255,255,0.03)",
              marginBottom: "1rem",
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 6 }}>{t.billingTitle}</div>
            <div style={{ color: mutedColor, fontSize: 13, lineHeight: 1.4 }}>
              {mode === "trial" ? t.trialInfo : t.buyInfo}
            </div>
          </div>

          {/* Billing controls */}
          {mode === "buy" ? (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>{t.purchaseTypeLabel}</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => setPurchaseType("subscription")}
                      style={{
                        border: `1px solid ${borderColor}`,
                        background: purchaseType === "subscription" ? btnBg : btnBg2,
                        color: textColor,
                        borderRadius: 12,
                        padding: "10px 12px",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                      disabled={busy}
                    >
                      {t.purchaseSub}
                    </button>

                    <button
                      type="button"
                      onClick={() => setPurchaseType("one_time")}
                      style={{
                        border: `1px solid ${borderColor}`,
                        background: purchaseType === "one_time" ? btnBg : btnBg2,
                        color: textColor,
                        borderRadius: 12,
                        padding: "10px 12px",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                      disabled={busy}
                    >
                      {t.purchaseOneTime}
                    </button>
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>{t.billingPeriodLabel}</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => setBillingPeriod("month")}
                      style={{
                        border: `1px solid ${borderColor}`,
                        background: billingPeriod === "month" ? btnBg : btnBg2,
                        color: textColor,
                        borderRadius: 12,
                        padding: "10px 12px",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                      disabled={busy}
                    >
                      {currency} {priceMonthExVat} + {Math.round(vatRate * 100)}% MVA
                    </button>

                    <button
                      type="button"
                      onClick={() => setBillingPeriod("year")}
                      style={{
                        border: `1px solid ${borderColor}`,
                        background: billingPeriod === "year" ? btnBg : btnBg2,
                        color: textColor,
                        borderRadius: 12,
                        padding: "10px 12px",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                      disabled={busy}
                    >
                      {currency} {priceYearExVat} + {Math.round(vatRate * 100)}% MVA
                    </button>
                  </div>
                </div>
              </div>

              {/* Price summary */}
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  borderRadius: 14,
                  border: `1px solid ${borderColor}`,
                  background: "rgba(0,0,0,0.18)",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontWeight: 900 }}>{isNo ? "Sum" : "Total"}</div>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>
                    {currency} {totalLabel}
                    {totalSuffix}
                  </div>
                </div>

                <div style={{ color: mutedColor, fontSize: 12, marginTop: 6 }}>
                  {isNo ? "Pris inkl. MVA. Eks. MVA: " : "Price incl. VAT. Ex VAT: "}
                  {currency} {priceLabel}
                  {purchaseType === "one_time"
                    ? isNo
                      ? " (engangsbetaling)"
                      : " (one-time)"
                    : ""}
                </div>
              </div>
            </div>
          ) : null}

          {/* Status / Error */}
          {status ? (
            <div
              style={{
                marginTop: "1rem",
                border: `1px solid ${borderColor}`,
                background: "rgba(43, 214, 120, 0.12)",
                borderRadius: 12,
                padding: 12,
                fontWeight: 800,
              }}
            >
              {status}
            </div>
          ) : null}

          {error ? (
            <div
              style={{
                marginTop: "1rem",
                border: `1px solid ${borderColor}`,
                background: "rgba(255, 120, 120, 0.12)",
                borderRadius: 12,
                padding: 12,
                fontWeight: 800,
                whiteSpace: "pre-wrap",
              }}
            >
              {error}
            </div>
          ) : null}
        </div>

               {/* Footer */}
        <div
          style={{
            padding: "0.9rem 1rem 1rem 1rem",
            borderTop: `1px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: mutedColor, fontSize: 12 }}>
            {mode === "buy"
              ? isNo
                ? "Etter betaling: gå tilbake til appen og kjør verify om nødvendig."
                : "After payment: return to the app and run verify if needed."
              : isNo
                ? "Start prøveperioden og fortsett i appen."
                : "Start the trial and continue in the app."}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {mode === "trial" ? (
              <button
                type="button"
                onClick={startTrial}
                style={{
                  border: `1px solid ${borderColor}`,
                  background: btnBg,
                  color: "#fff",
                  borderRadius: 12,
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontWeight: 900,
                  opacity: busy ? 0.7 : 1,
                }}
                disabled={busy}
              >
                {busy ? (isNo ? "Jobber..." : "Working...") : t.buttonTrial}
              </button>
            ) : (
              <button
                type="button"
                onClick={goToCheckout}
                style={{
                  border: `1px solid ${borderColor}`,
                  background: btnBg,
                  color: "#fff",
                  borderRadius: 12,
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontWeight: 900,
                  opacity: busy ? 0.7 : 1,
                }}
                disabled={busy}
              >
                {busy ? (isNo ? "Sender..." : "Sending...") : t.buttonCheckout}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;

