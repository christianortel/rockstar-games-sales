"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({
  value,
  formatter
}: {
  value: number;
  formatter: (value: number) => string;
}) {
  const [displayValue, setDisplayValue] = useState(() => formatter(0));
  const previousValue = useRef(0);

  useEffect(() => {
    const controls = animate(previousValue.current, value, {
      duration: Math.abs(value - previousValue.current) > 100 ? 0.9 : 0.55,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplayValue(formatter(latest));
      }
    });

    previousValue.current = value;

    return () => controls.stop();
  }, [formatter, value]);

  return <span>{displayValue}</span>;
}
