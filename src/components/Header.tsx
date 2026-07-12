import { useLayoutEffect, useRef, useState } from "react";
import logo from "../images/logo-transparent.png";

type Phase = "start" | "center" | "moving" | "done";

interface Flight {
  top: number;
  left: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  scale: number;
}

interface HeaderProps {
  /** Plays the splash entrance sequence (center -> dock) once on mount. */
  animateIntro?: boolean;
  /** Called once the logo has settled into its final header position. */
  onSettled?: () => void;
}

export default function Header({ animateIntro = false, onSettled }: HeaderProps) {
  const [phase, setPhase] = useState<Phase>(animateIntro ? "start" : "done");
  const [flight, setFlight] = useState<Flight | null>(null);
  const dockedLogoRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (!animateIntro) return;
    const el = dockedLogoRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;
    const bigWidth = Math.min(200, window.innerWidth * 0.5);
    const scale = bigWidth / rect.width;

    setFlight({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      dx: window.innerWidth / 2 - targetCenterX,
      dy: window.innerHeight / 2 - targetCenterY,
      scale,
    });

    const raf = requestAnimationFrame(() => setPhase("center"));
    const toMoving = setTimeout(() => setPhase("moving"), 850);
    const toDone = setTimeout(() => {
      setPhase("done");
      onSettled?.();
    }, 850 + 700);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(toMoving);
      clearTimeout(toDone);
    };
  }, [animateIntro, onSettled]);

  const introActive = animateIntro && phase !== "done";
  const docked = !animateIntro || phase === "moving" || phase === "done";

  return (
    <header
      className={`relative flex w-full items-center justify-center py-5 transition-colors duration-700 ${
        docked ? "bg-sage" : "bg-transparent"
      }`}
    >
      <img
        ref={dockedLogoRef}
        src={logo}
        alt="Donna Fit Low Carb"
        className={`h-16 w-auto transition-opacity duration-150 ${
          introActive ? "opacity-0" : "opacity-100"
        }`}
      />

      {introActive && flight && (
        <div
          className="fixed z-50"
          style={{
            top: flight.top,
            left: flight.left,
            width: flight.width,
            height: flight.height,
            transform:
              phase === "moving"
                ? "translate(0, 0) scale(1)"
                : `translate(${flight.dx}px, ${flight.dy}px) scale(${flight.scale})`,
            transition:
              phase === "moving"
                ? "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)"
                : undefined,
          }}
        >
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className={`h-full w-full object-contain ${
              phase === "center" || phase === "moving"
                ? "animate-splash-in"
                : "opacity-0"
            }`}
          />
        </div>
      )}
    </header>
  );
}
