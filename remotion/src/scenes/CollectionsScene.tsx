import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { texts, Locale } from "../i18n/texts";
import { useFadeIn, useSpringIn } from "../lib/animations";
import { fontSerif, fontSerifCn } from "../design/fonts";

interface Props {
  locale: Locale;
}

const BookmarkShape: React.FC<{
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  color: string;
}> = ({ x, y, size, rotation, opacity, color }) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size * 1.4,
      opacity,
      transform: `rotate(${rotation}deg)`,
      borderRadius: `${size * 0.15}px ${size * 0.15}px 0 0`,
      clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
      backgroundColor: color,
    }}
  />
);

const TagShape: React.FC<{
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  color: string;
}> = ({ x, y, size, rotation, opacity, color }) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: size * 1.6,
      height: size,
      opacity,
      transform: `rotate(${rotation}deg)`,
      borderRadius: `${size * 0.15}px ${size * 0.5}px ${size * 0.5}px ${size * 0.15}px`,
      backgroundColor: color,
    }}
  />
);

export const CollectionsScene: React.FC<Props> = ({ locale }) => {
  const t = texts[locale];
  const font = locale === "zh" ? fontSerifCn : fontSerif;
  const titleOpacity = useFadeIn(0, 15);
  const frame = useCurrentFrame();

  // Slow floating drift for decorative shapes
  const drift = (seed: number) =>
    interpolate(frame, [0, 120], [0, 8 + seed * 2], {
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #f7f5ee 0%, #eef0f3 60%, #e8ecf0 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      {/* Diagonal stripe pattern */}
      <AbsoluteFill
        style={{
          opacity: 0.03,
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent, transparent 28px, #8b7e6a 28px, #8b7e6a 29px)",
        }}
      />

      {/* Soft radial glow */}
      <AbsoluteFill
        style={{
          opacity: 0.12,
          background:
            "radial-gradient(ellipse 60% 50% at 30% 25%, #e8d5b8 0%, transparent 70%), " +
            "radial-gradient(ellipse 50% 40% at 75% 70%, #c5d1de 0%, transparent 70%)",
        }}
      />

      {/* Floating bookmark / tag shapes */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <BookmarkShape x={8} y={12} size={32} rotation={-15 + drift(1)} opacity={0.045} color="#9b8e7a" />
        <BookmarkShape x={85} y={18} size={26} rotation={12 + drift(2)} opacity={0.04} color="#7a8e9b" />
        <BookmarkShape x={72} y={72} size={36} rotation={-8 + drift(3)} opacity={0.035} color="#9b8a7a" />
        <TagShape x={15} y={70} size={22} rotation={20 + drift(0.5)} opacity={0.04} color="#8a9b7a" />
        <TagShape x={90} y={48} size={18} rotation={-25 + drift(1.5)} opacity={0.035} color="#7a7e9b" />
        <TagShape x={5} y={42} size={20} rotation={10 + drift(2.5)} opacity={0.03} color="#9b7a8a" />
        <BookmarkShape x={50} y={8} size={22} rotation={5 + drift(0.8)} opacity={0.03} color="#8b8e7a" />
      </AbsoluteFill>
      <h2
        style={{
          fontFamily: font,
          fontSize: 40,
          fontWeight: 700,
          color: "#1a1a1a",
          opacity: titleOpacity,
          margin: 0,
        }}
      >
        {t.collections.title}
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12,
          maxWidth: "80%",
        }}
      >
        {t.collections.items.map((item, i) => {
          const s = useSpringIn(10 + i * 6);
          return (
            <div
              key={item}
              style={{
                opacity: s,
                transform: `scale(${s})`,
                backgroundColor: "#1a1a1a",
                color: "#ffffff",
                borderRadius: 999,
                padding: "10px 24px",
                fontSize: 18,
                fontFamily: font,
                fontWeight: 500,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
