import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/brand";

export const runtime = "edge";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(145deg, #083B7A 0%, #0B5ED7 55%, #3B82F6 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: 0.9,
            marginBottom: 16,
          }}
        >
          Free · India-focused · No account
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 32,
            maxWidth: 900,
            lineHeight: 1.35,
            opacity: 0.95,
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 24,
            opacity: 0.85,
          }}
        >
          Calculators · Guides · Topic hubs
        </div>
      </div>
    ),
    { ...size }
  );
}
