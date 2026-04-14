import type { Metadata } from "next";
import Image from "next/image";
import LeadForm from "@/components/forms/LeadForm";
import SectionHeading from "@/components/shared/SectionHeading";
import { company } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us | Mysarah Modern Tech",
  description: "Contact Mysarah Modern Tech for solar quote, consultation, and project support in Assam.",
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero-wrap">
        <div className="container contact-hero-grid">
          <article className="contact-hero-copy">
            <p className="eyebrow">Contact</p>
            <h1>Let&apos;s Plan Your Project with Confidence</h1>
            <p>
              Share your requirements and our team will create a practical, timeline-aware execution plan tailored to
              your site and budget.
            </p>
            <div className="contact-hero-metrics" aria-label="Contact quick facts">
              <article>
                <strong>&lt; 24h</strong>
                <span>First Response Window</span>
              </article>
              <article>
                <strong>Assam</strong>
                <span>Primary Operations Region</span>
              </article>
              <article>
                <strong>1:1</strong>
                <span>Dedicated Coordination</span>
              </article>
            </div>
          </article>

          <div className="contact-hero-media">
            <Image
              src="/images/query.png"
              alt="Professional discussion and project planning"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="contact-hero-image"
            />
            <div className="contact-hero-overlay" />
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionHeading
          eyebrow="Project Query"
          title="Connect with Our Team"
          description="Use the form for consultations, quotations, and business enquiries. We review each submission and respond with the next action plan."
        />

        <div className="contact-grid">
          <LeadForm variant="contact" title="Contact Form" />

          <aside className="contact-aside contact-aside-pro">
            <h3>Reach Us</h3>
            <p>{company.name}</p>
            <p>{company.address}</p>

            <div className="contact-detail-list">
              <p>
                Phone
                <a href={`tel:${company.phone.replace(/\s+/g, "")}`}>{company.phone}</a>
              </p>
              <p>
                Email
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </p>
            </div>

            <div className="map-wrap">
              <iframe
                title="Mysarah Modern Tech Location"
                src="https://www.google.com/maps?q=Guwahati,Assam&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
