"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

interface Slide {
  title: string;
  richTitle: ReactNode;
  subtitle: string;
  image: string;
}

export default function HeroCarousel() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<boolean[]>(() => [false, false, false]);
  const reduceMotion = useReducedMotion();

  const slides: Slide[] = [
    {
      title: t("Powering Assam with modern solar infrastructure"),
      richTitle: (
        <>
          {t("Powering")} <span className="hero-keyword">{t("Assam")}</span> {t("with modern solar infrastructure")}
        </>
      ),
      subtitle: t("Mysarah Modern Tech Private Limited is building a future-ready multi-sector platform, starting with clean energy solutions."),
      image: "/images/home.png",
    },
    {
      title: t("Corporate execution with startup speed"),
      richTitle: (
        <>
          <span className="hero-keyword">{t("Corporate")}</span> {t("execution with startup speed")}
        </>
      ),
      subtitle: t("Structured delivery, transparent process, and technology-first field operations for residential and commercial projects."),
      image: "/images/hero-grid.svg",
    },
    {
      title: t("Designed to scale across sectors"),
      richTitle: (
        <>
          {t("Designed to scale across")} <span className="hero-keyword">{t("sectors")}</span>
        </>
      ),
      subtitle: t("A modular service architecture that expands from solar into smart infrastructure without redesigning the business core."),
      image: "/images/hero-ev.svg",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero">
      <div className="hero-bg-orb hero-bg-orb-1" />
      <div className="hero-bg-orb hero-bg-orb-2" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.6 }}
          >
            {t("Multi-Sector Corporate Platform")}
          </motion.p>
          <div className="hero-copy-stack" aria-live="polite">
            {slides.map((slide, index) => (
              <motion.article
                key={slide.title}
                className={index === active ? "hero-copy-panel active" : "hero-copy-panel"}
                aria-hidden={index !== active}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                animate={index === active ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: reduceMotion ? 0.2 : 0.68 }}
              >
                <h1>{slide.richTitle}</h1>
                <p>{slide.subtitle}</p>
              </motion.article>
            ))}
          </div>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.68, delay: 0.1 }}
          >
            <Link href="/sectors/solar" className="button">
              {t("Explore Solar Services")}
            </Link>
            <Link href="/contact" className="button button-outline">
              {t("Request a Quote")}
            </Link>
          </motion.div>
          <div className="hero-kpi-row">
            <div>
              <strong>01</strong>
              <span>{t("Active sector live")}</span>
            </div>
            <div>
              <strong>04</strong>
              <span>{t("Total sector roadmap")}</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>{t("Unified digital architecture")}</span>
            </div>
          </div>
          <div className="hero-dots" aria-label={t("Hero slide indicators")}>
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`${t("Show slide")} ${index + 1}`}
                className={index === active ? "hero-dot active" : "hero-dot"}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-shell">
            {!loadedSlides[active] ? <div className="hero-image-skeleton" aria-hidden="true" /> : null}
            <div className="hero-image-stack" aria-live="polite">
              {slides.map((slide, index) => (
                <motion.div
                  key={slide.image}
                  initial={{ opacity: 0 }}
                  animate={index === active ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0.2 : 0.8 }}
                  className={"hero-image-wrapper"}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={620}
                    height={460}
                    className={index === active ? "hero-image-slide active" : "hero-image-slide"}
                    priority={index === 0}
                    loading={index === 0 ? undefined : "eager"}
                    onLoad={() => {
                      setLoadedSlides((prev) => {
                        if (prev[index]) {
                          return prev;
                        }

                        const next = [...prev];
                        next[index] = true;
                        return next;
                      });
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="hero-visual-note">
            <p>{t("Execution Framework")}</p>
            <h3>{t("Corporate governance with startup agility")}</h3>
          </div>
        </div>
      </div>
      <div className="hero-ticker" aria-hidden="true">
        <div className="hero-ticker-track">
          <span>{t("Solar Installations")}</span>
          <span>{t("Commercial Projects")}</span>
          <span>{t("Residential Rooftops")}</span>
          <span>{t("Future Sectors")}</span>
          <span>{t("Assam Operations")}</span>
          <span>{t("Solar Installations")}</span>
          <span>{t("Commercial Projects")}</span>
          <span>{t("Residential Rooftops")}</span>
          <span>{t("Future Sectors")}</span>
          <span>{t("Assam Operations")}</span>
        </div>
      </div>
    </section>
  );
}
