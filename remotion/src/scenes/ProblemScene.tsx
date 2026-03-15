import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { texts, Locale } from "../i18n/texts";
import { useFadeIn, useSlideUp } from "../lib/animations";
import { fontSerif, fontSerifCn } from "../design/fonts";

interface Props {
  locale: Locale;
}

const DECORATIVE_MARKS = [
  { x: 12, y: 18, rotation: 25, size: 80 },
  { x: 78, y: 12, rotation: -15, size: 60 },
  { x: 88, y: 72, rotation: 40, size: 100 },
  { x: 8, y: 75, rotation: -30, size: 70 },
  { x: 50, y: 8, rotation: 10, size: 50 },
  { x: 35, y: 85, rotation: -45, size: 65 },
  { x: 65, y: 45, rotation: 20, size: 55 },
  { x: 20, y: 50, rotation: -20, size: 75 },
];

export const ProblemScene: React.FC<Props> = ({ locale }) => {
  const t = texts[locale];
  const frame = useCurrentFrame();
  const font = locale === "zh" ? fontSerifCn : fontSerif;

  const line1Opacity = useFadeIn(10, 15);
  const line1Slide = useSlideUp(10, 30, 20);
  const line2Opacity = useFadeIn(50, 15);
  const line2Slide = useSlideUp(50, 30, 20);

  // Background transition from dark to slightly lighter
  const bgProgress = interpolate(frame, [0, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bgColor = `rgb(${10 + bgProgress * 16}, ${10 + bgProgress * 16}, ${10 + bgProgress * 16})`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        overflow: "hidden",
      }}
    >
      {/* Decorative X marks in background */}
      {DECORATIVE_MARKS.map((mark, i) => {
        const markOpacity = interpolate(
          frame,
          [15 + i * 5, 35 + i * 5],
          [0, 0.06],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const drift = interpolate(frame, [0, 240], [0, (i % 2 === 0 ? 1 : -1) * 8], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${mark.x}%`,
              top: `${mark.y}%`,
              width: mark.size,
              height: mark.size,
              opacity: markOpacity,
              transform: `rotate(${mark.rotation}deg) translateY(${drift}px)`,
              pointerEvents: "none",
            }}
          >
            {/* X mark using two crossing lines */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "10%",
                width: "80%",
                height: 3,
                backgroundColor: "rgba(200, 80, 50, 1)",
                transform: "rotate(45deg)",
                borderRadius: 2,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "10%",
                width: "80%",
                height: 3,
                backgroundColor: "rgba(200, 80, 50, 1)",
                transform: "rotate(-45deg)",
                borderRadius: 2,
              }}
            />
          </div>
        );
      })}

      {/* Line 1 — muted, medium */}
      <p
        style={{
          fontFamily: font,
          fontSize: 32,
          fontWeight: 400,
          color: "#9a9a9a",
          margin: 0,
          maxWidth: "80%",
          textAlign: "center",
          lineHeight: 1.5,
          opacity: line1Opacity,
          transform: line1Slide.transform,
        }}
      >
        {t.problem.line1}
      </p>

      {/* Line 2 — bold, prominent */}
      <p
        style={{
          fontFamily: font,
          fontSize: 44,
          fontWeight: 700,
          color: "#f5f5f0",
          margin: 0,
          maxWidth: "80%",
          textAlign: "center",
          lineHeight: 1.4,
          opacity: line2Opacity,
          transform: line2Slide.transform,
        }}
      >
        {t.problem.line2}
      </p>
    </AbsoluteFill>
  );
};
