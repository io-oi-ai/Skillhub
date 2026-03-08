"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

interface SkillContentProps {
  content: string;
  locale: string;
}

export default function SkillContent({ content, locale }: SkillContentProps) {
  const initialLanguage: "zh" | "en" = locale.startsWith("zh") ? "zh" : "en";
  const [selectedLanguage, setSelectedLanguage] = useState<"zh" | "en">(initialLanguage);

  const parsed = useMemo(() => {
    const lines = content.split("\n");
    const markerIndex = lines.findIndex((line) =>
      /^#{1,2}\s*中文版\s*$/.test(line.trim()),
    );

    if (markerIndex === -1) {
      return {
        hasTranslation: false,
        english: content.trim(),
        chinese: "",
      };
    }

    return {
      hasTranslation: true,
      english: lines.slice(0, markerIndex).join("\n").trim(),
      chinese: lines.slice(markerIndex + 1).join("\n").trim(),
    };
  }, [content]);

  const display = selectedLanguage === "zh" ? parsed.chinese : parsed.english;

  return (
    <div className="prose-dark">
      {parsed.hasTranslation && (
        <div className="mb-6 not-prose flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setSelectedLanguage("zh")}
            aria-pressed={selectedLanguage === "zh"}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              selectedLanguage === "zh"
                ? "bg-accent text-white"
                : "border border-border bg-bg-card text-text-secondary hover:bg-bg-primary"
            }`}
          >
            中文
          </button>
          <button
            type="button"
            onClick={() => setSelectedLanguage("en")}
            aria-pressed={selectedLanguage === "en"}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              selectedLanguage === "en"
                ? "bg-accent text-white"
                : "border border-border bg-bg-card text-text-secondary hover:bg-bg-primary"
            }`}
          >
            English
          </button>
        </div>
      )}
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {display}
      </ReactMarkdown>
    </div>
  );
}
