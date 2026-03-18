"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function ConfidenceMeter({
  score,
  accent,
  className
}: {
  score: number;
  accent: string;
  className?: string;
}) {
  const percent = Math.max(0, Math.min(100, Math.round(score * 100)));
  const tone =
    percent >= 80 ? "High confidence" : percent >= 60 ? "Moderate confidence" : percent >= 40 ? "Partial confidence" : "Low confidence";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.24em] text-white/45">
        <span>{tone}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          style={{ background: `linear-gradient(90deg, ${accent} 0%, rgba(255,255,255,0.9) 100%)` }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          viewport={{ once: true }}
          whileInView={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
