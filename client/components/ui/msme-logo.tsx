"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface MsmeLogoProps {
  /** Size in pixels for width/height. Default: 32 */
  size?: number;
  variant?: "full" | "emblem";
  className?: string;
}

/**
 * FXEC MSME Hub — Official Identity Logo Mark
 * Renders the new orange growth bars emblem and MSME logotype.
 */
export function MsmeLogoMark({
  size = 32,
  variant = "full",
  className,
}: MsmeLogoProps) {
  const src = variant === "emblem" ? "/msme-emblem.png" : "/msme-logo.png";
  return (
    <div
      className={cn(
        "relative shrink-0 inline-flex items-center justify-center select-none",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt="MSME Hub"
        width={size * 2}
        height={size * 2}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}

/**
 * Full MSME Identity Logo (Emblem + "MSME" bold text)
 * For prominent card headers, authentication pages, and hero banners.
 */
export function MsmeFullLogo({
  width = 120,
  className,
  priority = true,
}: {
  width?: number;
  className?: string;
  priority?: boolean;
}) {
  const height = Math.round(width * (649 / 678));
  return (
    <div className={cn("relative inline-flex items-center justify-center select-none", className)}>
      <Image
        src="/msme-logo.png"
        alt="MSME Hub Logo"
        width={width * 2}
        height={height * 2}
        style={{ width: `${width}px`, height: "auto" }}
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}

/**
 * Full wordmark: new MSME Logo + FXEC MSME Hub institutional branding
 */
export function MsmeWordmark({
  size = 36,
  className,
}: MsmeLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <MsmeLogoMark size={size} variant="full" />
      <div className="flex flex-col leading-none">
        <span
          className="font-bold tracking-tight text-foreground"
          style={{ fontSize: size * 0.44 }}
        >
          FXEC MSME Hub
        </span>
        <span
          className="font-medium text-muted-foreground"
          style={{ fontSize: size * 0.26, marginTop: size * 0.05 }}
        >
          Academic Project Portal
        </span>
      </div>
    </div>
  );
}
