"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { formatPrice } from "@/lib/category-icons";

/** Counts up from 0 to `value` once (instant for reduced-motion users). */
export function AnimatedNumber({ value, currency = false }: { value: number; currency?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, { duration: 0.9, ease: "easeOut", onUpdate: setDisplay });
    return () => controls.stop();
  }, [value, reduceMotion]);

  return <>{currency ? formatPrice(Math.round(display * 100) / 100) : Math.round(display).toLocaleString()}</>;
}