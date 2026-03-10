import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Logo } from "../design/Logo";
import { texts, Locale } from "../i18n/texts";
import { useScaleIn, useFadeIn } from "../lib/animations";
import { fontSerif, fontSerifCn } from "../design/fonts";

interface Props {
  locale: Locale;
}

const DECORATIVE_CIRCLES = [
  { x: 15, y: 20, size: 120, color: "rgba(200, 180, 140, 0.12)", speedX: 0.3, speedY: 0.2 },
  { x: 75, y: 15, size: 90, color: "rgba(180, 160, 130, 0.10)", speedX: -0.2, speedY: 0.25 },
  { x: 85, y: 70, size: 150, color: "rgba(210, 190, 150, 0.08)", speedX: -0.15, speedY: -0.2 },
  { x: 25, y: 80, size: 70, color: "rgba(190, 170, 140, 0.10)", speedX: 0.25, speedY: -0.15 },
  { x: 50, y: 10, size: 60, color: "rgba(180, 165, 130, 0.09)", speedX: -0.1, speedY: 0.3 },
  { x: 10, y: 50, size: 100, color: "rgba(200, 185, 150, 0.07)", speedX: 0.2, speedY: -0.1 },
  { x: 60, y: 85, size: 80, color: "rgba(195, 175, 145, 0.10)", speedX: 0.15, speedY: -0.25 },
  { x: 90, y: 40, size: 55, color: "rgba(185, 170, 140, 0.08)", speedX: -0.25, speedY: 0.15 },
];

export const IntroScene: React.FC<Props> = ({ locale }) => {
  const t = texts[locale];
  const frame = useCurrentFrame();
  const logoStyle = useScaleIn(0);
  const titleOpacity = useFadeIn(15, 20);
  const subtitleOpacity = useFadeIn(25, 20);
  const font = locale === "zh" ? fontSerifCn : fontSerif;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 80% 70% at 50% 45%, #faf8f2 0%, #f0ede4 40%, #e8e4da 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        overflow: "hidden",
      }}
    >
      {/* Decorative floating circles */}
      {DECORATIVE_CIRCLES.map((circle, i) => {
        const offsetX = interpolate(frame, [0, 150], [0, circle.speedX * 40], {
          extrapolateRight: "clamp",
        });
        const offsetY = interpolate(frame, [0, 150], [0, circle.speedY * 40], {
          extrapolateRight: "clamp",
        });
        const scale = interpolate(
          frame,
          [0, 80, 150],
          [0.9, 1.05, 0.95],
          { extrapolateRight: "clamp" }
        );
        const opacity = interpolate(frame, [0, 30], [0, 1], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${circle.x}%`,
              top: `${circle.y}%`,
              width: circle.size,
              height: circle.size,
              borderRadius: "50%",
              background: circle.color,
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
              opacity,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Existing content */}
      <div style={logoStyle}>
        <Logo size={80} color="#1a1a1a" />
      </div>
      <h1
        style={{
          fontFamily: font,
          fontSize: 56,
          fontWeight: 700,
          color: "#1a1a1a",
          opacity: titleOpacity,
          margin: 0,
        }}
      >
        {t.intro.title}
      </h1>
      <p
        style={{
          fontFamily: font,
          fontSize: 24,
          color: "#6b6b6b",
          opacity: subtitleOpacity,
          margin: 0,
          maxWidth: "80%",
          textAlign: "center",
        }}
      >
        {t.intro.subtitle}
      </p>
    </AbsoluteFill>
  );
};
