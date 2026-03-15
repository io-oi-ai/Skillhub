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
import { HookScene } from "../scenes/HookScene";
import { IntroScene } from "../scenes/IntroScene";
import { ProblemScene } from "../scenes/ProblemScene";
import { SolutionScene } from "../scenes/SolutionScene";
import { CollectionsScene } from "../scenes/CollectionsScene";
import { CoverageScene } from "../scenes/CoverageScene";
import { CliScene } from "../scenes/CliScene";
import { CtaScene } from "../scenes/CtaScene";
import { OutroScene } from "../scenes/OutroScene";

interface Props {
  locale: Locale;
}

const FPS = 30;
// Scene durations in seconds: [4, 5, 8, 8, 7, 7, 9, 7, 5] = 60s
const SCENE_SECONDS = [4, 5, 8, 8, 7, 7, 9, 7, 5];
const DURATIONS = SCENE_SECONDS.map((s) => s * FPS);
const FADE_FRAMES = 8;

const VOICEOVER: Record<Locale, string[]> = {
  en: [
    "audio/vo-hook.mp3",
    "audio/vo-intro.mp3",
    "audio/vo-problem.mp3",
    "audio/vo-solution.mp3",
    "audio/vo-collections.mp3",
    "audio/vo-coverage.mp3",
    "audio/vo-cli.mp3",
    "audio/vo-cta.mp3",
    "audio/vo-outro.mp3",
  ],
  zh: [
    "audio/vo-hook-zh.mp3",
    "audio/vo-intro-zh.mp3",
    "audio/vo-problem-zh.mp3",
    "audio/vo-solution-zh.mp3",
    "audio/vo-collections-zh.mp3",
    "audio/vo-coverage-zh.mp3",
    "audio/vo-cli-zh.mp3",
    "audio/vo-cta-zh.mp3",
    "audio/vo-outro-zh.mp3",
  ],
};

// VO delay per scene (seconds) - synced to animation rhythm
const VO_DELAY = [0.2, 0.3, 0.5, 0.5, 0.4, 0.3, 0.4, 0.3, 0.3];

// Sound effects: [sfx file, delay in seconds from scene start, volume]
type SfxEntry = [string, number, number];
const SCENE_SFX: (SfxEntry[] | null)[] = [
  // Hook - no sfx, let the voice carry
  null,
  // Intro - chime with logo
  [["audio/sfx-chime.mp3", 0.2, 0.3]],
  // Problem - no sfx, serious tone
  null,
  // Solution - chime when logo appears
  [["audio/sfx-chime.mp3", 0.3, 0.25]],
  // Collections - pops for each tag
  [
    ["audio/sfx-pop.mp3", 0.6, 0.2],
    ["audio/sfx-pop.mp3", 0.8, 0.2],
    ["audio/sfx-pop.mp3", 1.0, 0.2],
    ["audio/sfx-pop.mp3", 1.2, 0.2],
    ["audio/sfx-pop.mp3", 1.4, 0.2],
  ],
  // Coverage - chime
  [["audio/sfx-chime.mp3", 0.4, 0.2]],
  // CLI - typing sound
  [["audio/sfx-typing.mp3", 0.5, 0.2]],
  // CTA - success sound
  [["audio/sfx-success.mp3", 0.3, 0.3]],
  // Outro - chime
  [["audio/sfx-chime.mp3", 0.2, 0.25]],
];

// Whoosh at scene transitions
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
    <HookScene locale={locale} />,
    <IntroScene locale={locale} />,
    <ProblemScene locale={locale} />,
    <SolutionScene locale={locale} />,
    <CollectionsScene locale={locale} />,
    <CoverageScene locale={locale} />,
    <CliScene locale={locale} />,
    <CtaScene locale={locale} />,
    <OutroScene locale={locale} />,
  ];

  const names = [
    "Hook",
    "Intro",
    "Problem",
    "Solution",
    "Collections",
    "Coverage",
    "CLI",
    "CTA",
    "Outro",
  ];

  const voFiles = VOICEOVER[locale];

  return (
    <>
      {/* Background music */}
      <Audio src={staticFile("audio/bgm.mp3")} volume={0.2} startFrom={0} />

      {/* Transition whoosh sounds */}
      {SCENE_TRANSITIONS.map((framePos, i) => (
        <Sequence
          key={`whoosh-${i}`}
          from={framePos - 4}
          durationInFrames={24}
          name={`Whoosh-${i}`}
        >
          <Audio src={staticFile("audio/sfx-whoosh.mp3")} volume={0.3} />
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
            <Sequence
              from={from}
              durationInFrames={duration}
              name={names[i]}
            >
              <FadeWrapper durationInFrames={duration}>{scene}</FadeWrapper>
            </Sequence>

            <Sequence
              from={from + Math.round(FPS * VO_DELAY[i])}
              durationInFrames={duration}
              name={`VO-${names[i]}`}
            >
              <Audio src={staticFile(voFiles[i])} volume={0.85} />
            </Sequence>

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
