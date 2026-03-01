"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./RetroComputer.module.css";

interface RetroComputerProps {
  snippets: string[];
}

export default function RetroComputer({ snippets }: RetroComputerProps) {
  const typewriterRef = useRef<HTMLSpanElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const text = snippets[currentIndex] || "";
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
        // Pause, then move to next snippet
        timer = setTimeout(() => {
          if (typewriterRef.current) typewriterRef.current.textContent = "";
          setCurrentIndex((prev) => (prev + 1) % snippets.length);
        }, 2500);
      }
    }

    typeWriter();
    return () => clearTimeout(timer);
  }, [currentIndex, snippets]);

  return (
    <div className={styles.sceneWrapper}>
      <div className={styles.scene}>
        <div className={styles.computerUnit}>
          {/* Front face */}
          <div className={`${styles.face} ${styles.front}`}>
            <div className={styles.screenInset}>
              <div className={styles.crt}>
                <div className={styles.crtGlow}>
                  <div className={styles.crtUi}>
                    <div className={styles.sidebar}>
                      <div className={styles.iconList}>
                        <div>
                          <span className={`${styles.iconCircle} ${styles.blue}`} />
                          Skills
                        </div>
                        <div>
                          <span className={`${styles.iconCircle} ${styles.orange}`} />
                          Agents
                        </div>
                        <div>
                          <span className={styles.iconCircle} />
                          Roles
                        </div>
                        <div>
                          <span className={styles.iconCircle} />
                          Scenes
                        </div>
                        <div>
                          <span className={styles.iconCircle} />
                          Search
                        </div>
                      </div>
                    </div>
                    <div className={styles.mainArea}>
                      <div className={styles.osLabel}>SkillOS 1.0</div>
                      <div className={styles.window}>
                        <div className={styles.windowHeader}>
                          <span>skill.md</span>
                          <span>[x]</span>
                        </div>
                        <div className={styles.typingContainer}>
                          <span ref={typewriterRef} />
                          <span className={styles.cursor} />
                        </div>
                      </div>
                      <div className={styles.snippetCounter}>
                        {currentIndex + 1} / {snippets.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.logoBadge} />
            <div className={styles.floppySlot} />

            <div className={`${styles.sticker} ${styles.stickerBall}`} />
            <div className={`${styles.sticker} ${styles.stickerStar}`}>&#9733;</div>
            <div className={`${styles.sticker} ${styles.stickerText}`}>
              MACHINE
              <br />
              INTELLIGENCE
            </div>

            <div className={styles.grill}>
              <div className={styles.vent} />
              <div className={styles.vent} />
              <div className={styles.vent} />
              <div className={styles.vent} />
              <div className={styles.vent} />
              <div className={styles.vent} />
              <div className={styles.vent} />
              <div className={styles.vent} />
            </div>
          </div>

          <div className={`${styles.face} ${styles.back}`} />
          <div className={`${styles.face} ${styles.sideLeft}`} />
          <div className={`${styles.face} ${styles.sideRight}`} />
          <div className={`${styles.face} ${styles.faceTop}`} />
          <div className={`${styles.face} ${styles.faceBottom}`} />

          {/* Keyboard */}
          <div className={styles.keyboardAssembly}>
            <div className={styles.kbBase}>
              <div className={styles.keysGrid}>
                {/* Row 1 */}
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                {/* Row 2 */}
                <div className={`${styles.key} ${styles.keyWide}`} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={`${styles.key} ${styles.keyWide}`} />
                {/* Row 3 */}
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={`${styles.key} ${styles.keySpace}`} />
                <div className={styles.key} />
                <div className={styles.key} />
                <div className={styles.key} />
              </div>
            </div>
            <div className={styles.kbFront} />
            <div className={styles.kbBack} />
            <div className={styles.kbLeft} />
            <div className={styles.kbRight} />
            <div className={styles.kbShadow} />
          </div>
        </div>
      </div>
    </div>
  );
}
