"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { MOTION_EASE } from "@/lib/motion";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Provides a buttery smooth, native-feeling page transition on route navigation.
 * Uses hardware-accelerated opacity and minimal y-offset without blocking exit delays.
 * Fully respects prefers-reduced-motion for accessibility.
 */
export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: MOTION_EASE.ios,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
