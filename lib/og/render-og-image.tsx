import { ImageResponse } from "next/og";

type OgMetric = {
  label: string;
  value: string;
};

type OgImageOptions = {
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
  secondary?: string;
  metrics?: OgMetric[];
};

const size = {
  width: 1200,
  height: 630
};

const contentType = "image/png";

function trimCopy(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1).trim()}...` : value;
}

export function renderRockstarOgImage({
  eyebrow,
  title,
  description,
  accent = "#f5c84b",
  secondary = "#ff6f3d",
  metrics = []
}: OgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 48,
          color: "white",
          background:
            "radial-gradient(circle at 16% 18%, rgba(245,200,75,0.2), transparent 30%), radial-gradient(circle at 86% 22%, rgba(255,111,61,0.16), transparent 28%), linear-gradient(135deg, #020202 0%, #090907 48%, #151207 100%)",
          fontFamily: "Arial",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.14,
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "44px 44px"
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: 260,
            background: `radial-gradient(circle, ${accent}55, transparent 64%)`
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -100,
            bottom: -180,
            width: 620,
            height: 420,
            borderRadius: 260,
            background: `radial-gradient(circle, ${secondary}40, transparent 68%)`
          }}
        />

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(255,255,255,0.24)",
            borderRadius: 34,
            padding: 42,
            background: "rgba(0,0,0,0.44)",
            boxShadow: "0 30px 90px rgba(0,0,0,0.48)",
            position: "relative"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: "#f5c84b",
                  color: "#080808",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 900,
                  letterSpacing: -2
                }}
              >
                R
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 14, letterSpacing: 8, textTransform: "uppercase", color: "rgba(255,255,255,0.72)" }}>
                  Rockstar Sales Universe
                </div>
                <div style={{ marginTop: 8, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.42)" }}>
                  Release atlas, sales model, source audit
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 999,
                padding: "10px 16px",
                fontSize: 12,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.72)"
              }}
            >
              Portfolio Demo
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
            <div style={{ fontSize: 14, letterSpacing: 7, textTransform: "uppercase", color: accent }}>{eyebrow}</div>
            <div
              style={{
                marginTop: 18,
                fontSize: title.length > 34 ? 58 : 72,
                lineHeight: 0.9,
                letterSpacing: -2,
                textTransform: "uppercase",
                fontWeight: 900
              }}
            >
              {trimCopy(title, 58)}
            </div>
            <div style={{ marginTop: 24, maxWidth: 720, fontSize: 25, lineHeight: 1.35, color: "rgba(255,255,255,0.72)" }}>
              {trimCopy(description, 150)}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
            {(metrics.length ? metrics : [{ label: "Mode", value: "Official + modeled" }, { label: "Trust", value: "Source-first" }, { label: "Stack", value: "Next.js" }]).slice(0, 4).map((metric) => (
              <div
                key={metric.label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 18,
                  padding: 18,
                  background: "rgba(255,255,255,0.055)"
                }}
              >
                <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.42)" }}>
                  {metric.label}
                </div>
                <div style={{ marginTop: 8, fontSize: 26, fontWeight: 900, color: "white" }}>{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}

export { contentType, size };
