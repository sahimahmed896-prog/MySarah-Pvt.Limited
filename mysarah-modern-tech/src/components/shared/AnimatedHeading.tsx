"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function AnimatedHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: AnimatedHeadingProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`section-heading ${align === "center" ? "section-heading-center" : ""} ${className}`.trim()}>
      {eyebrow ? (
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.56 }}
        >
          {eyebrow}
        </motion.p>
      ) : null}

      <motion.h2
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: reduceMotion ? 0.2 : 0.68, delay: 0.08 }}
      >
        {title}
      </motion.h2>

      {description ? (
        <motion.p
          className="section-description"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.64, delay: 0.15 }}
        >
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}
