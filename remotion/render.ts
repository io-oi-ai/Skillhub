import path from "path";
import { bundle } from "@remotion/bundler";
import { renderMedia, getCompositions } from "@remotion/renderer";

const COMPOSITIONS = [
  { id: "promo-gif-en", codec: "gif" as const, ext: "gif" },
  { id: "promo-gif-zh", codec: "gif" as const, ext: "gif" },
  { id: "promo-mp4-en", codec: "h264" as const, ext: "mp4" },
  { id: "promo-mp4-zh", codec: "h264" as const, ext: "mp4" },
];

async function main() {
  const entryPoint = path.resolve(__dirname, "src/index.ts");
  const outputDir = path.resolve(__dirname, "..", "out");

  console.log("Bundling...");
  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  const compositions = await getCompositions(bundleLocation);

  // If a specific composition ID is passed as CLI arg, only render that one
  const targetId = process.argv[2];
  const toRender = targetId
    ? COMPOSITIONS.filter((c) => c.id === targetId)
    : COMPOSITIONS;

  for (const { id, codec, ext } of toRender) {
    const composition = compositions.find((c) => c.id === id);
    if (!composition) {
      console.error(`Composition "${id}" not found, skipping...`);
      continue;
    }

    const outputLocation = path.join(outputDir, `${id}.${ext}`);
    console.log(`\nRendering ${id} → ${outputLocation}`);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec,
      outputLocation,
      onProgress: ({ progress }) => {
        process.stdout.write(`\r  Progress: ${(progress * 100).toFixed(1)}%`);
      },
    });

    console.log(`\n  ✓ Done: ${outputLocation}`);
  }

  console.log("\n✅ All renders complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
