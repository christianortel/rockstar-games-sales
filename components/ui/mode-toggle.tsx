"use client";

import { cn } from "@/lib/utils";

export interface ModeToggleOption<T extends string> {
  label: string;
  value: T;
  hint?: string;
}

export function ModeToggle<T extends string>({
  label,
  value,
  options,
  onChange,
  className
}: {
  label?: string;
  value: T;
  options: ModeToggleOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label ? <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">{label}</p> : null}
      <div className="inline-flex flex-wrap gap-2 rounded-[1.25rem] border border-white/10 bg-black/20 p-1.5 backdrop-blur-xl">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              className={cn(
                "rounded-[0.9rem] border px-3 py-2 text-[11px] uppercase tracking-[0.22em] transition",
                active
                  ? "border-white/18 bg-white text-black"
                  : "border-transparent bg-transparent text-white/58 hover:border-white/10 hover:bg-white/6 hover:text-white"
              )}
              onClick={() => onChange(option.value)}
              title={option.hint}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
