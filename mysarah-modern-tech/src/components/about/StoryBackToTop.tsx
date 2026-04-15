"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { useMotionValueEvent } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function StoryBackToTop() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [enableTracking, setEnableTracking] = useState(false);
  const { t } = useTranslation();

  // Defer scroll tracking until page is idle
  useEffect(() => {
    const timer = setTimeout(() => {
      setEnableTracking(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (enableTracking) {
      setVisible(latest > 900);
    }
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.a
          href="#story-hero"
          className="story-back-top"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.28 }}
        >
          {t("Back to top")}
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
