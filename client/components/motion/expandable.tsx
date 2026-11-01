"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { collapseVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ExpandableProps {
  expanded: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Expandable({ expanded, children, className }: ExpandableProps) {
  return (
    <AnimatePresence initial={false}>
      {expanded && (
        <motion.div
          key="content"
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
          variants={collapseVariants}
          className={cn("overflow-hidden", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
