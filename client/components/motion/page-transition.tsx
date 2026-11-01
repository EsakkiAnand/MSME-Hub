"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { pageVariants } from "@/lib/motion";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Provides a subtle, native-feeling page transition on route navigation.
 * Uses hardware-accelerated opacity and minimal y-offset to avoid layout shifts.
 */
export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
