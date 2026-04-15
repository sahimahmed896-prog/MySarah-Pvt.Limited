"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import AnimatedImage from "@/components/about/AnimatedImage";
import StoryBackToTop from "@/components/about/StoryBackToTop";
import StoryProgress from "@/components/about/StoryProgress";
import AnimatedText from "@/components/about/AnimatedText";
import StoryChapterIndex from "@/components/about/StoryChapterIndex";
import StoryHero from "@/components/about/StoryHero";
import SectionWrapper from "@/components/about/SectionWrapper";
import StorySection from "@/components/about/StorySection";

export default function AboutPage() {
  const { t } = useTranslation();

  const chapterItems = [
    { id: "chapter-1", label: t("Field Experience") },
    { id: "chapter-2", label: t("Beginning with Solar") },
    { id: "chapter-3", label: t("Solar Installation") },
    { id: "chapter-4", label: t("Multi-Sector Vision") },
    { id: "core-values", label: t("Core Values") },
    { id: "future-vision", label: t("Future Vision") },
    { id: "story-cta", label: t("Partnership CTA") },
  ];

  const valueCards = [
    {
      title: t("Trust"),
      text: t("We deliver with transparency, realistic commitments, and accountable execution at every stage."),
    },
    {
      title: t("Reliability"),
      text: t("Our teams follow repeatable systems so quality remains consistent across projects and timelines."),
    },
    {
      title: t("Sustainability"),
      text: t("From solar adoption to process discipline, we focus on long-term value for communities and clients."),
    },
    {
      title: t("Innovation"),
      text: t("We combine operational learning with digital tools to make each next project smarter than the last."),
    },
  ];

  return (
    <main className="about-story-page">
      <StoryProgress />
      <StoryBackToTop />

      <StoryHero />
      <div className="story-chapter-index-slot">
        <StoryChapterIndex items={chapterItems} />
      </div>

      <div className="story-flow">
        <StorySection
          id="chapter-1"
          className="story-tone-a"
          eyebrow=""
          title={t("Field experience built our foundation")}
          text={t(
            "Our journey started on ground realities, not slide decks. We built trust by executing real projects, managing site constraints, and delivering measurable outcomes for customers."
          )}
          image="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1400&q=80"
          imageAlt={t("Engineers inspecting a solar installation site")}
        />

        <StorySection
          id="chapter-2"
          className="story-tone-b"
          eyebrow=""
          title={t("We began with residential and commercial solar")}
          text={t(
            "Solar became our first major execution engine. It gave us a proven operating model across project planning, installation quality, customer support, and post-installation tracking."
          )}
          image="https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1400&q=80"
          imageAlt={t("Large solar panel setup for commercial operations")}
          reverse
          bullets={[
            t("Residential rooftop installation programs"),
            t("Commercial solar deployment and maintenance"),
            t("Standardized workflow from survey to commissioning"),
          ]}
        />

        <SectionWrapper id="chapter-3" className="story-tone-c story-solar-video-wrap">
          <div className="story-solar-video-shell">
            <video
              className="story-solar-video"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/solarTransition.png"
            >
              <source src="/videos/about.mp4" type="video/mp4" />
            </video>
            <div className="story-solar-video-overlay" />

            <div className="story-container story-solar-video-content">
              <AnimatedText className="story-solar-video-copy">
                <p className="story-eyebrow">Solar Installation</p>
                <h2>Execution-driven solar installation at business scale</h2>
                <p>
                  Our solar operations are built for measurable outcomes across residential, commercial, and
                  institutional projects. From site assessment and engineering to commissioning and lifecycle support,
                  we deliver with disciplined process, quality control, and long-term service accountability.
                </p>
              </AnimatedText>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper id="chapter-4" className="story-tone-d">
          <div className="story-chapter story-chapter-reverse">
            <AnimatedImage
              src="https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&w=1400&q=80"
              alt={t("Corporate expansion roadmap and infrastructure planning")}
              direction="left"
            />

            <AnimatedText className="story-copy">
              <p className="story-eyebrow"></p>
              <h2>{t("Our vision is multi-sector and future-ready")}</h2>
              <p>
                {t(
                  "With solar as our proven base, we are preparing structured expansion into electrical services, agriculture-linked initiatives, and smart technology operations."
                )}
              </p>
              <div className="story-mini-grid">
                <article>
                  <h3>{t("Electrical")}</h3>
                  <p>{t("Field reliability and infrastructure-grade execution systems.")}</p>
                </article>
                <article>
                  <h3>{t("Agriculture")}</h3>
                  <p>{t("Operational models that strengthen productivity and sustainability.")}</p>
                </article>
                <article>
                  <h3>{t("Smart Tech")}</h3>
                  <p>{t("Digital layers for visibility, control, and scalable growth.")}</p>
                </article>
              </div>
            </AnimatedText>
          </div>
        </SectionWrapper>
      </div>

      <SectionWrapper id="core-values" className="story-values-wrap">
        <div className="story-container">
          <AnimatedText className="story-center-head">
            <p className="story-eyebrow">{t("Core Values")}</p>
            <h2>{t("The principles that shape every decision")}</h2>
          </AnimatedText>

          <div className="story-values-grid">
            {valueCards.map((value, index) => (
              <AnimatedText key={value.title} delay={index * 0.1}>
                <article className="story-value-card">
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              </AnimatedText>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="future-vision">
        <div className="story-container story-future-vision">
          <AnimatedText className="story-center-head">
            <p className="story-eyebrow">{t("Future Vision")}</p>
            <h2>{t("Building a trusted multi-sector corporate platform from Assam for the next decade.")}</h2>
            <p>
              {t(
                "We are focused on disciplined growth, stronger digital execution, and sector expansion that creates durable long-term value."
              )}
            </p>
          </AnimatedText>
        </div>
      </SectionWrapper>

      <section id="story-cta" className="story-cta-section">
        <div className="story-container story-cta-shell">
          <AnimatedText className="story-cta-copy">
            <p className="story-eyebrow">{t("Partnership")}</p>
            <h2>{t("Let's Build the Future Together")}</h2>
            <p>{t("Connect with our team to start your next project with a company built for reliable execution.")}</p>
          </AnimatedText>
          <div className="story-cta-row">
            <Link href="/contact" className="story-cta-button">
              {t("Contact Us")}
            </Link>
            <Link href="/sectors/solar" className="story-cta-button story-cta-outline">
              {t("Get Quote")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
