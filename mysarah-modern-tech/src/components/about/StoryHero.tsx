"use client";

import { useState } from "react";
import Image from "next/image";
import AnimatedText from "@/components/about/AnimatedText";
import { useTranslation } from "react-i18next";

export default function StoryHero() {
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation();

  return (
    <section id="story-hero" className="story-hero" aria-label={t("Our Story Hero")}>
      {!loaded ? <div className="story-hero-skeleton" aria-hidden="true" /> : null}

      <Image
        src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2200&q=95"
        alt={t("Field operations and modern infrastructure")}
        fill
        quality={95}
        priority
        sizes="100vw"
        className="story-hero-image"
        onLoad={() => setLoaded(true)}
      />

      <div className="story-hero-overlay" />
      <div className="story-container">
        <AnimatedText className="story-hero-copy">
          <p className="story-eyebrow">{t("Our Story")}</p>
          <h1>{t("Rooted in Experience. Growing with Technology.")}</h1>
          <p>
            {t(
              "Mysarah Modern Tech Private Limited began with real field operations in Assam and is now evolving into a digitally enabled multi-sector platform built for long-term impact."
            )}
          </p>
        </AnimatedText>
      </div>
    </section>
  );
}
