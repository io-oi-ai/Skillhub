import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { texts, Locale } from "../i18n/texts";
import { useScaleIn, useFadeIn } from "../lib/animations";
import { fontSerif, fontSerifCn, fontMono } from "../design/fonts";

interface Props {
  locale: Locale;
}

// Sparkle positions and timing — deterministic so every render is identical
const sparkles = [
  { x: 12, y: 8, size: 3, delay: 0, duration: 40 },
  { x: 85, y: 15, size: 2.5, delay: 10, duration: 35 },
  { x: 30, y: 75, size: 2, delay: 5, duration: 45 },
  { x: 72, y: 82, size: 3.5, delay: 18, duration: 38 },
  { x: 50, y: 5, size: 2, delay: 25, duration: 42 },
  { x: 8, y: 50, size: 2.5, delay: 12, duration: 36 },
  { x: 92, y: 55, size: 3, delay: 8, duration: 40 },
  { x: 20, y: 25, size: 2, delay: 30, duration: 34 },
  { x: 65, y: 90, size: 2.5, delay: 15, duration: 44 },
  { x: 40, y: 40, size: 1.8, delay: 22, duration: 38 },
  { x: 78, y: 30, size: 2.2, delay: 6, duration: 42 },
  { x: 55, y: 65, size: 2, delay: 20, duration: 36 },
  { x: 15, y: 88, size: 3, delay: 28, duration: 40 },
  { x: 88, y: 42, size: 2.8, delay: 3, duration: 44 },
];

// Light-ray configs
const rays = [
  { x: 20, width: 120, delay: 0 },
  { x: 45, width: 180, delay: 8 },
  { x: 70, width: 140, delay: 16 },
];

export const CtaScene: React.FC<Props> = ({ locale }) => {
  const frame = useCurrentFrame();
  const t = texts[locale];
  const font = locale === "zh" ? fontSerifCn : fontSerif;
  const urlStyle = useScaleIn(0);
  const badgeOpacity = useFadeIn(15, 15);

  // Pulsing glow behind URL — oscillates between 0.25 and 0.55
  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.25, 0.55],
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        overflow: "hidden",
      }}
    >
      {/* Radial gradient overlay — lighter edges */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, rgba(34,197,94,0.04) 60%, rgba(34,197,94,0.08) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Aurora / light rays at the top */}
      {rays.map((ray, i) => {
        const rayOpacity = interpolate(
          Math.sin((frame - ray.delay) * 0.05),
          [-1, 1],
          [0.02, 0.07],
        );
        const sway = interpolate(
          Math.sin((frame - ray.delay) * 0.03),
          [-1, 1],
          [-15, 15],
        );
        return (
          <div
            key={`ray-${i}`}
            style={{
              position: "absolute",
              top: 0,
              left: `${ray.x + sway * 0.1}%`,
              width: ray.width,
              height: "55%",
              background: `linear-gradient(180deg, rgba(34,197,94,${rayOpacity * 1.2}) 0%, rgba(34,197,94,0) 100%)`,
              transform: `translateX(-50%) skewX(${sway * 0.3}deg)`,
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Aurora at the bottom — warm tint */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          width: 700,
          height: "30%",
          background: `radial-gradient(ellipse at 50% 100%, rgba(34,197,94,${interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.06])}) 0%, transparent 70%)`,
          transform: "translateX(-50%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Sparkles */}
      {sparkles.map((s, i) => {
        const cycle = (frame - s.delay) % s.duration;
        const sparkleOpacity = interpolate(
          cycle,
          [0, s.duration * 0.3, s.duration * 0.5, s.duration],
          [0, 0.9, 0.9, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const sparkleScale = interpolate(
          cycle,
          [0, s.duration * 0.4, s.duration],
          [0.3, 1, 0.3],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <div
            key={`sparkle-${i}`}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size * 2,
              height: s.size * 2,
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              opacity: sparkleOpacity * 0.7,
              transform: `scale(${sparkleScale})`,
              boxShadow: `0 0 ${s.size * 3}px ${s.size}px rgba(255,255,255,0.3)`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Pulsing glow behind URL */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 420,
          height: 100,
          transform: "translate(-50%, -60%)",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, rgba(34,197,94,${glowPulse * 0.25}) 0%, transparent 70%)`,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Original content — untouched */}
      <div style={urlStyle}>
        <span
          style={{
            fontFamily: fontMono,
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          {t.cta.url}
        </span>
      </div>
      <div
        style={{
          opacity: badgeOpacity,
          backgroundColor: "#22c55e",
          color: "#ffffff",
          borderRadius: 999,
          padding: "10px 28px",
          fontSize: 20,
          fontFamily: font,
          fontWeight: 600,
        }}
      >
        {t.cta.badge}
      </div>
    </AbsoluteFill>
  );
};
