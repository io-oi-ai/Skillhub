import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Locale } from "../i18n/texts";
import { texts } from "../i18n/texts";
import { fontSerif, fontSerifCn } from "../design/fonts";
import { useTypewriter, useFadeIn } from "../lib/animations";

interface Props {
  locale: Locale;
}

export const HookScene: React.FC<Props> = ({ locale }) => {
  const t = texts[locale];
  const frame = useCurrentFrame();
  const font = locale === "zh" ? fontSerifCn : fontSerif;

  // Typewriter effect: reveal word by word
  const fullText = t.hook.text;
  const words = fullText.split(" ");
  const framesPerWord = 10;
  const visibleWordCount = Math.min(
    Math.floor(frame / framesPerWord) + 1,
    words.length
  );
  const displayedText = words.slice(0, visibleWordCount).join(" ");

  // Fade in the whole container
  const containerOpacity = useFadeIn(0, 10);

  // Subtle glow intensity pulses
  const glowIntensity = interpolate(
    frame,
    [0, 60, 120],
    [0, 1, 0.8],
    { extrapolateRight: "clamp" }
  );

  // Animated gradient pulse for background
  const pulseScale = interpolate(
    frame,
    [0, 60, 120],
    [0.8, 1.2, 1.0],
    { extrapolateRight: "clamp" }
  );

  const gradientOpacity = interpolate(
    frame,
    [0, 30, 90, 120],
    [0, 0.15, 0.2, 0.12],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated gradient pulse */}
      <div
        style={{
          position: "absolute",
          width: "120%",
          height: "120%",
          top: "-10%",
          left: "-10%",
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(245, 245, 240, ${gradientOpacity}) 0%, transparent 70%)`,
          transform: `scale(${pulseScale})`,
          pointerEvents: "none",
        }}
      />

      {/* Subtle glow behind text */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, rgba(245, 245, 240, ${0.08 * glowIntensity}) 0%, transparent 70%)`,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Text */}
      <div
        style={{
          opacity: containerOpacity,
          maxWidth: "80%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontFamily: font,
            fontSize: 52,
            fontWeight: 700,
            color: "#f5f5f0",
            margin: 0,
            lineHeight: 1.4,
            letterSpacing: "-0.02em",
          }}
        >
          {displayedText}
          {/* Blinking cursor while typing */}
          {visibleWordCount < words.length && (
            <span
              style={{
                opacity: frame % 16 < 8 ? 1 : 0,
                color: "#f5f5f0",
                fontWeight: 300,
                marginLeft: 2,
              }}
            >
              |
            </span>
          )}
        </h1>
      </div>
    </AbsoluteFill>
  );
};
