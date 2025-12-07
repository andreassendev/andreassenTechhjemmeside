"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./TrueFocus.css";

/**
 * Animation phases for TrueFocus effect:
 * - "forward": Effect moves from first word (Andreassen) to last word (Technology)
 * - "holdOnTechnology": Brief pause/hold on the last word
 * - "backward": Effect moves back while fading out (opacity 1 → 0)
 * - "done": Animation complete, effect removed, only clean text remains
 *
 * Note: The text itself is ALWAYS visible. Only the blur/glow/frame effect fades out.
 */
type AnimationPhase = "forward" | "holdOnTechnology" | "backward" | "done";

type Props = {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  maxCycles?: number;
  className?: string;
};

export default function TrueFocus({
  sentence = "Andreassen Technology",
  manualMode = false,
  blurAmount = 5,
  borderColor = "#cfa2a0",
  glowColor = "rgba(207,162,160,0.6)",
  animationDuration = 0.6,
  pauseBetweenAnimations = 0.8,
  maxCycles,
  className = ""
}: Props) {
  const words = sentence.split(" ");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Phase-based animation state
  const [phase, setPhase] = useState<AnimationPhase>("forward");

  // Opacity for the effect layer (frame + blur) - fades out during "backward" phase
  const [effectOpacity, setEffectOpacity] = useState(1);

  // Calculate the interval duration in ms
  const intervalMs = (animationDuration + pauseBetweenAnimations) * 1000;

  // Duration for the backward fade-out animation (in seconds)
  const fadeOutDuration = 0.6;

  /**
   * Main animation logic using a phase-based state machine.
   * Text is always visible - only the effect (blur/glow/frame) animates and fades out.
   */
  useEffect(() => {
    if (manualMode || phase === "done") return;

    let timeoutId: ReturnType<typeof setTimeout>;

    if (phase === "forward") {
      // Forward phase: move from first word to last word
      timeoutId = setTimeout(() => {
        if (currentIndex < words.length - 1) {
          // Move to next word
          setCurrentIndex(prev => prev + 1);
        } else {
          // Reached the last word (Technology) - transition to hold phase
          setPhase("holdOnTechnology");
        }
      }, intervalMs);
    } else if (phase === "holdOnTechnology") {
      // Hold phase: stay on Technology for one extra interval, then start backward
      timeoutId = setTimeout(() => {
        setPhase("backward");
        // Start fading out the effect as we begin moving backward
        setEffectOpacity(0);
      }, intervalMs);
    } else if (phase === "backward") {
      // Backward phase: move back while the effect fades out
      // The fade-out happens via CSS transition on effectOpacity
      timeoutId = setTimeout(() => {
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
      }, intervalMs * 0.5); // Move faster during backward phase

      // After the fade-out duration completes, mark as done
      const fadeTimeoutId = setTimeout(() => {
        setPhase("done");
      }, fadeOutDuration * 1000 + intervalMs);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(fadeTimeoutId);
      };
    }

    return () => clearTimeout(timeoutId);
  }, [manualMode, phase, currentIndex, words.length, intervalMs, fadeOutDuration]);

  // Update focus rectangle position when currentIndex changes
  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();
    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length]);

  // Manual mode handlers (unchanged from original)
  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };
  const handleMouseLeave = () => {
    if (manualMode) setCurrentIndex(lastActiveIndex ?? 0);
  };

  // Check if animation is complete (effect should be hidden)
  const isEffectVisible = phase !== "done";

  /**
   * Calculate blur for each word:
   * - When phase is "done", all words are sharp (no blur)
   * - Active word is always sharp
   * - During backward phase, blur reduces proportionally with effectOpacity
   */
  const getWordBlur = (index: number, isActive: boolean): string => {
    if (phase === "done") return "blur(0px)";
    if (isActive) return "blur(0px)";
    // During backward phase, reduce blur as effect fades out
    if (phase === "backward") {
      return `blur(${blurAmount * effectOpacity}px)`;
    }
    return `blur(${blurAmount}px)`;
  };

  return (
    <div className={`focus-container ${className}`} ref={containerRef}>
      {/* Text layer - ALWAYS visible, blur effect fades out with effectOpacity */}
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={el => (wordRefs.current[index] = el)}
            className={`focus-word ${manualMode ? "manual" : ""} ${isActive && !manualMode ? "active" : ""}`}
            style={{
              filter: getWordBlur(index, isActive),
              ["--border-color" as any]: borderColor,
              ["--glow-color" as any]: glowColor,
              transition: `filter ${animationDuration}s ease`,
              // Ensure text is always fully opaque
              opacity: 1,
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      {/* Effect layer (frame with corners) - fades out during backward phase */}
      <AnimatePresence>
        {isEffectVisible && (
          <motion.div
            className="focus-frame"
            initial={{ opacity: 1 }}
            animate={{
              x: focusRect.x,
              y: focusRect.y,
              width: focusRect.width,
              height: focusRect.height,
              opacity: effectOpacity,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: animationDuration,
              opacity: { duration: fadeOutDuration, ease: "easeOut" },
            }}
            style={{
              ["--border-color" as any]: borderColor,
              ["--glow-color" as any]: glowColor,
            }}
          >
            <span className="corner top-left"></span>
            <span className="corner top-right"></span>
            <span className="corner bottom-left"></span>
            <span className="corner bottom-right"></span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
