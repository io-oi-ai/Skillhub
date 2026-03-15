import React from "react";
import { Composition } from "remotion";
import { PromoGif } from "./compositions/PromoGif";
import { PromoMp4 } from "./compositions/PromoMp4";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="promo-gif-en"
        component={PromoGif}
        durationInFrames={300}
        fps={15}
        width={800}
        height={450}
        defaultProps={{ locale: "en" as const }}
      />
      <Composition
        id="promo-gif-zh"
        component={PromoGif}
        durationInFrames={300}
        fps={15}
        width={800}
        height={450}
        defaultProps={{ locale: "zh" as const }}
      />
      <Composition
        id="promo-mp4-en"
        component={PromoMp4}
        durationInFrames={1800}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ locale: "en" as const }}
      />
      <Composition
        id="promo-mp4-zh"
        component={PromoMp4}
        durationInFrames={1800}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ locale: "zh" as const }}
      />
    </>
  );
};
