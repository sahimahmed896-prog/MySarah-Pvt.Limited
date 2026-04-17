"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OfferNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  if (isDismissed) {
    return null;
  }

  return (
    <aside className={isVisible ? "offer-notice is-visible" : "offer-notice"} aria-label="Limited time offer">
      <div className="offer-notice-content">
        <p className="offer-notice-title">Limited Time Offer</p>
        <p className="offer-notice-text">
          Install Solar &amp; Get Free Induction. Book now and enjoy exclusive benefits.
        </p>
      </div>
      <div className="offer-notice-actions">
        <Link href="/offer" className="button offer-notice-primary">
          View Offer
        </Link>
        <button type="button" className="button button-outline offer-notice-secondary" onClick={() => setIsDismissed(true)}>
          Close
        </button>
      </div>
    </aside>
  );
}
