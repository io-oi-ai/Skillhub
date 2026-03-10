import React from "react";
import { Sequence } from "remotion";
import { Locale } from "../i18n/texts";
import { IntroScene } from "../scenes/IntroScene";
import { StatScene } from "../scenes/StatScene";
import { CollectionsScene } from "../scenes/CollectionsScene";
import { CoverageScene } from "../scenes/CoverageScene";
import { CtaScene } from "../scenes/CtaScene";

interface Props {
  locale: Locale;
}

const SCENE_FRAMES = 60; // 4s at 15fps

export const PromoGif: React.FC<Props> = ({ locale }) => {
  return (
    <>
      <Sequence from={0} durationInFrames={SCENE_FRAMES} name="Intro">
        <IntroScene locale={locale} />
      </Sequence>
      <Sequence from={SCENE_FRAMES} durationInFrames={SCENE_FRAMES} name="Stat">
        <StatScene locale={locale} />
      </Sequence>
      <Sequence
        from={SCENE_FRAMES * 2}
        durationInFrames={SCENE_FRAMES}
        name="Collections"
      >
        <CollectionsScene locale={locale} />
      </Sequence>
      <Sequence
        from={SCENE_FRAMES * 3}
        durationInFrames={SCENE_FRAMES}
        name="Coverage"
      >
        <CoverageScene locale={locale} />
      </Sequence>
      <Sequence
        from={SCENE_FRAMES * 4}
        durationInFrames={SCENE_FRAMES}
        name="CTA"
      >
        <CtaScene locale={locale} />
      </Sequence>
    </>
  );
};
