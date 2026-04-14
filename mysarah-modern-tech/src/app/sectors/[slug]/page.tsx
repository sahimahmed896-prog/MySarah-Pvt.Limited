import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LeadForm from "@/components/forms/LeadForm";
import SolarApplicationForm from "@/components/forms/SolarApplicationForm";
import AnimatedCard from "@/components/shared/AnimatedCard";
import AnimatedHeading from "@/components/shared/AnimatedHeading";
import SectionHeading from "@/components/shared/SectionHeading";
import { getSectorBySlug, sectors } from "@/lib/sectors";

interface SectorPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export function generateStaticParams() {
  return sectors.map((sector) => ({ slug: sector.slug }));
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);

  if (!sector) {
    return { title: "Sector Not Found" };
  }

  return {
    title: `${sector.title} | Mysarah Modern Tech`,
    description: sector.description,
  };
}

export default async function SectorDetailPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);

  if (!sector) {
    notFound();
  }

  if (!sector.active) {
    return (
      <main className="section container">
        <SectionHeading
          eyebrow="Coming Soon"
          title={`${sector.title} is launching soon`}
          description="This sector is in strategic planning and execution setup."
        />
        <Link href="/sectors" className="button">
          Back to Sectors
        </Link>
      </main>
    );
  }

  if (sector.slug === "solar") {
    return (
      <main className="section solar-sector-page">
        <div className="container">
          <section className="solar-hero-panel">
            <div className="solar-hero-content">
              <p className="solar-hero-kicker">Active Sector</p>
              <h1>Solar Installation, Built as a Digital Service Layer</h1>
              <p>
                A structured customer journey from application to feasibility and execution. Every site request can be
                submitted digitally with address, GPS coordinates, and technical requirements.
              </p>

              <div className="solar-hero-metrics">
                <article>
                  <strong>100%</strong>
                  <span>Digital intake workflow</span>
                </article>
                <article>
                  <strong>GPS Ready</strong>
                  <span>Latitude and longitude capture</span>
                </article>
                <article>
                  <strong>Phased</strong>
                  <span>Site survey to commissioning</span>
                </article>
              </div>

              <div className="cta-row">
                <a href="#solar-application" className="button">
                  Start Application
                </a>
                <Link href="/contact" className="button button-outline">
                  Speak to Team
                </Link>
              </div>
            </div>

            <div className="solar-hero-side">
              <div className="solar-side-card">
                <p>Digital Flow</p>
                <h3>Customer fills details once. System stores actionable installation context.</h3>
                <ul>
                  <li>Personal and site profile</li>
                  <li>GPS coordinate precision</li>
                  <li>Power and load requirements</li>
                  <li>Timeline and feasibility notes</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="solar-process-band section-soft">
            <AnimatedHeading
              eyebrow="Execution Stack"
              title="Systematic process for solar deployment"
              description="The digital form feeds a structured operational pipeline for faster qualification and planning."
              align="center"
            />

            <div className="solar-process-grid">
              {[
                {
                  title: "Application Intake",
                  text: "Customer submits identity, site address, and installation intent from the portal.",
                },
                {
                  title: "Geo Verification",
                  text: "Latitude/longitude supports quicker map-level feasibility checks and route planning.",
                },
                {
                  title: "Technical Qualification",
                  text: "Bill range, load, and roof profile help estimate practical system sizing.",
                },
                {
                  title: "Execution Planning",
                  text: "Approved records are aligned to survey, installation, and commissioning operations.",
                },
              ].map((item, index) => (
                <AnimatedCard key={item.title} delay={0.08 * index}>
                  <article className="solar-process-item">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                </AnimatedCard>
              ))}
            </div>
          </section>

          <section id="solar-application" className="solar-application-wrap">
            <AnimatedHeading
              eyebrow="Customer Application"
              title="Submit your solar installation details"
              description="This captures the first-phase information. Admin-side response and workflow actions can be connected next."
            />
            <SolarApplicationForm />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="section container">
      <SectionHeading
        eyebrow="Active Sector"
        title="Solar Installation Services"
        description="Complete solar solutions for residential and commercial clients across Assam."
      />

      <div className="solar-grid">
        <article className="content-card">
          <h3>Overview</h3>
          <p>
            We provide end-to-end solar project services including site audit, design, installation, commissioning, and
            support.
          </p>
          <h3>Residential Services</h3>
          <p>Rooftop solar systems optimized for home energy savings and long-term reliability.</p>
          <h3>Commercial Services</h3>
          <p>High-capacity systems for offices, campuses, warehouses, and industrial facilities.</p>
        </article>

        <article className="content-card">
          <h3>Installation Process</h3>
          <ol className="process-list">
            <li>Site inspection and consumption analysis</li>
            <li>System design and proposal</li>
            <li>Material planning and execution schedule</li>
            <li>Installation and quality testing</li>
            <li>Commissioning and post-installation support</li>
          </ol>

          <h3>Benefits</h3>
          <ul className="benefits-list">
            <li>Lower electricity bills</li>
            <li>Reduced carbon footprint</li>
            <li>Reliable long-term asset value</li>
            <li>Scalable energy capacity</li>
          </ul>

          <div className="cta-row">
            <Link href="/contact" className="button">
              Book Consultation
            </Link>
            <a href="#solar-lead" className="button button-outline">
              Get Instant Quote
            </a>
          </div>
        </article>
      </div>

      <section id="solar-lead" className="section-soft">
        <LeadForm variant="quote" title="Request Solar Quote" />
      </section>
    </main>
  );
}
