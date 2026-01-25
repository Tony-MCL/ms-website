import React, { useMemo, useState } from "react";
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

function fmtMoney(n: number, currency: string) {
  try {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n} ${currency}`;
  }
}

function isEmail(x: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.trim());
}

export default function PaywallModal(props: Props) {
  const { open, mode, onClose, lang, workerBaseUrl, priceMonthExVat, priceYearExVat, vatRate, currency } = props;

  const copy = useMemo(() => {
    const no = lang === "no";
    return {
      title: mode === "trial" ? (no ? "Start prøveperiode" : "Start trial") : (no ? "Kjøp Progress" : "Buy Progress"),
      lead:
        mode === "trial"
          ? no
            ? "Fyll inn firmainfo én gang. Vi oppretter konto + org og aktiverer prøveperioden."
            : "Fill company info once. We create account + org and start your trial."
          : no
          ? "Fyll inn firmainfo én gang. Vi oppretter konto + org og sender deg til Stripe Checkout."
          : "Fill company info once. We create account + org and send you to Stripe Checkout.",
      email: no ? "E-post" : "Email",
      password: no ? "Passord" : "Password",
      passwordHint: no ? "Minst 6 tegn." : "At least 6 characters.",
      company: no ? "Firmainfo" : "Company info",
      orgName: no ? "Firmanavn" : "Company name",
      orgNr: no ? "Org.nr" : "Org no.",
      contactName: no ? "Kontaktperson" : "Contact name",
      phone: no ? "Telefon" : "Phone",
      plan: no ? "Plan" : "Plan",
      billing: no ? "Fakturering" : "Billing",
      purchaseType: no ? "Kjøpstype" : "Purchase type",
      sub: no ? "Abonnement" : "Subscription",
      oneTime: no ? "Engangsbetaling" : "One-time",
      month: no ? "Måned" : "Month",
      year: no ? "År" : "Year",
      ctaTrial: no ? "Start prøveperiode" : "Start trial",
      ctaBuy: no ? "Gå til betaling" : "Go to checkout",
      cancel: no ? "Avbryt" : "Cancel",
      errorMissing: no ? "Fyll inn alle feltene." : "Please fill in all fields.",
      errorEmail: no ? "Ugyldig e-post." : "Invalid email.",
      errorPassword: no ? "Passord må være minst 6 tegn." : "Password must be at least 6 characters.",
      working: no ? "Jobber..." : "Working...",
      pricePerMonth: no ? "per måned" : "per month",
      pricePerYear: no ? "per år" : "per year",
      inclVat: no ? "inkl. mva" : "incl. VAT",
      exclVat: no ? "eks. mva" : "excl. VAT",
    };
  }, [lang, mode]);

  const { user, signIn, register } = useAuthUser();

  const [email, setEmail] = useState<string>(user?.email || "");
  const [password, setPassword] = useState<string>("");

  const [orgName, setOrgName] = useState<string>("");
  const [orgNr, setOrgNr] = useState<string>("");
  const [contactName, setContactName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("month");
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("subscription");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  const priceExVat = billingPeriod === "month" ? priceMonthExVat : priceYearExVat;
  const priceInclVat = Math.round(priceExVat * (1 + vatRate));

  function resetUi() {
    setError("");
    setBusy(false);
  }

  async function ensureSignedInAndGetToken(): Promise<string> {
    // If already logged in, just grab token
    if (user) {
      return await user.getIdToken(true);
    }

    // Not logged in → we must create/sign-in here (single-flow).
    const e = email.trim().toLowerCase();

    // Try register first. If it already exists, sign in.
    try {
      await register(e, password);
    } catch (err: any) {
      const msg = String(err?.message || "");
      const code = String(err?.code || "");
      const already = code.includes("email-already-in-use") || msg.toLowerCase().includes("email-already-in-use");
      if (!already) throw err;
      await signIn(e, password);
    }

    // Now we should have a user
    // useAuthUser updates state; but we can also read from auth directly via hook state next tick.
    // safest: call signIn/register returns and then re-use email+password to signIn if needed.
    // Here we just ask the freshly-authenticated user for token via window.firebaseAuth is not available,
    // so we rely on the hook user updating quickly. If it doesn't, we fall back by re-signing in.
    const u = (await signIn(email.trim().toLowerCase(), password)).user;
    return await u.getIdToken(true);
  }

  async function startTrial() {
    setError("");
    setBusy(true);
    try {
      // Validate
      const e = email.trim().toLowerCase();
      if (!orgName.trim() || !orgNr.trim() || !contactName.trim() || !phone.trim() || !e) {
        setError(copy.errorMissing);
        setBusy(false);
        return;
      }
      if (!isEmail(e)) {
        setError(copy.errorEmail);
        setBusy(false);
        return;
      }
      if (!user && password.trim().length < 6) {
        setError(copy.errorPassword);
        setBusy(false);
        return;
      }

      const idToken = await ensureSignedInAndGetToken();

      const r = await fetch(`${workerBaseUrl.replace(/\/$/, "")}/api/trial/start`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          product: "progress",
          orgName,
          orgNr,
          contactName,
          phone,
        }),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(String(data?.error || `HTTP_${r.status}`));

      // Done
      onClose();
      resetUi();
    } catch (err: any) {
      setError(String(err?.message || err));
      setBusy(false);
    }
  }

  async function goToCheckout() {
    setError("");
    setBusy(true);
    try {
      // Validate
      const e = email.trim().toLowerCase();
      if (!orgName.trim() || !orgNr.trim() || !contactName.trim() || !phone.trim() || !e) {
        setError(copy.errorMissing);
        setBusy(false);
        return;
      }
      if (!isEmail(e)) {
        setError(copy.errorEmail);
        setBusy(false);
        return;
      }
      if (!user && password.trim().length < 6) {
        setError(copy.errorPassword);
        setBusy(false);
        return;
      }

      const idToken = await ensureSignedInAndGetToken();

      const origin = window.location.origin;
      const successUrl = `${origin}/progress?checkout=success`;
      const cancelUrl = `${origin}/progress?checkout=cancel`;

      const r = await fetch(`${workerBaseUrl.replace(/\/$/, "")}/api/checkout/create`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: e,
          lang,
          orgName,
          orgNr,
          contactName,
          phone,

          purchaseType,
          billingPeriod,
          tier: "intro",

          quantity: 1,

          successUrl,
          cancelUrl,
        }),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(String(data?.error || `HTTP_${r.status}`));
      if (!data?.url) throw new Error("NO_CHECKOUT_URL");

      window.location.href = String(data.url);
    } catch (err: any) {
      setError(String(err?.message || err));
      setBusy(false);
    }
  }

  if (!open) return null;

  // --- Styling: keep it MCL-ish (simple, clean, same vars, no “new design system”) ---
  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  };

  const card: React.CSSProperties = {
    width: "min(720px, 100%)",
    borderRadius: 16,
    background: "var(--mcl-surface, #fff)",
    color: "var(--mcl-text, #111)",
    border: "1px solid var(--mcl-border, rgba(0,0,0,0.12))",
    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
    overflow: "hidden",
  };

  const header: React.CSSProperties = {
    padding: "18px 18px 12px 18px",
    borderBottom: "1px solid var(--mcl-border, rgba(0,0,0,0.12))",
    background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0))",
  };

  const body: React.CSSProperties = { padding: 18 };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  };

  const row: React.CSSProperties = { display: "grid", gap: 6 };

  const label: React.CSSProperties = {
    fontSize: 12,
    opacity: 0.85,
    fontWeight: 600,
  };

  const input: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid var(--mcl-border, rgba(0,0,0,0.18))",
    background: "var(--mcl-bg, #fff)",
    color: "var(--mcl-text, #111)",
    outline: "none",
  };

  const select: React.CSSProperties = { ...input };

  const footer: React.CSSProperties = {
    padding: 18,
    borderTop: "1px solid var(--mcl-border, rgba(0,0,0,0.12))",
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    alignItems: "center",
    background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.02))",
  };

  const btnBase: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid var(--mcl-border, rgba(0,0,0,0.18))",
    cursor: busy ? "not-allowed" : "pointer",
    fontWeight: 700,
  };

  const btnGhost: React.CSSProperties = {
    ...btnBase,
    background: "transparent",
    color: "var(--mcl-text, #111)",
  };

  const btnPrimary: React.CSSProperties = {
    ...btnBase,
    background: "var(--mcl-primary, #111)",
    color: "var(--mcl-primaryText, #fff)",
    border: "1px solid rgba(0,0,0,0.18)",
  };

  return (
    <div style={overlay} role="dialog" aria-modal="true" aria-label={copy.title}>
      <div style={card}>
        <div style={header}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.2 }}>{copy.title}</div>
              <div style={{ marginTop: 6, opacity: 0.85, lineHeight: 1.35 }}>{copy.lead}</div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>
                {fmtMoney(priceExVat, currency)} {copy.exclVat}
              </div>
              <div style={{ fontSize: 12, opacity: 0.75 }}>
                {fmtMoney(priceInclVat, currency)} {copy.inclVat}{" "}
                {billingPeriod === "month" ? copy.pricePerMonth : copy.pricePerYear}
              </div>
            </div>
          </div>
        </div>

        <div style={body}>
          {/* Account fields (single-flow) */}
          <div style={{ ...grid, marginBottom: 14 }}>
            <div style={row}>
              <div style={label}>{copy.email}</div>
              <input
                style={input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                disabled={busy}
              />
            </div>

            {/* Password only needed if not already logged in */}
            <div style={row}>
              <div style={label}>{copy.password}</div>
              <input
                style={input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={copy.passwordHint}
                type="password"
                disabled={busy || !!user}
              />
            </div>
          </div>

          {/* Company */}
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>{copy.company}</div>
          <div style={grid}>
            <div style={row}>
              <div style={label}>{copy.orgName}</div>
              <input style={input} value={orgName} onChange={(e) => setOrgName(e.target.value)} disabled={busy} />
            </div>
            <div style={row}>
              <div style={label}>{copy.orgNr}</div>
              <input style={input} value={orgNr} onChange={(e) => setOrgNr(e.target.value)} disabled={busy} />
            </div>
            <div style={row}>
              <div style={label}>{copy.contactName}</div>
              <input
                style={input}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                disabled={busy}
              />
            </div>
            <div style={row}>
              <div style={label}>{copy.phone}</div>
              <input style={input} value={phone} onChange={(e) => setPhone(e.target.value)} disabled={busy} />
            </div>
          </div>

          {/* Buy config */}
          {mode === "buy" && (
            <div style={{ marginTop: 16 }}>
              <div style={grid}>
                <div style={row}>
                  <div style={label}>{copy.purchaseType}</div>
                  <select
                    style={select}
                    value={purchaseType}
                    onChange={(e) => setPurchaseType(e.target.value as PurchaseType)}
                    disabled={busy}
                  >
                    <option value="subscription">{copy.sub}</option>
                    <option value="one_time">{copy.oneTime}</option>
                  </select>
                </div>

                <div style={row}>
                  <div style={label}>{copy.billing}</div>
                  <select
                    style={select}
                    value={billingPeriod}
                    onChange={(e) => setBillingPeriod(e.target.value as BillingPeriod)}
                    disabled={busy}
                  >
                    <option value="month">{copy.month}</option>
                    <option value="year">{copy.year}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {error ? (
            <div
              style={{
                marginTop: 14,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(220, 38, 38, 0.35)",
                background: "rgba(220, 38, 38, 0.08)",
                color: "rgb(153, 27, 27)",
                fontWeight: 650,
                fontSize: 13,
              }}
            >
              {error}
            </div>
          ) : null}
        </div>

        <div style={footer}>
          <button style={btnGhost} onClick={onClose} disabled={busy}>
            {copy.cancel}
          </button>

          {mode === "trial" ? (
            <button style={btnPrimary} onClick={startTrial} disabled={busy}>
              {busy ? copy.working : copy.ctaTrial}
            </button>
          ) : (
            <button style={btnPrimary} onClick={goToCheckout} disabled={busy}>
              {busy ? copy.working : copy.ctaBuy}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
