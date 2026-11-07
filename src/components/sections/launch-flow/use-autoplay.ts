"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
const getPageVisible = () => document.visibilityState === "visible";
const getServerPageVisible = () => true;

type UseAutoplayOptions = {
  /** Number of steps. After the last one the player loops to the first. */
  count: number;
  /** Seconds each step stays on screen. */
  duration: number;
  /** Element that must be on screen for the player to run. */
  targetRef: RefObject<Element | null>;
};

type Autoplay = {
  active: number;
  /** 0 to 1 over the active step. Drives the progress bar and the diagram. */
  progress: MotionValue<number>;
  /** The visitor pressed pause. */
  paused: boolean;
  /** False when the visitor prefers reduced motion: steps change on click only. */
  autoplay: boolean;
  select: (index: number) => void;
  togglePaused: () => void;
};

/**
 * Drives an auto-advancing step player.
 *
 * One MotionValue (`progress`) runs from 0 to 1 per step. When it completes the
 * next step starts. The clock only runs while the player is on screen, the tab
 * is visible and the visitor has not paused it. Selecting a step starts it from
 * the beginning and resumes playback.
 */
export function useAutoplay({
  count,
  duration,
  targetRef,
}: UseAutoplayOptions): Autoplay {
  const reduceMotion = useReducedMotion() ?? false;
  const progress = useMotionValue(0);

  const [active, setActive] = useState(0);
  // Bumped on every selection so choosing the active step restarts it too.
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);

  const inView = useInView(targetRef, { amount: 0.3 });
  const pageVisible = useSyncExternalStore(
    subscribeToVisibility,
    getPageVisible,
    getServerPageVisible,
  );

  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const running = !reduceMotion && !paused && inView && pageVisible;

  // Start the clock for the active step.
  useEffect(() => {
    if (reduceMotion) {
      // No motion: show every diagram in its finished state.
      progress.set(1);
      controlsRef.current = null;
      return;
    }

    progress.set(0);
    let cancelled = false;
    const controls = animate(progress, 1, {
      duration,
      ease: "linear",
      onComplete: () => {
        if (!cancelled) setActive((current) => (current + 1) % count);
      },
    });
    controlsRef.current = controls;

    return () => {
      cancelled = true;
      controls.stop();
    };
  }, [active, cycle, count, duration, progress, reduceMotion]);

  // Play or pause that clock. Declared after the effect above so it runs
  // after a new step's clock has been created.
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (running) controls.play();
    else controls.pause();
  }, [running, active, cycle, reduceMotion]);

  const select = useCallback((index: number) => {
    setActive(index);
    setCycle((current) => current + 1);
    setPaused(false);
  }, []);

  const togglePaused = useCallback(() => setPaused((current) => !current), []);

  return {
    active,
    progress,
    paused,
    autoplay: !reduceMotion,
    select,
    togglePaused,
  };
}
