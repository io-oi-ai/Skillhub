import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { texts, Locale } from "../i18n/texts";
import { useFadeIn, useTypewriter } from "../lib/animations";
import { fontSerif, fontSerifCn, fontMono } from "../design/fonts";

const CODE_LINES = [
  "0x4A 0xF2 0x9C 0x01 0xBE 0x7D 0xA3 0x58",
  "01001010 11110010 10011100 00000001",
  "const skill = await fetch(api);",
  "0xDE 0xAD 0xBE 0xEF 0xCA 0xFE 0xBA 0xBE",
  "11011110 10101101 10111110 11101111",
  "pipe(install, configure, run);",
  "0x1F 0x8B 0x08 0x00 0x00 0x09 0x6E 0x88",
  "01011010 00111001 11001100 10100011",
  "export default function main() {}",
  "0xFF 0xD8 0xFF 0xE0 0x00 0x10 0x4A 0x46",
  "10110011 01010101 11101001 00011100",
  "npm install @skillhubs/cli",
  "0x7F 0x45 0x4C 0x46 0x02 0x01 0x01 0x00",
  "01111111 01000101 01101100 01100110",
  "git clone repo && cd project",
];

interface Props {
  locale: Locale;
}

export const CliScene: React.FC<Props> = ({ locale }) => {
  const frame = useCurrentFrame();
  const t = texts[locale];
  const font = locale === "zh" ? fontSerifCn : fontSerif;
  const windowOpacity = useFadeIn(0, 10);
  const commandText = useTypewriter(t.cli.command, 10, 0.8);
  const outputText = useTypewriter(
    t.cli.output,
    10 + Math.ceil(t.cli.command.length / 0.8) + 10,
    1.5
  );

  const scrollY = interpolate(frame, [0, 300], [0, -600], {
    extrapolateRight: "extend",
  });

  const glowOpacity = interpolate(frame, [0, 15, 60, 90], [0, 0.6, 0.8, 0.6], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #f5f5f0 0%, #e8e6df 40%, #ddd9d0 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {/* Scrolling code/binary background pattern */}
      <AbsoluteFill
        style={{
          overflow: "hidden",
          opacity: 0.04,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: fontMono,
            fontSize: 13,
            lineHeight: 2.2,
            color: "#1a1a1a",
            whiteSpace: "pre",
            transform: `translateY(${scrollY}px)`,
            padding: "40px 60px",
            columnCount: 3,
            columnGap: 40,
          }}
        >
          {Array.from({ length: 6 }, () => CODE_LINES)
            .flat()
            .map((line, i) => (
              <div key={i}>{line}</div>
            ))}
        </div>
      </AbsoluteFill>

      {/* Soft radial vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.04) 100%)",
          pointerEvents: "none",
        }}
      />

      <h2
        style={{
          fontFamily: font,
          fontSize: 32,
          fontWeight: 700,
          color: "#1a1a1a",
          margin: 0,
          opacity: windowOpacity,
        }}
      >
        {t.cli.title}
      </h2>
      <div
        style={{
          opacity: windowOpacity,
          width: "80%",
          maxWidth: 700,
          backgroundColor: "#1e1e2e",
          borderRadius: 12,
          border: "1px solid #45475a",
          overflow: "hidden",
          boxShadow: `0 4px 30px rgba(30, 30, 46, ${0.25 * glowOpacity}), 0 0 80px rgba(166, 227, 161, ${0.08 * glowOpacity})`,
        }}
      >
        {/* Window header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            borderBottom: "1px solid #45475a",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#f38ba8",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#f9e2af",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#a6e3a1",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: fontMono,
              fontSize: 12,
              color: "#6c7086",
            }}
          >
            terminal
          </span>
          <div style={{ width: 44 }} />
        </div>
        {/* Terminal content */}
        <div
          style={{
            padding: "20px 24px",
            fontFamily: fontMono,
            fontSize: 14,
            lineHeight: 1.6,
            minHeight: 200,
          }}
        >
          <span style={{ color: "#a6e3a1" }}>{commandText}</span>
          {commandText.length === t.cli.command.length && (
            <>
              <br />
              <br />
              <span style={{ color: "#cdd6f4", whiteSpace: "pre" }}>
                {outputText}
              </span>
            </>
          )}
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 18,
              backgroundColor: "#a6e3a1",
              marginLeft: 2,
              verticalAlign: "middle",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
