import { ImageResponse } from "next/og";

export const alt = "Uttam Singh, AI/ML engineer and data science student";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a1020", color: "#eef2fb", padding: 80 }}>
        <div style={{ display: "flex", fontSize: 28, color: "#2dd4bf" }}>Gurugram, India</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>Uttam Singh</div>
          <div style={{ fontSize: 40, marginTop: 24, color: "#a6b2ca" }}>AI/ML engineer and data science student</div>
        </div>
      </div>
    ),
    size,
  );
}
