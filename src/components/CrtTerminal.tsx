"use client";

import { useEffect, useRef, useState } from "react";
import s from "./CrtTerminal.module.css";

const SNIPPETS = [
  '$ skillhub skills list\n\nFound 36 skills\n\n  ID                  ROLES\n  brainstorming       everyone\n  prd-writing         product-manager\n  data-analyst        data-analyst\n  tiktok-marketing    marketer',
  '$ skillhub skills create \\\n  --name "My Skill"\n\n✓ Skill created successfully\n  ID: my-skill\n  Version: 1.0.0',
  '$ skillhub skills search \\\n  --role marketer\n\nFound 3 skills\n\n  tiktok-marketing    marketer\n  brand-voice         marketer\n  social-scheduler    marketer',
];

export default function CrtTerminal() {
  const typewriterRef = useRef<HTMLSpanElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const text = SNIPPETS[currentIndex] || "";
    const speed = 45;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    function typeWriter() {
      if (!typewriterRef.current) return;
      if (i < text.length) {
        typewriterRef.current.textContent = text.slice(0, i + 1);
        i++;
        timer = setTimeout(typeWriter, speed + Math.random() * 30);
      } else {
        timer = setTimeout(() => {
          if (typewriterRef.current) typewriterRef.current.textContent = "";
          setCurrentIndex((prev) => (prev + 1) % SNIPPETS.length);
        }, 2500);
      }
    }

    typeWriter();
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className={s.wrapper}>
      <div className={s.window}>
        <div className={s.windowHeader}>
          <span>terminal</span>
          <span>[x]</span>
        </div>
        <div className={s.typingContainer}>
          <span ref={typewriterRef} />
          <span className={s.cursor} />
        </div>
        <div className={s.snippetCounter}>
          {currentIndex + 1} / {SNIPPETS.length}
        </div>
      </div>
    </div>
  );
}
