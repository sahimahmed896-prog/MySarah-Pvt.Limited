"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import HeroCarousel from "@/components/home/HeroCarousel";
import SolarInsightsPanel from "@/components/home/SolarInsightsPanel";
import AnimatedHeading from "@/components/shared/AnimatedHeading";
import AnimatedCard from "@/components/shared/AnimatedCard";
import SectorCard from "@/components/shared/SectorCard";
import { company } from "@/lib/constants";
import { sectors } from "@/lib/sectors";

export default function Home() {
  const { t } = useTranslation();
  const featured = sectors.slice(0, 4);

  const blueprintCards = [
    {
      id: "01",
      title: t("home.blueprint.card1.title"),
      image: "/images/consult%20and%20acess.jpg",
      backTitle: t("home.blueprint.card1.backTitle"),
      backText: t("home.blueprint.card1.backText"),
    },
    {
      id: "02",
      title: t("home.blueprint.card2.title"),
      image: "/images/engneer%20and%20plan.jpg",
      backTitle: t("home.blueprint.card2.backTitle"),
      backText: t("home.blueprint.card2.backText"),
    },
    {
      id: "03",
      title: t("home.blueprint.card3.title"),
      image: "/images/deploy.png",
      backTitle: t("home.blueprint.card3.backTitle"),
      backText: t("home.blueprint.card3.backText"),
    },
  ];

  
  return (
    <main>
      <HeroCarousel />

      <section className="section media-story-section">
        <div className="media-story-image-shell">
          <video
            className="media-story-video"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/solarTransition.png"
          >
            <source src="/videos/about.mp4" type="video/mp4" />
          </video>
          <div className="media-story-overlay" />

          <div className="container media-story-content">
            <p className="eyebrow">{t("Who We Are")}</p>
            <h2>{t("A premium operational model built for scale")}</h2>
            <p>
              {company.name} {t("blends disciplined governance with fast execution to build long-term value across sectors from")} {company.city}, India.
            </p>
            <div className="media-story-metrics">
              <article>
                <strong>01</strong>
                <span>{t("Active sector operating")}</span>
              </article>
              <article>
                <strong>04</strong>
                <span>{t("Planned sector roadmap")}</span>
              </article>
              <article>
                <strong>24x7</strong>
                <span>{t("Client communication support")}</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section tech-future-section">
        <div className="container tech-future-grid">
          <article className="tech-future-lead">
            <p className="eyebrow">{t("Future Narrative")}</p>
            <h2>
              {t("Why")} <span className="hero-keyword">{t("technology")}</span> {t("leads the future of infrastructure")}
            </h2>
            <p>
              {t(
                "We believe the next decade belongs to businesses that combine physical execution with digital intelligence. From planning and deployment to monitoring and optimization, technology converts projects into scalable, measurable systems."
              )}
            </p>
          </article>

          <article className="tech-future-points">
            <div>
              <h3>{t("Smarter Decisions")}</h3>
              <p>{t("Data-backed planning improves technical accuracy, speed, and lifecycle outcomes.")}</p>
            </div>
            <div>
              <h3>{t("Operational Visibility")}</h3>
              <p>{t("Real-time monitoring and transparent status tracking strengthen trust and execution control.")}</p>
            </div>
            <div>
              <h3>{t("Scalable Expansion")}</h3>
              <p>{t("Reusable digital systems make it easier to launch new sectors without rebuilding from zero.")}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="section section-soft strategy-media-section">
        <div className="container strategy-shell">
          <AnimatedHeading
            eyebrow={t("Operating Blueprint")}
            title={t("How we execute from lead to lifecycle support")}
            description={t("home.blueprint.description")}
          />
        </div>
        <div className="media-flip-bleed">
          <div className="media-flip-grid">
            {blueprintCards.map((card, index) => (
              <AnimatedCard key={card.id} delay={0.1 * index}>
                <article className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-face flip-card-front" style={{ backgroundImage: `url(${card.image})` }}>
                      <div className="flip-overlay" />
                      <div className="flip-front-content">
                        <span>{card.id}</span>
                        <h3>{card.title}</h3>
                      </div>
                    </div>
                    <div className="flip-card-face flip-card-back">
                      <span>{card.id}</span>
                      <h3>{card.backTitle}</h3>
                      <p>{card.backText}</p>
                    </div>
                  </div>
                </article>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <AnimatedHeading
            eyebrow={t("Sectors")}
            title={t("Multi-sector corporate roadmap")}
            description={t(
              "Solar is active. Additional verticals are structured for phased launches with shared governance and digital foundations."
            )}
            align="center"
          />
          <div className="sector-grid">
            {featured.map((sector, index) => (
              <AnimatedCard key={sector.slug} delay={0.08 * index}>
                <SectorCard sector={sector} />
              </AnimatedCard>
            ))}
          </div>
          <div className="center-wrap">
            <Link href="/sectors" className="button">
              {t("View All Sectors")}
            </Link>
          </div>
        </div>
      </section>

      <section className="section solar-transition-section">
        <div className="cta-panel">
          <div>
            <h2>{t("Build your solar transition with boardroom-level clarity")}</h2>
            <p>
              {t("From assessment to commissioning, we deliver a structured program for residential and commercial assets.")}
            </p>
          </div>
          <div className="cta-row">
            <Link href="/sectors/solar" className="button">
              {t("Explore Solar")}
            </Link>
            <Link href="/contact" className="button button-outline">
              {t("Contact Team")}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-soft insights-section">
        <div className="insights-shell">
          <AnimatedHeading
            eyebrow={t("Execution Intelligence")}
            title={t("Live installation data from admin workflow")}
            description={t(
              "Each completed installation from the admin panel updates this dashboard with location-wise footprint and progress analytics."
            )}
          />
          <SolarInsightsPanel />
        </div>
      </section>
    </main>
  );
}
