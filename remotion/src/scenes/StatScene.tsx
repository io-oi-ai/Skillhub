import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { texts, Locale } from "../i18n/texts";
import { useFadeIn, useCountUp } from "../lib/animations";
import { fontSerif, fontSerifCn, fontMono } from "../design/fonts";

interface Props {
  locale: Locale;
}

export const StatScene: React.FC<Props> = ({ locale }) => {
  const frame = useCurrentFrame();
  const t = texts[locale];
  const font = locale === "zh" ? fontSerifCn : fontSerif;
  const containerOpacity = useFadeIn(0, 10);
  const count = useCountUp(16.2, 5, 35, 1);
  const labelOpacity = useFadeIn(15, 15);
  const badgeOpacity = useFadeIn(30, 15);

  // Animated concentric rings behind the stat card
  const ringBaseScale = interpolate(frame, [0, 60], [0.6, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const pulseOffset = Math.sin(frame * 0.06) * 0.04;

  // Dot grid animation — subtle fade in
  const gridOpacity = interpolate(frame, [0, 25], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Generate dot grid positions
  const dots: { x: number; y: number }[] = [];
  const spacing = 48;
  for (let x = spacing; x < 1920; x += spacing) {
    for (let y = spacing; y < 1080; y += spacing) {
      dots.push({ x, y });
    }
  }

  const rings = [0, 1, 2, 3, 4];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #f8f8f4 0%, #f0f0ea 40%, #e8efe8 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        opacity: containerOpacity,
      }}
    >
      {/* Dot grid background */}
      <AbsoluteFill style={{ opacity: gridOpacity }}>
        <svg width="1920" height="1080" style={{ position: "absolute", top: 0, left: 0 }}>
          {dots.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r={1.2}
              fill="#c8c8c0"
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* Concentric rings behind the card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 0,
          height: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {rings.map((i) => {
          const size = 220 + i * 90;
          const ringScale = ringBaseScale + pulseOffset * (1 - i * 0.15);
          const ringOpacity = interpolate(
            frame,
            [5 + i * 4, 20 + i * 4],
            [0, 0.12 - i * 0.02],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                border: `1.5px solid #22c55e`,
                opacity: ringOpacity,
                transform: `scale(${ringScale})`,
              }}
            />
          );
        })}
      </div>

      {/* Soft radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)",
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* Stat card */}
      <div
        style={{
          backgroundColor: "#f0fdf4",
          borderRadius: 20,
          padding: "40px 64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontFamily: fontMono,
            fontSize: 96,
            fontWeight: 700,
            color: "#22c55e",
            lineHeight: 1,
          }}
        >
          +{count}
          <span style={{ fontSize: 48 }}>pp</span>
        </span>
        <span
          style={{
            fontFamily: font,
            fontSize: 24,
            color: "#1a1a1a",
            opacity: labelOpacity,
          }}
        >
          {t.stat.label}
        </span>
      </div>
      <div
        style={{
          fontFamily: fontMono,
          fontSize: 14,
          color: "#9a9a9a",
          opacity: badgeOpacity,
          borderRadius: 999,
          border: "1px solid #e5e5e0",
          padding: "6px 16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {t.stat.badge}
      </div>
    </AbsoluteFill>
  );
};
