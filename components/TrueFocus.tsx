"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import "./TrueFocus.css";

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

// State maskin for animasjonsfaser
type AnimationPhase = "forward" | "backward" | "done";

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
  
  // State maskin for forward/backward/done-logikk
  const [phase, setPhase] = useState<AnimationPhase>("forward");
  
  // Styrer om den animerte fokus-effekten skal vises
  // Effekten unmountes når backward-fasen stopper (etter ~10-20% av backward)
  const [showEffect, setShowEffect] = useState(true);
  
  // Prosentandel av backward-fasen før effekten stopper (10-20% = 0.1-0.2)
  const backwardStopThreshold = 0.15; // Stopp etter 15% av backward-fasen
  
  // Beregner backwardProgress: 1.0 ved siste ord, 0.0 ved første ord
  const getBackwardProgress = (): number => {
    const lastIndex = words.length - 1;
    if (lastIndex === 0) return 1.0;
    // Progress: 1.0 ved siste ord (words.length - 1), 0.0 ved første ord (0)
    return currentIndex / lastIndex;
  };
  
  // Beregner opacity for fokus-effekten basert på fase og progress
  // Under backward-fasen interpolerer opacity fra 1 til 0 over første 15% av backward
  const getEffectOpacity = (): number => {
    if (phase === "forward") return 1; // Full synlighet under forward
    if (phase === "done") return 0; // Fullstendig usynlig når ferdig
    
    // Backward: interpoler opacity fra 1 til 0 over første 15% av backward-fasen
    if (phase === "backward") {
      const backwardProgress = getBackwardProgress();
      // Når backwardProgress går fra 1.0 til 0.85, fade opacity fra 1 til 0
      // Eksempel: backwardProgress = 1.0 → opacity = 1.0
      //           backwardProgress = 0.9 → opacity = 0.33
      //           backwardProgress = 0.85 → opacity = 0.0
      const fadeStart = 1.0; // Start fading ved siste ord
      const fadeEnd = 1.0 - backwardStopThreshold; // Stopp fading ved 85% (15% progress)
      
      if (backwardProgress >= fadeEnd) {
        // Interpoler opacity: 1.0 ved fadeStart, 0.0 ved fadeEnd
        const fadeProgress = (backwardProgress - fadeEnd) / (fadeStart - fadeEnd);
        return 1.0 - fadeProgress;
      }
      // Hvis vi har gått forbi fadeEnd, opacity er allerede 0
      return 0;
    }
    
    return 1;
  };

  // Håndterer forward/backward/done-logikk med automatisk animasjon
  useEffect(() => {
    // Manual mode eller done phase: ingen automatisk animasjon
    if (manualMode || phase === "done") return;

    const timeoutId = setTimeout(() => {
      if (phase === "forward") {
        // Forward: gå fra første til siste ord
        setCurrentIndex(prev => {
          if (prev === words.length - 1) {
            // Ferdig med forward, start backward
            setPhase("backward");
            return prev;
          }
          return prev + 1;
        });
      } else if (phase === "backward") {
        // Backward: starter fra siste ord, men stopper etter ca. 10-20% av distansen
        // Fokus-effekten fader ut gradvis mens den går delvis tilbake, så totalt ca. 1.15 runs
        setCurrentIndex(prev => {
          const lastIndex = words.length - 1;
          if (lastIndex === 0) {
            // Kun ett ord, stopp umiddelbart
            setPhase("done");
            setShowEffect(false);
            return prev;
          }
          
          // Beregn backwardProgress: 1.0 ved siste ord, 0.0 ved første ord
          const backwardProgress = prev / lastIndex;
          
          // Stopp når backwardProgress når stopp-threshold (ca. 85% = 15% tilbake)
          if (backwardProgress <= 1.0 - backwardStopThreshold) {
            // Effekten har nådd stopp-punktet, stopp animasjonen
            // Teksten forblir synlig og skarp, kun fokus-effekten er borte
            setPhase("done");
            setShowEffect(false);
            return prev;
          }
          
          // Fortsett å gå tilbake
          return prev - 1;
        });
      }
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    // Cleanup: rydder opp timeout hvis komponenten unmountes eller phase endres
    return () => clearTimeout(timeoutId);
  }, [currentIndex, phase, manualMode, animationDuration, pauseBetweenAnimations, words.length]);


  // Oppdaterer focus-rectangel når currentIndex endres
  useEffect(() => {
    // Ikke oppdater focus-rect når phase er "done" - effekten skal ikke flytte seg
    if (currentIndex === null || currentIndex === -1 || phase === "done") return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;
    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();
    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    });
  }, [currentIndex, words.length, phase]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };
  const handleMouseLeave = () => {
    if (manualMode) setCurrentIndex(lastActiveIndex ?? 0);
  };

  // Teksten forblir alltid synlig. Når phase er "done", er all tekst skarp
  // og kun den animerte fokus-effekten skjules.
  return (
    <div
      className={`focus-container ${className}`}
      ref={containerRef}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        // Når TrueFocus animasjonen er ferdig, render alle bokstaver skarpe (ingen blur)
        const isDone = phase === "done" || !showEffect;
        
        // Style-logikk: når animasjonen er ferdig, all tekst er skarp, ellers bruk aktiv/blur-logikk
        const style = isDone
          ? {
              // Når animasjonen er ferdig, all tekst er 100% skarp (ingen blur, full opacity)
              filter: "blur(0px)",
              opacity: 1,
              ["--border-color" as any]: borderColor,
              ["--glow-color" as any]: glowColor,
              transition: `filter ${animationDuration}s ease`,
            }
          : {
              // Under animasjonen: aktiv ord er skarp, andre er blurred
              filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
              opacity: 1,
              ["--border-color" as any]: borderColor,
              ["--glow-color" as any]: glowColor,
              transition: `filter ${animationDuration}s ease`,
            };
        
        return (
          <span
            key={index}
            ref={el => (wordRefs.current[index] = el)}
            className={`focus-word ${manualMode ? "manual" : ""} ${isActive && !manualMode ? "active" : ""}`}
            style={style}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}
      {/* Fokus-effekten fader ut gradvis under backward-fasen over første 10-20%
          Teksten forblir alltid synlig og skarp, kun effekten fader ut og stopper */}
      {showEffect && (
        <motion.div
          className="focus-frame"
          animate={{ 
            x: focusRect.x, 
            y: focusRect.y, 
            width: focusRect.width, 
            height: focusRect.height, 
            // Opacity interpoleres basert på fase: full synlighet i forward,
            // gradvis fade-out under backward (1 → 0), usynlig når done
            opacity: getEffectOpacity()
          }}
          transition={{ 
            // Bruk samme duration for opacity som for posisjon for jevn animasjon
            opacity: { duration: animationDuration, ease: "easeInOut" },
            x: { duration: animationDuration },
            y: { duration: animationDuration },
            width: { duration: animationDuration },
            height: { duration: animationDuration }
          }}
          style={{ ["--border-color" as any]: borderColor, ["--glow-color" as any]: glowColor }}
        >
          <span className="corner top-left"></span>
          <span className="corner top-right"></span>
          <span className="corner bottom-left"></span>
          <span className="corner bottom-right"></span>
        </motion.div>
      )}
    </div>
  );
}

