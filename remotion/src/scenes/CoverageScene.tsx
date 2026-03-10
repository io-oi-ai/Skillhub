import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { texts, Locale } from "../i18n/texts";
import { useFadeIn, useCountUp } from "../lib/animations";
import { fontSerif, fontSerifCn, fontMono } from "../design/fonts";

interface Props {
  locale: Locale;
}

/** Generates SVG data URI for a subtle dot grid pattern */
const dotGridSvg = (() => {
  const size = 24;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="1" fill="rgba(0,0,0,0.08)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

export const CoverageScene: React.FC<Props> = ({ locale }) => {
  const frame = useCurrentFrame();
  const t = texts[locale];
  const font = locale === "zh" ? fontSerifCn : fontSerif;
  const containerOpacity = useFadeIn(0, 10);
  const skillCount = useCountUp(t.coverage.skillsNum, 5, 30, 0);
  const roleCount = useCountUp(t.coverage.rolesNum, 10, 25, 0);
  const sceneCount = useCountUp(t.coverage.scenesNum, 15, 25, 0);

  const columns = [
    { num: `${skillCount}+`, label: t.coverage.skills },
    { num: roleCount, label: t.coverage.roles },
    { num: sceneCount, label: t.coverage.scenes },
  ];

  // Animated light beam rotations (slow, subtle)
  const beam1Rotate = interpolate(frame, [0, 120], [-15, 15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beam2Rotate = interpolate(frame, [0, 120], [10, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beam3Rotate = interpolate(frame, [0, 120], [-5, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(170deg, #f8f8f4 0%, #f0f0ea 40%, #e8e8e2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: containerOpacity,
      }}
    >
      {/* Dot grid pattern overlay */}
      <AbsoluteFill
        style={{
          backgroundImage: dotGridSvg,
          backgroundRepeat: "repeat",
          opacity: 0.6,
        }}
      />

      {/* Animated light beams behind the numbers */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Beam 1 - left */}
        <div
          style={{
            position: "absolute",
            width: 260,
            height: 500,
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)",
            transform: `rotate(${beam1Rotate}deg)`,
            left: "18%",
            top: "10%",
          }}
        />
        {/* Beam 2 - center */}
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 550,
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)",
            transform: `rotate(${beam2Rotate}deg)`,
            left: "38%",
            top: "5%",
          }}
        />
        {/* Beam 3 - right */}
        <div
          style={{
            position: "absolute",
            width: 240,
            height: 480,
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
            transform: `rotate(${beam3Rotate}deg)`,
            right: "16%",
            top: "8%",
          }}
        />
      </AbsoluteFill>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          gap: 0,
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {columns.map((col, i) => (
          <React.Fragment key={col.label}>
            {i > 0 && (
              <div
                style={{
                  width: 1,
                  height: 80,
                  backgroundColor: "#e5e5e0",
                  margin: "0 48px",
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: fontMono,
                  fontSize: 72,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  lineHeight: 1,
                }}
              >
                {col.num}
              </span>
              <span
                style={{
                  fontFamily: font,
                  fontSize: 20,
                  color: "#6b6b6b",
                }}
              >
                {col.label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};
