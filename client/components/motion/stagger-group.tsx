"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface StaggerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function StaggerContainer({ children, className, ...props }: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={cn(className)} {...props}>{children}</div>;
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="show"
      className={cn(className)}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={cn(className)} {...props}>{children}</div>;
  }

  return (
    <motion.div
      variants={staggerItemVariants}
      className={cn(className)}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
