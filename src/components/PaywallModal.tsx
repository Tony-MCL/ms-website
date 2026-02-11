// src/components/PaywallModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useI18n } from "../i18n/useI18n";

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

function normalizeOrgNr(s: string) {
  return (s || "").replace(/\s+/g, "").trim();
}

function isProbablyOrgNr(s: string) {
  const x = normalizeOrgNr(s);
  // veldig enkel sjekk (9 siffer) – ikke “hard” validering
  return !x || /^\d{9}$/.test(x);
}

function normalizePublicHashBase(raw: string) {
  const base = String(raw || "").trim();
  if (!base) return "";
  // Sørg for trailing slash
  const withSlash = base.replace(/\/+$/, "/");
  // Sørg for "#/" for HashRouter
  if (withSlash.includes("#/")) return withSlash;
  return withSlash.replace(/\/+$/, "") + "/#/";
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
  const { t } = useI18n();

  // ============================
  // ROUTES (Worker)
  // ============================
  const ROUTE_TRIAL_START = "/api/trial/start";
  const ROUTE_CHECKOUT_CREATE = "/api/checkout/create";
  // ============================

  // ✅ Worker base URL (IKKE bland med public site url)
  const workerBase = useMemo(() => clampUrlBase(workerBaseUrl), [workerBaseUrl]);

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  // “Company / private” toggle (kun i buy)
  type BuyerType = "company" | "private";
  const [buyerType, setBuyerType] = useState<BuyerType>("company");

  // Company fields
  const [orgName, setOrgName] = useState("");
  const [orgNr, setOrgNr] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");

  // Private fields
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("month");
  const [purchaseType, setPurchaseType] =
    useState<PurchaseType>("subscription");

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

    if (mode === "trial") {
      // rydd litt
      setBuyerType("company");
      setOrgName("");
      setOrgNr("");
      setContactName("");
      setPhone("");
      setFullName("");
      setCountry("");
    }

    if (mode === "buy") {
      setBillingPeriod("month");
      setPurchaseType("subscription");
      // default company først
      setBuyerType("company");
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

  const emailOk = isValidEmail(email);
  const passwordOk = password.trim().length >= 6;

  const showEmailError = emailTouched && !emailOk;
  const showPasswordError = passwordTouched && !passwordOk;

  const orgNrOk = isProbablyOrgNr(orgNr);

  const companyOk =
    buyerType === "company"
      ? Boolean(
          orgName.trim() &&
            normalizeOrgNr(orgNr) &&
            contactName.trim() &&
            phone.trim() &&
            orgNrOk
        )
      : true;

  const privateOk =
    buyerType === "private" ? Boolean(fullName.trim() && country.trim()) : true;

  const buyOk = mode === "buy" ? companyOk && privateOk : true;

  const selectedExVat =
    billingPeriod === "month" ? priceMonthExVat : priceYearExVat;
  const vatAmount = selectedExVat * vatRate;
  const selectedInclVat = selectedExVat + vatAmount;

  const title =
    mode === "trial" ? t("paywall.trial.title") : t("paywall.buy.title");
  const sub = mode === "trial" ? t("paywall.trial.body") : t("paywall.buy.body");

  async function ensureAuthAndGetIdToken() {
    const e = email.trim();
    const p = password;

    // 1) prøv å opprette bruker
    try {
      const cred = await createUserWithEmailAndPassword(auth, e, p);
      return await cred.user.getIdToken(true);
    } catch (err: any) {
      const code = String(err?.code || "");
      // 2) hvis bruker finnes, logg inn
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

      const endpoint = `${workerBase}${ROUTE_TRIAL_START}`;
      const res = await fetch(endpoint, {
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

      setStatus(t("paywall.trial.success"));
    } catch (e: any) {
      setError(e?.message || t("paywall.errors.network"));
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

    if (!buyOk) {
      if (buyerType === "company" && !orgNrOk) setError(t("paywall.errors.invalidOrgNr"));
      else setError(t("paywall.errors.missingRequired"));
      return;
    }

    setBusy(true);
    try {
      const idToken = await ensureAuthAndGetIdToken();

      // ✅ Kontrollerte retur-URLer (HashRouter)
      const rawPublic =
        (import.meta as any).env?.VITE_PUBLIC_SITE_URL ||
        `${window.location.origin}${window.location.pathname}`;

      const publicBase = normalizePublicHashBase(rawPublic);
      const successUrl = `${publicBase}progress/checkout?from=checkout&success=1`;
      const cancelUrl = `${publicBase}progress/checkout?from=checkout&canceled=1`;

      const payload: any = {
        email: email.trim(),
        lang,
        billingPeriod,
        purchaseType,
        successUrl,
        cancelUrl,
        quantity: 1,
        tier: "intro",
      };

      if (buyerType === "company") {
        payload.orgName = orgName.trim();
        payload.orgNr = normalizeOrgNr(orgNr);
        payload.contactName = contactName.trim();
        payload.phone = phone.trim();
        payload.buyerType = "company";
      } else {
        payload.orgName = fullName.trim(); // “personal org name”
        payload.orgNr = null;
        payload.contactName = fullName.trim();
        payload.phone = phone.trim() || null;
        payload.country = country.trim();
        payload.buyerType = "private";
      }

      // ✅ Checkout create mot Worker
      const endpoint = `${workerBase}${ROUTE_CHECKOUT_CREATE}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        const looksLikeHtml = /<html|<!doctype/i.test(txt);
        if (looksLikeHtml) {
          throw new Error(`${t("paywall.errors.wrongEndpoint")}\nHTTP ${res.status} @ ${endpoint}`);
        }
        throw new Error(txt || `HTTP ${res.status}`);
      }

      const data = await res.json().catch(() => null);
      const url = data?.url || data?.checkoutUrl;

      if (!url || typeof url !== "string") {
        throw new Error(t("paywall.errors.noCheckoutUrl"));
      }

      window.location.assign(url);
    } catch (e: any) {
      setError(e?.message || t("paywall.errors.network"));
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
  const chipBorder = isDark
    ? "1px solid rgba(255,255,255,0.20)"
    : "1px solid rgba(0,0,0,0.16)";

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: 600,
    marginBottom: 6,
  };

  const inputStyle = (errorBorder?: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "0.7rem 0.8rem",
    borderRadius: 12,
    border: errorBorder ? "1px solid rgba(255,80,80,0.75)" : chipBorder,
    background: inputBg,
    color: "inherit",
    outline: "none",
  });

  const sectionTitleStyle: React.CSSProperties = {
    fontWeight: 650,
    marginBottom: 10,
  };

  const actionBtnStyle: React.CSSProperties = {
    padding: "0.8rem 1rem",
    borderRadius: 12,
    border: chipBorder,
    background: "transparent",
    color: "inherit",
    cursor: busy ? "default" : "pointer",
    fontWeight: 650,
  };

  const radioRowStyle: React.CSSProperties = {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    alignItems: "center",
  };

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
            <div style={{ fontSize: 16, fontWeight: 650 }}>{title}</div>
            <div
              style={{
                fontSize: 13,
                opacity: 0.8,
                color: "var(--mcl-text-dim)",
              }}
            >
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
              fontWeight: 600,
            }}
          >
            {t("paywall.common.close")}
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1rem", overflow: "auto" }}>
          {/* Buyer toggle først (kun ved kjøp) */}
          {mode === "buy" && (
            <div style={{ marginBottom: "0.85rem" }}>
              <div style={radioRowStyle}>
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="radio"
                    name="buyerType"
                    checked={buyerType === "company"}
                    onChange={() => setBuyerType("company")}
                  />
                  {t("paywall.buyer.company")}
                </label>
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="radio"
                    name="buyerType"
                    checked={buyerType === "private"}
                    onChange={() => setBuyerType("private")}
                  />
                  {t("paywall.buyer.private")}
                </label>
              </div>
            </div>
          )}

          {/* Email + Password på én rad */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: "0.9rem",
            }}
          >
            <div>
              <label style={labelStyle}>{t("paywall.fields.emailLabel")}</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder={t("paywall.fields.emailPlaceholder")}
                style={inputStyle(showEmailError)}
              />
              {showEmailError && (
                <div style={{ fontSize: 13, marginTop: 6, opacity: 0.95 }}>
                  {t("paywall.validation.invalidEmail")}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>{t("paywall.fields.passwordLabel")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                placeholder={t("paywall.fields.passwordPlaceholder")}
                style={inputStyle(showPasswordError)}
              />
              {showPasswordError && (
                <div style={{ fontSize: 13, marginTop: 6, opacity: 0.95 }}>
                  {t("paywall.validation.invalidPassword")}
                </div>
              )}
            </div>
          </div>

          {/* Firmainfo / Privatinfo (kun ved kjøp) */}
          {mode === "buy" && buyerType === "company" && (
            <div style={{ marginBottom: "0.95rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label style={labelStyle}>{t("paywall.fields.orgNameLabel")}</label>
                  <input
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder={t("paywall.fields.orgNamePlaceholder")}
                    style={inputStyle(false)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{t("paywall.fields.orgNrLabel")}</label>
                  <input
                    value={orgNr}
                    onChange={(e) => setOrgNr(e.target.value)}
                    placeholder={t("paywall.fields.orgNrPlaceholder")}
                    style={inputStyle(!orgNrOk)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{t("paywall.fields.contactNameLabel")}</label>
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder={t("paywall.fields.contactNamePlaceholder")}
                    style={inputStyle(false)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{t("paywall.fields.phoneLabel")}</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("paywall.fields.phonePlaceholder")}
                    style={inputStyle(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {mode === "buy" && buyerType === "private" && (
            <div style={{ marginBottom: "0.95rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label style={labelStyle}>{t("paywall.fields.fullNameLabel")}</label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("paywall.fields.fullNamePlaceholder")}
                    style={inputStyle(false)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{t("paywall.fields.countryLabel")}</label>
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder={t("paywall.fields.countryPlaceholder")}
                    style={inputStyle(false)}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>{t("paywall.fields.phoneLabel")}</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("paywall.fields.phonePlaceholder")}
                    style={inputStyle(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {mode === "trial" ? (
            <button
              type="button"
              onClick={startTrial}
              disabled={busy}
              style={actionBtnStyle}
            >
              {t("paywall.trial.cta")}
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
                  <div style={{ marginBottom: "0.95rem" }}>
                    <div style={sectionTitleStyle}>{t("paywall.buy.licenseTypeTitle")}</div>
                    <div style={radioRowStyle}>
                      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          type="radio"
                          name="purchaseType"
                          checked={purchaseType === "subscription"}
                          onChange={() => setPurchaseType("subscription")}
                        />
                        {t("paywall.buy.purchase.subscription")}
                      </label>
                      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          type="radio"
                          name="purchaseType"
                          checked={purchaseType === "one_time"}
                          onChange={() => setPurchaseType("one_time")}
                        />
                        {t("paywall.buy.purchase.oneTime")}
                      </label>
                    </div>
                  </div>

                  {purchaseType === "subscription" ? (
                    <div>
                      <div style={sectionTitleStyle}>{t("paywall.buy.billingTitle")}</div>
                      <div style={radioRowStyle}>
                        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input
                            type="radio"
                            name="billingPeriod"
                            checked={billingPeriod === "month"}
                            onChange={() => setBillingPeriod("month")}
                          />
                          {t("paywall.buy.billing.month")}
                        </label>
                        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input
                            type="radio"
                            name="billingPeriod"
                            checked={billingPeriod === "year"}
                            onChange={() => setBillingPeriod("year")}
                          />
                          {t("paywall.buy.billing.year")}
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={sectionTitleStyle}>{t("paywall.buy.durationTitle")}</div>
                      <div style={radioRowStyle}>
                        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input
                            type="radio"
                            name="billingPeriod"
                            checked={billingPeriod === "month"}
                            onChange={() => setBillingPeriod("month")}
                          />
                          {t("paywall.buy.duration.oneMonth")}
                        </label>
                        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input
                            type="radio"
                            name="billingPeriod"
                            checked={billingPeriod === "year"}
                            onChange={() => setBillingPeriod("year")}
                          />
                          {t("paywall.buy.duration.oneYear")}
                        </label>
                      </div>
                    </div>
                  )}
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
                      fontSize: 13.5,
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{t("paywall.calc.price")}:</div>
                    <div style={{ textAlign: "right", fontWeight: 650 }}>
                      {formatKr(selectedExVat, lang)}
                    </div>

                    <div style={{ fontWeight: 600 }}>{t("paywall.calc.vat")}:</div>
                    <div style={{ textAlign: "right", fontWeight: 650 }}>
                      {formatKr(vatAmount, lang)}
                    </div>

                    <div style={{ fontWeight: 650 }}>{t("paywall.calc.total")}:</div>
                    <div style={{ textAlign: "right", fontWeight: 700 }}>
                      {formatKr(selectedInclVat, lang)}
                      {purchaseType === "subscription" &&
                        (billingPeriod === "year"
                          ? ` ${t("paywall.calc.perYear")}`
                          : ` ${t("paywall.calc.perMonth")}`)}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      opacity: 0.75,
                      color: "var(--mcl-text-dim)",
                    }}
                  >
                    {currency}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "1.1rem" }}>
                <button
                  type="button"
                  onClick={goToCheckout}
                  disabled={busy}
                  style={actionBtnStyle}
                >
                  {t("paywall.buy.ctaCheckout")}
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
                fontSize: 13.5,
              }}
            >
              {error ? (
                <div style={{ whiteSpace: "pre-wrap" }}>{error}</div>
              ) : (
                <div>{status}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
