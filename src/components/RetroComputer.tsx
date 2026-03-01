"use client";

import { useEffect, useRef } from "react";
import styles from "./RetroComputer.module.css";

export default function RetroComputer() {
  const typewriterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const text =
      "Good morning. Your skills are loaded, your workflows are sorted, and your agents are set. Ready when you are.";
    const speed = 100;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    function typeWriter() {
      if (!typewriterRef.current) return;
      if (i < text.length) {
        typewriterRef.current.textContent += text.charAt(i);
        i++;
        timer = setTimeout(typeWriter, speed + Math.random() * 50);
      } else {
        timer = setTimeout(() => {
          if (typewriterRef.current) typewriterRef.current.textContent = "";
          i = 0;
          typeWriter();
        }, 3000);
      }
    }

    typeWriter();
    return () => clearTimeout(timer);
  }, []);

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
                          System
                        </div>
                        <div>
                          <span className={`${styles.iconCircle} ${styles.orange}`} />
                          Disk A
                        </div>
                        <div>
                          <span className={styles.iconCircle} />
                          Trash
                        </div>
                        <div>
                          <span className={styles.iconCircle} />
                          Write
                        </div>
                        <div>
                          <span className={styles.iconCircle} />
                          Think
                        </div>
                      </div>
                    </div>
                    <div className={styles.mainArea}>
                      <div className={styles.osLabel}>SkillOS 1.0</div>
                      <div className={styles.window}>
                        <div className={styles.windowHeader}>
                          <span>Untitled.txt</span>
                          <span>[x]</span>
                        </div>
                        <div className={styles.typingContainer}>
                          <span ref={typewriterRef} />
                          <span className={styles.cursor} />
                        </div>
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
