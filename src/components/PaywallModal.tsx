// src/components/PaywallModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuthUser } from "../auth/useAuthUser";

type Mode = "trial" | "buy";
type BillingPeriod = "month" | "year";
type PurchaseType = "subscription" | "one_time";

type Props = {
  open: boolean;
  mode: Mode;
  onClose: () => void;

  lang: string;
  workerBaseUrl: string;

  priceMonthExVat: number;
  priceYearExVat: number;
  vatRate: number;
  currency: string;
};

function clampUrlBase(u: string) {
  return (u || "").replace(/\/+$/, "");
}

function formatKr(n: number, lang: string) {
  const r = Math.round(n);
  return lang === "no" ? `${r} kr` : `${r} NOK`;
}

export default function PaywallModal(props: Props) {
  const {
    open,
    mode,
    onClose,
    lang,
    workerBaseUrl,
    priceMonthExVat,
    priceYearExVat,
    vatRate,
  } = props;

  const isNo = lang === "no";
  const apiBase = useMemo(() => clampUrlBase(workerBaseUrl), [workerBaseUrl]);

  const {
    user,
    ready,
    signIn,
    register,
    getIdToken,
  } = useAuthUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("month");
  const [purchaseType, setPurchaseType] =
    useState<PurchaseType>("subscription");

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setStatus(null);
    setError(null);
    setBusy(false);
    setEmail("");
    setPassword("");
  }, [open, mode]);

  if (!open) return null;

  const t = {
    close: isNo ? "Lukk" : "Close",
    email: isNo ? "E-post" : "Email",
    password: isNo ? "Passord" : "Password",

    signin: isNo ? "Logg inn" : "Sign in",
    register: isNo ? "Registrer & start trial" : "Register & start trial",

    trialTitle: isNo ? "10 dagers gratis Pro-trial" : "10 day free Pro trial",
    buyTitle: isNo ? "Kjøp Pro-lisens" : "Buy Pro license",

    month: isNo ? "Månedlig" : "Monthly",
    year: isNo ? "Årlig" : "Yearly",

    subscription: isNo ? "Abonnement" : "Subscription",
    oneTime: isNo ? "Engangsbetaling" : "One-time payment",

    checkout: isNo ? "Gå til betaling" : "Go to checkout",
  };

  const selectedExVat =
    billingPeriod === "month" ? priceMonthExVat : priceYearExVat;

  const vatAmount = selectedExVat * vatRate;
  const totalInclVat = selectedExVat + vatAmount;

  async function requireToken(): Promise<string> {
    const token = await getIdToken(true);
    if (!token) throw new Error("Not authenticated");
    return token;
  }

  async function handleRegisterAndTrial() {
    setBusy(true);
    setError(null);
    try {
      await register(email.trim(), password);
      const token = await requireToken();

      await fetch(`${apiBase}/trial/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product: "progress" }),
      });

      setStatus(
        isNo
          ? "Trial startet. Du har nå Pro i 10 dager."
          : "Trial started. You now have Pro for 10 days."
      );
    } catch (e: any) {
      setError(e?.message || "Trial failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleCheckout() {
    setBusy(true);
    setError(null);

    try {
      if (!user) {
        await signIn(email.trim(), password);
      }

      const token = await requireToken();

      const successUrl =
        window.location.origin +
        "/progress/app?from=checkout&refresh=1";
      const cancelUrl = window.location.href;

      const res = await fetch(`${apiBase}/checkout/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interval: billingPeriod,
          purchaseType,
          successUrl,
          cancelUrl,
        }),
      });

      const data = await res.json();
      if (!data?.url) throw new Error("No checkout url returned");

      window.location.assign(data.url);
    } catch (e: any) {
      setError(e?.message || "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--mcl-surface)",
          color: "var(--mcl-text)",
          borderRadius: 16,
          width: "min(720px,100%)",
          padding: "1.2rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>
            {mode === "trial" ? t.trialTitle : t.buyTitle}
          </strong>
          <button onClick={onClose}>{t.close}</button>
        </div>

        {!user && (
          <>
            <div style={{ marginTop: 12 }}>
              <label>{t.email}</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ marginTop: 8 }}>
              <label>{t.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </>
        )}

        {mode === "buy" && (
          <>
            <div style={{ marginTop: 12 }}>
              <label>{t.month}</label>
              <input
                type="radio"
                checked={billingPeriod === "month"}
                onChange={() => setBillingPeriod("month")}
              />
              <label>{t.year}</label>
              <input
                type="radio"
                checked={billingPeriod === "year"}
                onChange={() => setBillingPeriod("year")}
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <strong>
                {formatKr(totalInclVat, lang)}
              </strong>
            </div>
          </>
        )}

        <div style={{ marginTop: 16 }}>
          {mode === "trial" ? (
            <button disabled={busy || !ready} onClick={handleRegisterAndTrial}>
              {t.register}
            </button>
          ) : (
            <button disabled={busy || !ready} onClick={handleCheckout}>
              {t.checkout}
            </button>
          )}
        </div>

        {status && <div style={{ marginTop: 12 }}>{status}</div>}
        {error && (
          <div style={{ marginTop: 12, color: "red" }}>{error}</div>
        )}
      </div>
    </div>
  );
}
