import { m, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollRevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  delay?: number;
  y?: number;
  children: ReactNode;
}

/**
 * Standard fade + rise reveal used throughout the site. Centralising it
 * keeps the timing/easing consistent (slow, intentional — per the brief)
 * without repeating the same initial/whileInView object everywhere, and
 * automatically no-ops the motion for prefers-reduced-motion users.
 */
export default function ScrollReveal({ delay = 0, y = 24, children, ...rest }: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={rest.className}>{children}</div>;
  }

  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </m.div>
  );
}
