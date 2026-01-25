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

  currency: string; // e.g. "NOK"
};

const LS_TOKEN = "ms_idToken";
const LS_EMAIL = "ms_email";

function money(n: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
  } catch {
    return `${n.toFixed(0)} ${currency}`;
  }
}

function firebaseEndpoint(path: string, apiKey: string) {
  return `https://identitytoolkit.googleapis.com/v1/${path}?key=${encodeURIComponent(apiKey)}`;
}

async function firebaseSignIn(apiKey: string, email: string, password: string) {
  const r = await fetch(firebaseEndpoint("accounts:signInWithPassword", apiKey), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(String(data?.error?.message || "AUTH_FAILED"));
  return { idToken: String(data.idToken || ""), email: String(data.email || "") };
}

async function firebaseSignUp(apiKey: string, email: string, password: string) {
  const r = await fetch(firebaseEndpoint("accounts:signUp", apiKey), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(String(data?.error?.message || "AUTH_FAILED"));
  return { idToken: String(data.idToken || ""), email: String(data.email || "") };
}

async function workerJson<T>(
  url: string,
  opts: { method: "GET" | "POST"; idToken?: string; body?: any }
): Promise<T> {
  const r = await fetch(url, {
    method: opts.method,
    headers: {
      "content-type": "application/json",
      ...(opts.idToken ? { Authorization: `Bearer ${opts.idToken}` } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(String((data as any)?.error || `HTTP_${r.status}`));
  return data as T;
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
    currency,
  } = props;

  const copy = useMemo(() => {
    const no = {
      title: mode === "trial" ? "Start prøveperiode" : "Oppgrader til Pro",
      intro:
        "For å opprette konto (og senere oppgradere til Pro) trenger vi firmainfo én gang. Dette knyttes til organisasjonen din.",
      authTitle: "Logg inn / Opprett konto",
      email: "E-post",
      password: "Passord",
      signIn: "Logg inn",
      signUp: "Opprett konto",
      signOut: "Logg ut",
      orgTitle: "Firmainfo",
      orgName: "Firmanavn",
      orgNr: "Org.nr",
      contactName: "Kontaktperson",
      phone: "Telefon",
      required: "Påkrevd",
      choose: "Velg",
      billing: "Fakturering",
      month: "Måned",
      year: "År",
      purchaseType: "Kjøpstype",
      subscription: "Abonnement",
      oneTime: "Engangsbetaling",
      seats: "Antall lisenser",
      startTrial: "Start prøveperiode (10 dager)",
      goCheckout: "Gå til betaling",
      close: "Lukk",
      statusReady: "Klar",
      statusWorking: "Jobber…",
      hint:
        "Du blir sendt til Stripe for betaling. Når Stripe er ferdig, oppdateres Pro automatisk via webhook.",
      mustLogin: "Du må være logget inn først.",
      mustFillOrg: "Fyll ut firmainfo først.",
    };
    const en = {
      title: mode === "trial" ? "Start trial" : "Upgrade to Pro",
      intro:
        "To create an account (and later upgrade to Pro) we need your company details once. This will be linked to your organization.",
      authTitle: "Sign in / Create account",
      email: "Email",
      password: "Password",
      signIn: "Sign in",
      signUp: "Create account",
      signOut: "Sign out",
      orgTitle: "Company details",
      orgName: "Company name",
      orgNr: "Org. number",
      contactName: "Contact person",
      phone: "Phone",
      required: "Required",
      choose: "Choose",
      billing: "Billing",
      month: "Monthly",
      year: "Yearly",
      purchaseType: "Purchase type",
      subscription: "Subscription",
      oneTime: "One-time payment",
      seats: "Number of seats",
      startTrial: "Start trial (10 days)",
      goCheckout: "Proceed to checkout",
      close: "Close",
      statusReady: "Ready",
      statusWorking: "Working…",
      hint:
        "You will be redirected to Stripe. When Stripe completes, Pro is updated automatically via webhook.",
      mustLogin: "You must be signed in first.",
      mustFillOrg: "Please fill in company details first.",
    };
    return lang === "en" ? en : no;
  }, [lang, mode]);

  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [idToken, setIdToken] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const [orgName, setOrgName] = useState("");
  const [orgNr, setOrgNr] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("month");
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("subscription");
  const [quantity, setQuantity] = useState<number>(1);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>("");

  const apiKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY as string | undefined;

  useEffect(() => {
    if (!open) return;
    setErr("");

    const t = localStorage.getItem(LS_TOKEN) || "";
    const e = localStorage.getItem(LS_EMAIL) || "";
    if (t) setIdToken(t);
    if (e) setUserEmail(e);

    if (e && !email) setEmail(e);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const priceExVat = billingPeriod === "month" ? priceMonthExVat : priceYearExVat;
  const priceIncVat = Math.round(priceExVat * (1 + vatRate));

  const canUse =
    Boolean(idToken) &&
    Boolean(orgName.trim()) &&
    Boolean(orgNr.trim()) &&
    Boolean(contactName.trim()) &&
    Boolean(phone.trim());

  async function doAuth() {
    setErr("");
    if (!apiKey) {
      setErr("MISSING_VITE_FIREBASE_API_KEY");
      return;
    }
    const e = email.trim();
    const p = password;
    if (!e || !p) {
      setErr("MISSING_EMAIL_OR_PASSWORD");
      return;
    }

    setBusy(true);
    try {
      const res =
        authMode === "signin"
          ? await firebaseSignIn(apiKey, e, p)
          : await firebaseSignUp(apiKey, e, p);

      if (!res.idToken) throw new Error("NO_ID_TOKEN");
      setIdToken(res.idToken);
      setUserEmail(res.email || e);

      localStorage.setItem(LS_TOKEN, res.idToken);
      localStorage.setItem(LS_EMAIL, (res.email || e).toLowerCase());
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  function doSignOut() {
    setIdToken("");
    setUserEmail("");
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_EMAIL);
  }

  async function startTrial() {
    setErr("");
    if (!idToken) return setErr(copy.mustLogin);
    if (!canUse) return setErr(copy.mustFillOrg);

    setBusy(true);
    try {
      await workerJson(`${workerBaseUrl}/api/trial/start`, {
        method: "POST",
        idToken,
        body: {
          product: "progress",
          orgName: orgName.trim(),
          orgNr: orgNr.replace(/\s+/g, "").trim(),
          contactName: contactName.trim(),
          phone: phone.trim(),
        },
      });

      onClose();
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  async function goCheckout() {
    setErr("");
    if (!idToken) return setErr(copy.mustLogin);
    if (!canUse) return setErr(copy.mustFillOrg);

    const origin = window.location.origin;
    const successUrl = `${origin}/#/pricing?checkout=success`;
    const cancelUrl = `${origin}/#/pricing?checkout=cancel`;

    setBusy(true);
    try {
      const res = await workerJson<{ url: string }>(`${workerBaseUrl}/api/checkout/create`, {
        method: "POST",
        idToken,
        body: {
          email: (userEmail || email).trim(),
          lang,
          billingPeriod,
          purchaseType,
          quantity,
          tier: "intro",

          orgName: orgName.trim(),
          orgNr: orgNr.replace(/\s+/g, "").trim(),
          contactName: contactName.trim(),
          phone: phone.trim(),

          successUrl,
          cancelUrl,
        },
      });

      if (!res?.url) throw new Error("NO_CHECKOUT_URL");
      window.location.href = res.url;
    } catch (e: any) {
      setErr(e?.message || String(e));
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 9999,
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          width: "min(920px, 100%)",
          background: "#fff",
          borderRadius: 16,
          padding: 18,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>{copy.title}</h2>
            <p style={{ margin: "8px 0 0 0", color: "#333", maxWidth: 760 }}>{copy.intro}</p>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "1px solid #ddd",
              background: "#fafafa",
              borderRadius: 10,
              padding: "8px 12px",
              cursor: "pointer",
              height: 40,
            }}
          >
            {copy.close}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          {/* AUTH */}
          <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>{copy.authTitle}</div>

            {idToken ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ color: "#111" }}>
                  ✅ {userEmail || email}
                </div>
                <button
                  onClick={doSignOut}
                  disabled={busy}
                  style={{
                    border: "1px solid #ddd",
                    background: "#fff",
                    borderRadius: 10,
                    padding: "10px 12px",
                    cursor: busy ? "not-allowed" : "pointer",
                  }}
                >
                  {copy.signOut}
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <button
                    onClick={() => setAuthMode("signin")}
                    disabled={busy}
                    style={{
                      flex: 1,
                      border: "1px solid #ddd",
                      background: authMode === "signin" ? "#111" : "#fff",
                      color: authMode === "signin" ? "#fff" : "#111",
                      borderRadius: 10,
                      padding: "10px 12px",
                      cursor: busy ? "not-allowed" : "pointer",
                    }}
                  >
                    {copy.signIn}
                  </button>
                  <button
                    onClick={() => setAuthMode("signup")}
                    disabled={busy}
                    style={{
                      flex: 1,
                      border: "1px solid #ddd",
                      background: authMode === "signup" ? "#111" : "#fff",
                      color: authMode === "signup" ? "#fff" : "#111",
                      borderRadius: 10,
                      padding: "10px 12px",
                      cursor: busy ? "not-allowed" : "pointer",
                    }}
                  >
                    {copy.signUp}
                  </button>
                </div>

                <label style={{ display: "block", fontSize: 12, color: "#333" }}>{copy.email}</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    marginTop: 6,
                  }}
                  type="email"
                  autoComplete="email"
                />

                <div style={{ height: 10 }} />

                <label style={{ display: "block", fontSize: 12, color: "#333" }}>{copy.password}</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={busy}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    marginTop: 6,
                  }}
                  type="password"
                  autoComplete={authMode === "signin" ? "current-password" : "new-password"}
                />

                <div style={{ height: 12 }} />

                <button
                  onClick={doAuth}
                  disabled={busy}
                  style={{
                    width: "100%",
                    border: "1px solid #111",
                    background: "#111",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "12px 14px",
                    cursor: busy ? "not-allowed" : "pointer",
                    fontWeight: 700,
                  }}
                >
                  {busy ? copy.statusWorking : copy.choose}
                </button>

                <div style={{ marginTop: 10, color: "#555", fontSize: 12 }}>
                  {copy.hint}
                </div>
              </>
            )}
          </div>

          {/* COMPANY INFO */}
          <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>{copy.orgTitle}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#333" }}>
                  {copy.orgName} <span style={{ color: "#c00" }}>({copy.required})</span>
                </label>
                <input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  disabled={busy}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    marginTop: 6,
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "#333" }}>
                  {copy.orgNr} <span style={{ color: "#c00" }}>({copy.required})</span>
                </label>
                <input
                  value={orgNr}
                  onChange={(e) => setOrgNr(e.target.value)}
                  disabled={busy}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    marginTop: 6,
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "#333" }}>
                  {copy.contactName} <span style={{ color: "#c00" }}>({copy.required})</span>
                </label>
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  disabled={busy}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    marginTop: 6,
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, color: "#333" }}>
                  {copy.phone} <span style={{ color: "#c00" }}>({copy.required})</span>
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={busy}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    marginTop: 6,
                  }}
                />
              </div>
            </div>

            <div style={{ height: 14 }} />

            {/* BUY OPTIONS */}
            {mode === "buy" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#333", marginBottom: 6 }}>{copy.billing}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setBillingPeriod("month")}
                        disabled={busy}
                        style={{
                          flex: 1,
                          border: "1px solid #ddd",
                          background: billingPeriod === "month" ? "#111" : "#fff",
                          color: billingPeriod === "month" ? "#fff" : "#111",
                          borderRadius: 10,
                          padding: "10px 12px",
                          cursor: busy ? "not-allowed" : "pointer",
                        }}
                      >
                        {copy.month}
                      </button>
                      <button
                        onClick={() => setBillingPeriod("year")}
                        disabled={busy}
                        style={{
                          flex: 1,
                          border: "1px solid #ddd",
                          background: billingPeriod === "year" ? "#111" : "#fff",
                          color: billingPeriod === "year" ? "#fff" : "#111",
                          borderRadius: 10,
                          padding: "10px 12px",
                          cursor: busy ? "not-allowed" : "pointer",
                        }}
                      >
                        {copy.year}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#333", marginBottom: 6 }}>{copy.purchaseType}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setPurchaseType("subscription")}
                        disabled={busy}
                        style={{
                          flex: 1,
                          border: "1px solid #ddd",
                          background: purchaseType === "subscription" ? "#111" : "#fff",
                          color: purchaseType === "subscription" ? "#fff" : "#111",
                          borderRadius: 10,
                          padding: "10px 12px",
                          cursor: busy ? "not-allowed" : "pointer",
                        }}
                      >
                        {copy.subscription}
                      </button>
                      <button
                        onClick={() => setPurchaseType("one_time")}
                        disabled={busy}
                        style={{
                          flex: 1,
                          border: "1px solid #ddd",
                          background: purchaseType === "one_time" ? "#111" : "#fff",
                          color: purchaseType === "one_time" ? "#fff" : "#111",
                          borderRadius: 10,
                          padding: "10px 12px",
                          cursor: busy ? "not-allowed" : "pointer",
                        }}
                      >
                        {copy.oneTime}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ height: 12 }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignItems: "end" }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "#333" }}>{copy.seats}</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(100, Number(e.target.value || 1))))}
                      disabled={busy}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "1px solid #ddd",
                        marginTop: 6,
                      }}
                    />
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#444" }}>Pris (eks mva): {money(priceExVat, currency)}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>
                      Pris (inkl mva): {money(priceIncVat, currency)}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div style={{ height: 14 }} />

            {/* ACTIONS */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {mode === "trial" ? (
                <button
                  onClick={startTrial}
                  disabled={busy || !canUse || !idToken}
                  style={{
                    border: "1px solid #111",
                    background: "#111",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "12px 14px",
                    cursor: busy || !canUse || !idToken ? "not-allowed" : "pointer",
                    fontWeight: 800,
                    flex: "1 1 260px",
                  }}
                >
                  {busy ? copy.statusWorking : copy.startTrial}
                </button>
              ) : (
                <button
                  onClick={goCheckout}
                  disabled={busy || !canUse || !idToken}
                  style={{
                    border: "1px solid #111",
                    background: "#111",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "12px 14px",
                    cursor: busy || !canUse || !idToken ? "not-allowed" : "pointer",
                    fontWeight: 800,
                    flex: "1 1 260px",
                  }}
                >
                  {busy ? copy.statusWorking : copy.goCheckout}
                </button>
              )}
            </div>

            {!!err && (
              <div style={{ marginTop: 12, color: "#b00020", fontSize: 13, whiteSpace: "pre-wrap" }}>
                Feil: {err}
              </div>
            )}

            <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
              Status: {busy ? copy.statusWorking : copy.statusReady}
            </div>
          </div>
        </div>

        {/* MOBILE: stack columns */}
        <style>{`
          @media (max-width: 860px) {
            .paywall-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
