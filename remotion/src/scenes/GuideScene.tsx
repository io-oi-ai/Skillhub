import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { texts, Locale } from "../i18n/texts";
import { useFadeIn, useSlideUp } from "../lib/animations";
import { fontSerif, fontSerifCn, fontMono } from "../design/fonts";

interface Props {
  locale: Locale;
}

/* Decorative shapes scattered in the background */
const decorations: {
  shape: "book" | "bulb" | "circle" | "diamond";
  x: number; // % from left
  y: number; // % from top
  size: number;
  rotation: number; // base rotation in degrees
  drift: number; // per-frame drift multiplier
}[] = [
  { shape: "book", x: 8, y: 12, size: 28, rotation: -12, drift: 0.15 },
  { shape: "bulb", x: 88, y: 18, size: 24, rotation: 10, drift: -0.12 },
  { shape: "circle", x: 15, y: 78, size: 18, rotation: 0, drift: 0.2 },
  { shape: "diamond", x: 82, y: 75, size: 20, rotation: 45, drift: -0.18 },
  { shape: "bulb", x: 5, y: 45, size: 20, rotation: -8, drift: 0.1 },
  { shape: "book", x: 92, y: 50, size: 22, rotation: 15, drift: -0.14 },
  { shape: "circle", x: 50, y: 8, size: 14, rotation: 0, drift: 0.22 },
  { shape: "diamond", x: 45, y: 88, size: 16, rotation: 30, drift: -0.16 },
  { shape: "book", x: 30, y: 5, size: 18, rotation: 20, drift: 0.12 },
  { shape: "bulb", x: 70, y: 90, size: 20, rotation: -5, drift: -0.1 },
];

/* SVG path data for each decorative shape */
function shapeContent(
  shape: "book" | "bulb" | "circle" | "diamond",
  size: number,
) {
  const color = "#b8a88a";
  switch (shape) {
    case "book":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 19.5A2.5 2.5 0 016.5 17H20"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5V4.5A2.5 2.5 0 016.5 2z"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bulb":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 21h6M12 3a6 6 0 00-4 10.5V17h8v-3.5A6 6 0 0012 3z"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "circle":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <circle
            cx={12}
            cy={12}
            r={9}
            stroke={color}
            strokeWidth={1.5}
            fill="none"
          />
        </svg>
      );
    case "diamond":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <rect
            x={4}
            y={4}
            width={16}
            height={16}
            rx={2}
            stroke={color}
            strokeWidth={1.5}
            fill="none"
          />
        </svg>
      );
  }
}

export const GuideScene: React.FC<Props> = ({ locale }) => {
  const t = texts[locale];
  const font = locale === "zh" ? fontSerifCn : fontSerif;
  const titleOpacity = useFadeIn(0, 15);
  const frame = useCurrentFrame();

  /* Fade in decorations over the first 25 frames */
  const decoOpacity = interpolate(frame, [0, 25], [0, 0.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Ambient glow opacity behind cards */
  const glowOpacity = interpolate(frame, [10, 35], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(160deg, #faf7f2 0%, #f5f0e8 35%, #eee8dc 70%, #f2ede4 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      {/* ---- Decorative background icons ---- */}
      {decorations.map((d, i) => {
        const drift = Math.sin((frame + i * 20) * 0.04) * 6;
        const rot = d.rotation + frame * d.drift;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${d.x}%`,
              top: `${d.y}%`,
              opacity: decoOpacity,
              transform: `translate(-50%, -50%) rotate(${rot}deg) translateY(${drift}px)`,
              pointerEvents: "none" as const,
            }}
          >
            {shapeContent(d.shape, d.size)}
          </div>
        );
      })}

      {/* ---- Ambient glow behind the cards ---- */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          width: 700,
          height: 260,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(255,220,170,0.45) 0%, rgba(255,220,170,0) 70%)",
          opacity: glowOpacity,
          pointerEvents: "none" as const,
        }}
      />

      {/* ---- Title ---- */}
      <h2
        style={{
          fontFamily: font,
          fontSize: 36,
          fontWeight: 700,
          color: "#1a1a1a",
          opacity: titleOpacity,
          margin: 0,
          position: "relative",
        }}
      >
        {t.guide.title}
      </h2>

      {/* ---- Cards ---- */}
      <div
        style={{
          display: "flex",
          gap: 24,
          position: "relative",
        }}
      >
        {t.guide.cards.map((card, i) => {
          const style = useSlideUp(10 + i * 10, 30, 20);
          return (
            <div
              key={card.label}
              style={{
                ...style,
                backgroundColor: "#ffffff",
                border: "1px solid #e5e5e0",
                borderRadius: 16,
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                width: 200,
                boxShadow: "0 2px 12px rgba(180,160,130,0.10)",
              }}
            >
              <span
                style={{
                  fontFamily: fontMono,
                  fontSize: 40,
                  fontWeight: 700,
                  color: "#22c55e",
                  lineHeight: 1,
                }}
              >
                {card.stat}
              </span>
              <span
                style={{
                  fontFamily: font,
                  fontSize: 16,
                  color: "#6b6b6b",
                  textAlign: "center",
                }}
              >
                {card.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
