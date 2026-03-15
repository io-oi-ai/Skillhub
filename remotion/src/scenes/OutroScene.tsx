import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { texts, Locale } from "../i18n/texts";
import { useScaleIn, useFadeIn } from "../lib/animations";
import { Logo } from "../design/Logo";
import { fontSerif, fontSerifCn } from "../design/fonts";

interface Props {
  locale: Locale;
}

export const OutroScene: React.FC<Props> = ({ locale }) => {
  const frame = useCurrentFrame();
  const t = texts[locale];
  const font = locale === "zh" ? fontSerifCn : fontSerif;

  const logoStyle = useScaleIn(0);
  const titleOpacity = useFadeIn(15, 15);
  const taglineOpacity = useFadeIn(40, 15);

  // Subtle pulsing glow behind logo
  const glowPulse = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.15, 0.35],
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {/* Subtle pulsing radial glow behind logo */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 300,
          height: 300,
          transform: "translate(-50%, -60%)",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, rgba(245,245,240,${glowPulse * 0.12}) 0%, rgba(245,245,240,${glowPulse * 0.04}) 40%, transparent 70%)`,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div style={logoStyle}>
        <Logo size={70} color="#f5f5f0" />
      </div>

      {/* Title */}
      <p
        style={{
          fontFamily: font,
          fontSize: 56,
          fontWeight: 700,
          color: "#ffffff",
          opacity: titleOpacity,
          margin: 0,
          letterSpacing: -0.5,
        }}
      >
        {t.outro.title}
      </p>

      {/* Tagline */}
      <p
        style={{
          fontFamily: font,
          fontSize: 22,
          color: "#9a9a9a",
          opacity: taglineOpacity,
          margin: 0,
        }}
      >
        {t.outro.tagline}
      </p>
    </AbsoluteFill>
  );
};
