"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { company } from "@/lib/constants";
import { useTranslation } from "react-i18next";

type SlideVariant = "brand" | "lines" | "burst" | "grid";

interface SlideItem {
  label: string;
  title: string;
  detail: string;
  variant: SlideVariant;
  image?: string;
}

const slides: SlideItem[] = [
  {
    label: "Brand Presence",
    title: company.name,
    detail: "Private Limited",
    variant: "brand",
    image: "/images/home.png",
  },
  {
    label: "Solar EPC",
    title: "Engineering the clean-energy transition",
    detail: "Residential rooftops, commercial campuses, and industrial deployments.",
    variant: "lines",
    image: "/images/Energy-Transition-Challenge.jpg",
  },
  {
    label: "EV Infrastructure",
    title: "Connected charging for the next mobility wave",
    detail: "Fast, reliable charging ecosystems for urban and highway growth.",
    variant: "burst",
    image: "/images/connected%20charging%20for%20mobility.jpg",
  },
  {
    label: "Smart Buildings",
    title: "Digital systems for resilient facilities",
    detail: "Automation, security, and energy intelligence in one view.",
    variant: "grid",
    image: "/images/hero-grid.svg",
  },
];

export default function SectorShowcaseSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderImageLoaded, setSliderImageLoaded] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [imageTimeout, setImageTimeout] = useState<Record<string, boolean>>({});
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % slides.length);
    }, 7200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    // Set timeout for image loading to prevent page from hanging
    const slide = slides[currentSlide];
    if (slide && slide.image && !sliderImageLoaded) {
      const timeout = setTimeout(() => {
        setImageTimeout((prev) => ({
          ...prev,
          [slide.image!]: true,
        }));
      }, 5000); // 5 second timeout for image

      return () => clearTimeout(timeout);
    }
  }, [currentSlide, sliderImageLoaded]);

  return (
    <div className="sectors-slider-shell" aria-label={t("Sector showcase slider")}>
      <div className="sectors-slider">
        <div className="sectors-track">
          {slides.map((slide, index) => {
            const imageSrc = slide.image ?? "/images/home.png";
            const isTimedOut = imageTimeout[imageSrc];
            const resolvedSrc = brokenImages[imageSrc] || isTimedOut ? "/images/home.png" : imageSrc;

            return (
            <motion.article
              key={slide.label}
              className={`sectors-slide sectors-slide-${slide.variant}`}
              aria-hidden={index !== currentSlide}
              initial={{ opacity: 0 }}
              animate={index === currentSlide ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.9 }}
            >
              {!sliderImageLoaded && !isTimedOut && index === currentSlide ? (
                <div className="sectors-slide-skeleton" aria-hidden="true" />
              ) : null}
              <div className="sectors-slide-media">
                <Image
                  src={resolvedSrc}
                  alt={slide.variant === "brand" ? company.name : t(slide.title)}
                  fill
                  quality={95}
                  sizes="100vw"
                  className="sectors-slide-image"
                  priority={index === 0}
                  onError={() => {
                    setBrokenImages((prev) => {
                      if (prev[imageSrc]) {
                        return prev;
                      }

                      return {
                        ...prev,
                        [imageSrc]: true,
                      };
                    });
                  }}
                  onLoad={() => index === currentSlide && setSliderImageLoaded(true)}
                />
                <div className="sectors-slide-overlay" />
                {slide.variant !== "brand" ? (
                  <motion.div
                    className="sectors-slide-geometry"
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={index === currentSlide ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 1.2, delay: 0.3 }}
                  >
                    <svg viewBox="0 0 1000 700" className="sectors-geometry-svg" preserveAspectRatio="none">
                      {slide.variant === "lines" ? (
                        <>
                          <circle cx="500" cy="350" r="265" className="geo-stroke geo-stroke-circle" pathLength={100} />
                          <path d="M70 95 L500 350 L930 95" className="geo-stroke geo-stroke-line" pathLength={100} />
                          <path d="M70 605 L500 350 L930 605" className="geo-stroke geo-stroke-line geo-stroke-line-alt" pathLength={100} />
                        </>
                      ) : null}
                      {slide.variant === "burst" ? (
                        <>
                          <circle cx="500" cy="350" r="248" className="geo-stroke geo-stroke-circle geo-stroke-circle-large" pathLength={100} />
                          <circle cx="500" cy="350" r="162" className="geo-stroke geo-stroke-circle geo-stroke-circle-small" pathLength={100} />
                          <path d="M500 92 V608" className="geo-stroke geo-stroke-burst geo-stroke-burst-vert" pathLength={100} />
                          <path d="M214 162 L500 350 L786 162" className="geo-stroke geo-stroke-burst geo-stroke-burst-up" pathLength={100} />
                          <path d="M214 538 L500 350 L786 538" className="geo-stroke geo-stroke-burst geo-stroke-burst-down" pathLength={100} />
                          <path d="M258 350 H742" className="geo-stroke geo-stroke-burst geo-stroke-burst-mid" pathLength={100} />
                        </>
                      ) : null}
                      {slide.variant === "grid" ? (
                        <>
                          <circle cx="500" cy="350" r="238" className="geo-stroke geo-stroke-circle geo-stroke-circle-grid" pathLength={100} />
                          <path d="M120 140 H880" className="geo-stroke geo-stroke-grid" pathLength={100} />
                          <path d="M120 240 H880" className="geo-stroke geo-stroke-grid" pathLength={100} />
                          <path d="M120 420 H880" className="geo-stroke geo-stroke-grid" pathLength={100} />
                          <path d="M120 540 H880" className="geo-stroke geo-stroke-grid" pathLength={100} />
                          <path d="M230 80 V620" className="geo-stroke geo-stroke-grid" pathLength={100} />
                          <path d="M390 80 V620" className="geo-stroke geo-stroke-grid" pathLength={100} />
                          <path d="M610 80 V620" className="geo-stroke geo-stroke-grid" pathLength={100} />
                          <path d="M770 80 V620" className="geo-stroke geo-stroke-grid" pathLength={100} />
                        </>
                      ) : null}
                    </svg>
                  </motion.div>
                ) : null}
                <motion.div
                  className="sectors-slide-copy"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                  animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: reduceMotion ? 0.2 : 0.72, delay: 0.2 }}
                >
                  <p>{t(slide.label)}</p>
                  <h3>{slide.variant === "brand" ? company.name : t(slide.title)}</h3>
                  <span>{t(slide.detail)}</span>
                </motion.div>
              </div>
            </motion.article>
            );
          })}
        </div>
        <motion.div
          className="sectors-dots"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {slides.map((slide, index) => (
            <button
              key={slide.label}
              type="button"
              className={index === currentSlide ? "sectors-dot active" : "sectors-dot"}
              onClick={() => setCurrentSlide(index)}
              aria-label={`${t("Go to slide")}: ${t(slide.label)}`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
