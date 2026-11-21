import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-3 py-1.5 text-base transition-all duration-150 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-[#14283F] dark:focus-visible:border-sky-400 focus-visible:ring-2 focus-visible:ring-[#14283F]/15 dark:focus-visible:ring-sky-400/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-100/50 dark:disabled:bg-slate-900/40 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm shadow-2xs",
        className
      )}
      {...props}
    />
  )
}

export { Input }
