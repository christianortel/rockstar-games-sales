"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";

import { ThemeDefinition } from "@/types/domain";

export function SceneBackdrop({
  sceneKey,
  image,
  theme,
  backgroundPosition = "center center",
  priority = false
}: {
  sceneKey: string;
  image?: string;
  theme: ThemeDefinition;
  backgroundPosition?: string;
  priority?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      <AnimatePresence mode="wait">
        <motion.div
          key={sceneKey}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0"
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.01 }}
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.02 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.45, ease: "easeInOut" }}
        >
          {image ? (
            <Image
              alt=""
              className="object-cover opacity-[0.9]"
              fill
              priority={priority}
              sizes="100vw"
              src={image}
              style={{ objectPosition: backgroundPosition }}
              unoptimized
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.backgroundGradient}`} />
          )}
          <div className={`absolute inset-0 ${theme.overlayGradient}`} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.22))]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/90 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%)] opacity-70" />
          <div className="absolute inset-0 opacity-50" style={{ background: `radial-gradient(circle at 78% 18%, ${theme.accent}55 0%, transparent 26%)` }} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04)_0%,transparent_18%,transparent_82%,rgba(255,255,255,0.04)_100%)] opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_22%)] opacity-25" />
      <div className="absolute inset-0 opacity-35" style={{ background: `linear-gradient(90deg, ${theme.accentSoft} 0%, transparent 28%, transparent 72%, ${theme.accentSoft} 100%)` }} />
    </div>
  );
}
