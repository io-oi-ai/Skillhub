import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Logo } from "../design/Logo";
import { texts, Locale } from "../i18n/texts";
import { useScaleIn, useFadeIn, useSlideUp } from "../lib/animations";
import { fontSerif, fontSerifCn } from "../design/fonts";

interface Props {
  locale: Locale;
}

const PARTICLES = [
  { x: 20, y: 85, size: 4, opacity: 0.08, speed: 0.6 },
  { x: 40, y: 90, size: 3, opacity: 0.06, speed: 0.8 },
  { x: 65, y: 80, size: 5, opacity: 0.1, speed: 0.5 },
  { x: 80, y: 88, size: 3, opacity: 0.05, speed: 0.7 },
  { x: 35, y: 95, size: 4, opacity: 0.07, speed: 0.9 },
  { x: 55, y: 82, size: 3, opacity: 0.06, speed: 0.65 },
];

export const SolutionScene: React.FC<Props> = ({ locale }) => {
  const t = texts[locale];
  const frame = useCurrentFrame();
  const logoStyle = useScaleIn(0);
  const line1Opacity = useFadeIn(20, 15);
  const line2Style = useSlideUp(45, 30, 15);
  const font = locale === "zh" ? fontSerifCn : fontSerif;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a2a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        overflow: "hidden",
      }}
    >
      {/* Animated particles drifting upward */}
      {PARTICLES.map((particle, i) => {
        const drift = interpolate(frame, [0, 240], [0, -particle.speed * 200], {
          extrapolateRight: "clamp",
        });
        const fadeIn = interpolate(frame, [0, 30], [0, 1], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              background: "#ffffff",
              opacity: particle.opacity * fadeIn,
              transform: `translateY(${drift}px)`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Logo */}
      <div style={logoStyle}>
        <Logo size={60} color="#f5f5f0" />
      </div>

      {/* Line 1 */}
      <p
        style={{
          fontFamily: font,
          fontSize: 28,
          color: "#cccccc",
          opacity: line1Opacity,
          margin: 0,
          maxWidth: "85%",
          textAlign: "center",
        }}
      >
        {t.solution.line1}
      </p>

      {/* Line 2 */}
      <p
        style={{
          fontFamily: font,
          fontSize: 36,
          fontWeight: 700,
          color: "#f5f5f0",
          margin: 0,
          maxWidth: "85%",
          textAlign: "center",
          ...line2Style,
        }}
      >
        {t.solution.line2}
      </p>
    </AbsoluteFill>
  );
};
