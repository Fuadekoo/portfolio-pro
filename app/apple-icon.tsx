import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 30% 20%, #6e8bff 0%, #2a2350 55%, #060609 100%)",
          color: "white",
          fontSize: 110,
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
        }}
      >
        {site.initials}
      </div>
    ),
    size,
  );
}
