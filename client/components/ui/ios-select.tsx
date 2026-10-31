"use client";

import * as React from "react";
import { Check, ChevronsUpDown, ChevronDown } from "lucide-react";

export interface IOSSelectOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface IOSSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (IOSSelectOption | string)[];
  placeholder?: string;
  headerLabel?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  size?: "sm" | "default";
  id?: string;
}

export function IOSSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  headerLabel,
  error = false,
  disabled = false,
  className = "",
  triggerClassName = "",
  menuClassName = "",
  size = "default",
  id,
}: IOSSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [openUpward, setOpenUpward] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Normalize options into IOSSelectOption format
  const normalizedOptions: IOSSelectOption[] = React.useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Detect available space to open upward or downward
  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 280 && spaceAbove > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < normalizedOptions.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : normalizedOptions.length - 1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        const target = normalizedOptions[activeIndex];
        if (target && !target.disabled) {
          onChange(target.value);
          setIsOpen(false);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, normalizedOptions, onChange]);

  // Scroll active item into view
  React.useEffect(() => {
    if (isOpen && activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex, isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const isSmall = size === "sm";

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full text-left ${className}`}
      id={id}
    >
      {/* iOS Style Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            const idx = normalizedOptions.findIndex((o) => o.value === value);
            setActiveIndex(idx >= 0 ? idx : 0);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`group relative flex w-full items-center justify-between gap-2.5 rounded-xl border transition-all duration-150 outline-none select-none text-left active:scale-[0.995] ${
          isSmall ? "h-8.5 px-3 text-xs" : "h-10.5 px-3.5 text-sm"
        } ${
          error
            ? "border-red-400 bg-red-50/20 text-slate-900 ring-2 ring-red-400/20"
            : isOpen
            ? "border-[#007AFF] bg-white ring-3 ring-[#007AFF]/20 shadow-sm"
            : "border-slate-200/90 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-100/70 shadow-2xs text-slate-800"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${triggerClassName}`}
      >
        <span className="flex items-center gap-2.5 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0 text-slate-500">{selectedOption.icon}</span>
          )}
          <span
            className={`truncate font-medium tracking-tight ${
              selectedOption ? "text-slate-900" : "text-slate-400 font-normal"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {selectedOption.badge}
            </span>
          )}
        </span>

        {/* iOS Double Chevrons */}
        <div className="flex items-center gap-1 shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors">
          <ChevronsUpDown className="size-4 shrink-0 text-slate-400 group-hover:text-slate-600" />
        </div>
      </button>

      {/* iOS Native Popover Action Menu */}
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className={`absolute left-0 right-0 z-50 max-h-72 w-full overflow-y-auto rounded-[18px] border border-black/[0.08] bg-white/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.1)] backdrop-blur-3xl transition-all duration-150 animate-in fade-in-0 zoom-in-95 ${
            openUpward
              ? "bottom-full mb-1.5 origin-bottom"
              : "top-full mt-1.5 origin-top"
          } ${menuClassName}`}
          style={{
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Optional iOS Section Header */}
          {headerLabel && (
            <>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {headerLabel}
              </div>
              <div className="h-[0.5px] bg-slate-200/80 mx-1 mb-1" />
            </>
          )}

          {normalizedOptions.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = activeIndex === index;

            return (
              <div
                key={option.value || `empty-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => !option.disabled && handleSelect(option.value)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`group relative flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 transition-all duration-100 select-none ${
                  option.disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer"
                } ${
                  isSelected
                    ? "bg-[#007AFF] text-white font-semibold shadow-xs"
                    : isHighlighted
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-800 hover:bg-[#007AFF] hover:text-white"
                } ${isSmall ? "text-xs py-2" : "text-[13.5px]"}`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {option.icon && (
                    <span
                      className={`shrink-0 transition-colors ${
                        isSelected
                          ? "text-white"
                          : "text-slate-500 group-hover:text-white"
                      }`}
                    >
                      {option.icon}
                    </span>
                  )}
                  <span className="truncate">{option.label}</span>
                  {option.badge && (
                    <span
                      className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-white/20 group-hover:text-white"
                      }`}
                    >
                      {option.badge}
                    </span>
                  )}
                </div>

                {/* iOS Blue / White Checkmark */}
                {isSelected && (
                  <span className="shrink-0 flex items-center justify-center text-white animate-in fade-in zoom-in-75 duration-100">
                    <Check className="size-4.5 stroke-[2.5]" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
