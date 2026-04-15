"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface AnimatedImageProps {
  src: string;
  alt: string;
  direction?: "left" | "right";
  className?: string;
}

export default function AnimatedImage({ src, alt, direction = "right", className = "" }: AnimatedImageProps) {
  const reduceMotion = useReducedMotion();
  const [imageSrc, setImageSrc] = useState(src);
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.02, 1.07, 1.02]);

  return (
    <motion.div
      ref={ref}
      className={`story-image-shell ${className}`.trim()}
      initial={{ opacity: 0, x: reduceMotion ? 0 : direction === "left" ? -42 : 42 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduceMotion ? 0.25 : 0.82, ease: [0.22, 1, 0.36, 1] }}
      style={{ y: reduceMotion ? 0 : y }}
    >
      <motion.div className="story-image-inner" style={{ scale: reduceMotion ? 1.02 : scale }}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          onError={() => {
            if (imageSrc !== "/images/query.png") {
              setImageSrc("/images/query.png");
            }
          }}
        />
      </motion.div>
    </motion.div>
  );
}
