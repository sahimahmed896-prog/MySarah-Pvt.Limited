import Image from "next/image";
import Link from "next/link";

export default function OfferPage() {
  return (
    <main className="offer-page">
      <section className="offer-hero">
        <div className="container offer-hero-inner">
          <p className="eyebrow">Special Promotion</p>
          <h1>Limited Time Corporate Offer</h1>
          <p>
            Explore our current promotional program with exclusive value-added benefits. Offer details and included
            services may vary by campaign.
          </p>
        </div>
      </section>

      <section className="section offer-overview">
        <div className="container offer-overview-grid">
          <article>
            <h2>Offer Description</h2>
            <p>
              Mysarah Modern Tech Private Limited is offering a value-focused solar package designed for smooth
              installation, dependable support, and practical day-to-day benefits.
            </p>
            <p>
              Complete your solar installation program with us and receive a complimentary induction cooktop as part of
              this offer.
            </p>
          </article>
          <article className="offer-benefits">
            <h2>What You Get</h2>
            <ul>
              <li>Professional solar installation service</li>
              <li>Free induction cooktop with installation</li>
              <li>Site assessment, setup support, and post-installation guidance</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section offer-visuals">
        <div className="container">
          <h2>Offer Visuals</h2>
          <div className="offer-visual-grid">
            <figure className="offer-visual-card">
              <Image src="/images/offer.png" alt="Mysarah limited time solar offer poster" fill sizes="(max-width: 980px) 100vw, 50vw" />
            </figure>
            <figure className="offer-visual-card">
              <Image
                src="/images/solarTransition.png"
                alt="Solar installation project visual"
                fill
                sizes="(max-width: 980px) 100vw, 50vw"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="section offer-cta-section">
        <div className="container offer-cta-shell">
          <div>
            <h2>Ready to claim this offer?</h2>
            <p>Move forward with a guided solar installation program and secure your promotional benefit.</p>
          </div>
          <div className="offer-cta-actions">
            <Link href="/sectors/solar" className="button">
              Get This Offer Now
            </Link>
            <Link href="/contact" className="button button-outline">
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
