"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Sector } from "@/lib/sectors";

interface SectorCardProps {
  sector: Sector;
}

export default function SectorCard({ sector }: SectorCardProps) {
  const [cardImage, setCardImage] = useState(sector.heroImage);

  useEffect(() => {
    setCardImage(sector.heroImage);
  }, [sector.heroImage]);

  return (
    <article className={`sector-card ${sector.active ? "sector-card-active" : "sector-card-inactive"}`}>
      <Image
        src={cardImage}
        alt={sector.title}
        fill
        className="sector-media-image"
        onError={() => {
          if (cardImage !== "/images/hero-grid.svg") {
            setCardImage("/images/hero-grid.svg");
          }
        }}
      />
      <div className="sector-media-overlay" />
      <p className="sector-state">{sector.active ? "Active" : "Coming Soon"}</p>
      {!sector.active ? <span className="sector-seal">Coming Soon</span> : null}
      <div className="sector-content">
        <h3>{sector.title}</h3>
        <p>{sector.description}</p>
        {sector.active ? (
          <Link href={`/sectors/${sector.slug}`} className="button button-outline">
            Explore Sector
          </Link>
        ) : null}
      </div>
    </article>
  );
}
