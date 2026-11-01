"use client";

import type { Variants, Transition } from "motion/react";

/**
 * Standardized Apple iOS Easing Curves & Timing
 */
export const MOTION_EASE = {
  // Apple iOS standard deceleration curve: fast start, buttery smooth settle
  ios: [0.16, 1, 0.3, 1] as const,
  // Standard ease-out for quick exits
  easeOut: [0, 0, 0.2, 1] as const,
  // Snappy spring for tactile interactive elements (buttons, toggles, icons)
  springSnappy: { type: "spring", stiffness: 450, damping: 30 } as Transition,
  // Gentle spring for modals, drawers, and popovers
  springGentle: { type: "spring", stiffness: 320, damping: 28 } as Transition,
  // Smooth spring for page transitions and tab indicators
  springSmooth: { type: "spring", stiffness: 280, damping: 26 } as Transition,
};

export const MOTION_DURATION = {
  instant: 0.1,
  fast: 0.18,
  normal: 0.26,
  medium: 0.36,
  slow: 0.48,
};

/**
 * Page Route Transitions
 * Minimal movement (y: 6) and quick opacity to feel instantaneous yet polished.
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 6,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.fast,
      ease: MOTION_EASE.ios,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.12,
      ease: MOTION_EASE.easeOut,
    },
  },
};

/**
 * Staggered Container for Dashboard KPI Cards & Lists
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

/**
 * Staggered Child Item (KPI Cards, Project Cards, Table Rows)
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.normal,
      ease: MOTION_EASE.ios,
    },
  },
};

/**
 * Card Interactive Hover & Press Variants
 */
export const cardHoverVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
  },
  hover: {
    y: -2,
    transition: {
      duration: MOTION_DURATION.fast,
      ease: MOTION_EASE.ios,
    },
  },
  tap: {
    scale: 0.99,
    y: 0,
    transition: {
      duration: MOTION_DURATION.instant,
      ease: MOTION_EASE.ios,
    },
  },
};

/**
 * Mobile Sidebar Drawer & Backdrop Variants
 */
export const sidebarBackdropVariants: Variants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.15, ease: MOTION_EASE.easeOut },
  },
  open: {
    opacity: 1,
    transition: { duration: 0.2, ease: MOTION_EASE.ios },
  },
};

export const sidebarDrawerVariants: Variants = {
  closed: {
    x: "-100%",
    transition: { duration: 0.22, ease: MOTION_EASE.easeOut },
  },
  open: {
    x: 0,
    transition: { duration: 0.28, ease: MOTION_EASE.ios },
  },
};

/**
 * Expandable Accordion / Collapsible Sections
 */
export const collapseVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    transition: {
      height: { duration: MOTION_DURATION.fast, ease: MOTION_EASE.ios },
      opacity: { duration: 0.12 },
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    overflow: "hidden",
    transition: {
      height: { duration: MOTION_DURATION.normal, ease: MOTION_EASE.ios },
      opacity: { duration: 0.2, delay: 0.04 },
    },
  },
};

/**
 * Modal & Confirmation Dialog Variants
 */
export const dialogBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.18, ease: MOTION_EASE.ios },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.14, ease: MOTION_EASE.easeOut },
  },
};

export const dialogModalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 4,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: MOTION_EASE.ios,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 2,
    transition: {
      duration: 0.14,
      ease: MOTION_EASE.easeOut,
    },
  },
};
