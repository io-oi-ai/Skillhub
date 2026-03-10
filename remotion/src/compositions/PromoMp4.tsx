import React from "react";
import {
  Sequence,
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
  Audio,
  staticFile,
} from "remotion";
import { Locale } from "../i18n/texts";
import { IntroScene } from "../scenes/IntroScene";
import { StatScene } from "../scenes/StatScene";
import { CollectionsScene } from "../scenes/CollectionsScene";
import { CoverageScene } from "../scenes/CoverageScene";
import { CtaScene } from "../scenes/CtaScene";
import { GuideScene } from "../scenes/GuideScene";
import { CliScene } from "../scenes/CliScene";

interface Props {
  locale: Locale;
}

const FPS = 30;
const SCENE_SECONDS = [5, 6, 5, 6, 5, 7, 6];
const DURATIONS = SCENE_SECONDS.map((s) => s * FPS);
const FADE_FRAMES = 10;

const VOICEOVER: Record<Locale, string[]> = {
  en: [
    "audio/vo-intro.mp3",
    "audio/vo-stat.mp3",
    "audio/vo-collections.mp3",
    "audio/vo-coverage.mp3",
    "audio/vo-cta.mp3",
    "audio/vo-guide.mp3",
    "audio/vo-cli.mp3",
  ],
  zh: [
    "audio/vo-intro-zh.mp3",
    "audio/vo-stat-zh.mp3",
    "audio/vo-collections-zh.mp3",
    "audio/vo-coverage-zh.mp3",
    "audio/vo-cta-zh.mp3",
    "audio/vo-guide-zh.mp3",
    "audio/vo-cli-zh.mp3",
  ],
};

// Voiceover delay per scene (seconds from scene start) - synced to animation rhythm
// Intro: logo scales in immediately, VO starts after logo settles
// Stat: container fades in first, then count-up starts ~frame 5
// Collections: title fades, tags spring in from ~frame 10
// Coverage: container fades, counts start ~frame 5-15
// CTA: URL scales in immediately
// Guide: title fades, cards slide up from ~frame 10
// CLI: window fades in, typing starts ~frame 10
const VO_DELAY = [0.4, 0.6, 0.3, 0.4, 0.3, 0.5, 0.4];

// Sound effects mapped to scenes: [sfx file, delay in seconds from scene start, volume]
type SfxEntry = [string, number, number];
const SCENE_SFX: (SfxEntry[] | null)[] = [
  // Intro - chime synced with logo scale-in
  [["audio/sfx-chime.mp3", 0.2, 0.35]],
  // Stat - chime when count-up begins
  [["audio/sfx-chime.mp3", 0.5, 0.3]],
  // Collections - pops synced with spring animation (6 frame stagger = 0.2s)
  [
    ["audio/sfx-pop.mp3", 0.5, 0.25],
    ["audio/sfx-pop.mp3", 0.7, 0.25],
    ["audio/sfx-pop.mp3", 0.9, 0.25],
    ["audio/sfx-pop.mp3", 1.1, 0.25],
    ["audio/sfx-pop.mp3", 1.3, 0.25],
  ],
  // Coverage - chime when numbers start counting
  [["audio/sfx-chime.mp3", 0.3, 0.25]],
  // CTA - success sound with URL appearance
  [["audio/sfx-success.mp3", 0.3, 0.35]],
  // Guide - chime as cards begin sliding up
  [["audio/sfx-chime.mp3", 0.6, 0.2]],
  // CLI - typing sound synced with typewriter animation (starts ~frame 10)
  [["audio/sfx-typing.mp3", 0.5, 0.2]],
];

// Whoosh transition sound at each scene boundary
const SCENE_TRANSITIONS = (() => {
  const transitions: number[] = [];
  let offset = 0;
  for (let i = 0; i < DURATIONS.length - 1; i++) {
    offset += DURATIONS[i];
    transitions.push(offset);
  }
  return transitions;
})();

const FadeWrapper: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
}> = ({ children, durationInFrames }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, FADE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - FADE_FRAMES, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {children}
    </AbsoluteFill>
  );
};

export const PromoMp4: React.FC<Props> = ({ locale }) => {
  let offset = 0;
  const scenes = [
    <IntroScene locale={locale} />,
    <StatScene locale={locale} />,
    <CollectionsScene locale={locale} />,
    <CoverageScene locale={locale} />,
    <CtaScene locale={locale} />,
    <GuideScene locale={locale} />,
    <CliScene locale={locale} />,
  ];

  const names = [
    "Intro",
    "Stat",
    "Collections",
    "Coverage",
    "CTA",
    "Guide",
    "CLI",
  ];

  const voFiles = VOICEOVER[locale];

  return (
    <>
      {/* Background music */}
      <Audio src={staticFile("audio/bgm.mp3")} volume={0.25} startFrom={0} />

      {/* Transition whoosh sounds */}
      {SCENE_TRANSITIONS.map((framePos, i) => (
        <Sequence
          key={`whoosh-${i}`}
          from={framePos - 5}
          durationInFrames={30}
          name={`Whoosh-${i}`}
        >
          <Audio src={staticFile("audio/sfx-whoosh.mp3")} volume={0.35} />
        </Sequence>
      ))}

      {/* Scenes with voiceover and SFX */}
      {scenes.map((scene, i) => {
        const from = offset;
        const duration = DURATIONS[i];
        offset += duration;
        const sfxList = SCENE_SFX[i];

        return (
          <React.Fragment key={names[i]}>
            {/* Visual scene */}
            <Sequence
              from={from}
              durationInFrames={duration}
              name={names[i]}
            >
              <FadeWrapper durationInFrames={duration}>{scene}</FadeWrapper>
            </Sequence>

            {/* Voiceover - timed to scene animation rhythm */}
            <Sequence
              from={from + Math.round(FPS * VO_DELAY[i])}
              durationInFrames={duration}
              name={`VO-${names[i]}`}
            >
              <Audio src={staticFile(voFiles[i])} volume={0.85} />
            </Sequence>

            {/* Sound effects */}
            {sfxList &&
              sfxList.map(([file, delay, vol], j) => (
                <Sequence
                  key={`sfx-${names[i]}-${j}`}
                  from={from + Math.round(FPS * delay)}
                  durationInFrames={Math.round(FPS * 3)}
                  name={`SFX-${names[i]}-${j}`}
                >
                  <Audio src={staticFile(file)} volume={vol} />
                </Sequence>
              ))}
          </React.Fragment>
        );
      })}
    </>
  );
};
