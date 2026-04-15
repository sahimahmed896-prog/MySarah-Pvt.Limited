"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

export default function StoryProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [enableSpring, setEnableSpring] = useState(false);

  // Defer spring animation until after page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setEnableSpring(!reduceMotion);
    }, 1000);

    return () => clearTimeout(timer);
  }, [reduceMotion]);

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    mass: 0.22,
  });

  const progress = reduceMotion || !enableSpring ? scrollYProgress : springProgress;
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="story-progress-track" aria-hidden="true">
      <motion.div className="story-progress-fill" style={{ scaleX, transformOrigin: "0% 50%" }} />
    </div>
  );
}
