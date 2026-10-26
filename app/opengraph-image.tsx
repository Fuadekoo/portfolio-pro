import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(ellipse 60% 70% at 15% 0%, rgba(110,139,255,0.35), transparent 70%), radial-gradient(ellipse 50% 60% at 100% 100%, rgba(167,123,255,0.28), transparent 70%), #060609",
          color: "#f3f3f6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #6e8bff, #a77bff)",
              fontSize: 36,
              fontStyle: "italic",
            }}
          >
            {site.initials}
          </div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>{site.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Full-Stack</div>
          <div
            style={{
              fontSize: 104,
              fontStyle: "italic",
              lineHeight: 1.1,
              letterSpacing: -2,
              color: "#9fb2ff",
            }}
          >
            Developer
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#a1a1ae", maxWidth: 900 }}>{site.tagline}</div>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#a1a1ae" }}>
          {["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
