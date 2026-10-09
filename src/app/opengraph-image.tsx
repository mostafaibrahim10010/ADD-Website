import { ImageResponse } from "next/og";

export const alt = "ADD — Architecture Design + Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RED = "#A81F23";

/** Social share card: the red ADD mark with the studio tagline. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          gap: 56,
        }}
      >
        <svg width="744" height="250" viewBox="0 0 1192 401" fill={RED}>
          <path d="M401.921 400.766H0V200.188C0 89.6853 90.0141 0 201 0C311.986 0 402 89.6853 402 200.266V400.845L401.921 400.766Z" />
          <path
            transform="translate(400.04 1)"
            d="M205.16 399.845C318.266 399.845 410 310.296 410 199.884C410 89.4709 318.266 0 205.16 0H0V399.845H205.16Z"
          />
          <path
            transform="translate(790.06 0)"
            d="M201.157 399.845C312.056 399.845 402 310.296 402 199.884C402 89.4709 312.056 0 201.157 0H0V399.845H201.157Z"
          />
        </svg>
        <div style={{ display: "flex", fontSize: 34, letterSpacing: 8, color: "#111111" }}>
          ARCHITECTURE · DESIGN + DEVELOPMENT
        </div>
      </div>
    ),
    size,
  );
}
