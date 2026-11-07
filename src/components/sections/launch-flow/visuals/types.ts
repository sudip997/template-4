import type { MotionValue } from "motion/react";

/**
 * Every step diagram is a pure function of one number: `progress`, running
 * from 0 to 1 over the step's duration. Pausing freezes the diagram, and
 * restarting a step replays it from the beginning.
 */
export type VisualProps = {
  progress: MotionValue<number>;
};
