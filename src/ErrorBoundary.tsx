import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
  info?: React.ErrorInfo;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Logg til console (og kan senere sendes til backend hvis du vil)
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught an error:", error, info);
    this.setState({ info });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "24px",
          background: "var(--mcl-bg)",
          color: "var(--mcl-text)",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <h1 style={{ marginTop: 0 }}>App crashed (runtime error)</h1>
        <p style={{ opacity: 0.85, maxWidth: 900 }}>
          Dette er en kontrollert feilsiden slik at du slipper whitescreen. Kopier teksten under og lim
          den inn her, så fikser jeg feilen med én gang.
        </p>

        <div
          style={{
            marginTop: 16,
            padding: 16,
            border: "1px solid var(--mcl-border)",
            borderRadius: 12,
            background: "var(--mcl-surface)",
            boxShadow: "var(--mcl-shadow)",
            overflowX: "auto",
            maxWidth: 1100,
          }}
        >
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
{`Message:
${this.state.error?.message ?? "(no message)"}

Stack:
${this.state.error?.stack ?? "(no stack)"}

Component stack:
${this.state.info?.componentStack ?? "(no component stack)"}
`}
          </pre>
        </div>
      </div>
    );
  }
}
