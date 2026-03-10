import { loadFont as loadNotoSerif } from "@remotion/google-fonts/NotoSerif";
import { loadFont as loadNotoSerifSC } from "@remotion/google-fonts/NotoSerifSC";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: notoSerif } = loadNotoSerif("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});
export const { fontFamily: notoSerifSC } = loadNotoSerifSC("normal", {
  weights: ["400", "700"],
  ignoreTooManyRequestsWarning: true,
});
export const { fontFamily: jetBrainsMono } = loadJetBrainsMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

export const fontSerif = `${notoSerif}, Georgia, serif`;
export const fontSerifCn = `${notoSerifSC}, ${notoSerif}, Georgia, serif`;
export const fontMono = `${jetBrainsMono}, monospace`;
