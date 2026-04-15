import type { Metadata } from "next";
import { company } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service | Mysarah Modern Tech",
  description:
    "Terms of Services for Mysarah Modern Tech Private Limited covering service scopes, responsibilities, and usage conditions.",
};

export default function TermsPage() {
  return (
    <main className="terms-page">
      <section className="terms-hero">
        <div className="terms-hero-overlay" />
        <div className="container terms-shell terms-hero-inner">
          <p className="eyebrow">Corporate Policy</p>
          <h1>Terms of Service</h1>
          <p>Guidelines for using our services and website</p>
        </div>
      </section>

      <section className="terms-intro">
        <div className="container terms-shell">
          <p>
            These Terms of Service govern the use of services offered by {company.name} and the use of our official
            website and communication channels. By accessing our website, submitting project details, or requesting
            service support, you acknowledge and accept the obligations described in this document.
          </p>
        </div>
      </section>

      <section className="terms-content-wrap">
        <div className="container terms-shell terms-document" role="document">
          <section className="terms-section" aria-labelledby="terms-scope">
            <h2 id="terms-scope">Service Scope</h2>
            <p>
              We provide solar installation and related operational support, including initial consultation,
              documentation review, site assessment, engineering planning, execution support, and post-installation
              coordination. Service availability and scope may vary depending on location, technical feasibility,
              regulatory permissions, and project-specific requirements.
            </p>
          </section>

          <section className="terms-section" aria-labelledby="terms-accuracy">
            <h2 id="terms-accuracy">Information Accuracy</h2>
            <p>
              Clients are responsible for ensuring that all submitted information, documents, and declarations are
              complete, accurate, and current. Any incorrect or incomplete information may delay evaluation,
              documentation, approvals, execution scheduling, or final project delivery.
            </p>
          </section>

          <section className="terms-section" aria-labelledby="terms-use">
            <h2 id="terms-use">Acceptable Website Use</h2>
            <p>
              The website may be used only for lawful and service-related purposes, including inquiries, document
              submission, and project communication. Any attempt to misuse the platform, gain unauthorized access,
              distribute harmful content, or interfere with technical systems is strictly prohibited.
            </p>
          </section>

          <section className="terms-section" aria-labelledby="terms-pricing">
            <h2 id="terms-pricing">Quotation and Pricing</h2>
            <p>
              All cost estimates and quotations are prepared on the basis of information available at the time of
              evaluation. Final pricing may be revised where project scope, material specifications, site conditions,
              policy requirements, or client instructions change during the implementation cycle.
            </p>
          </section>

          <section className="terms-section" aria-labelledby="terms-documents">
            <h2 id="terms-documents">Document Handling</h2>
            <p>
              Documents and personal records submitted for service processing are handled in accordance with our
              Privacy Notice. Such documents are used only for project eligibility checks, execution planning,
              compliance obligations, official processing, and legitimate service communication.
            </p>
            <ul>
              <li>Documents are used only for authorized service activities</li>
              <li>Access is restricted to relevant operational personnel</li>
              <li>Retention follows legal and compliance obligations</li>
            </ul>
          </section>

          <section className="terms-section" aria-labelledby="terms-liability">
            <h2 id="terms-liability">Limitation of Liability</h2>
            <p>
              We make reasonable efforts to deliver services professionally and within planned timelines; however,
              delays or changes may occur due to external dependencies including utility approvals, third-party
              supplier schedules, regulatory revisions, weather conditions, force majeure events, and other factors
              outside direct operational control.
            </p>
          </section>

          <section className="terms-section" aria-labelledby="terms-updates">
            <h2 id="terms-updates">Policy Updates</h2>
            <p>
              We may revise these Terms of Service at any time to reflect legal requirements, operational updates, or
              regulatory changes. Updated versions become effective upon publication. Continued use of our website or
              services after publication indicates acceptance of the revised terms.
            </p>
          </section>

          <section className="terms-section" aria-labelledby="terms-contact">
            <h2 id="terms-contact">Contact Information</h2>
            <p>
              For terms-related questions, please contact:
              <br />
              {company.name}
              <br />
              Email: <a href={`mailto:${company.email}`}>{company.email}</a>
              <br />
              Phone: <a href={`tel:${company.phone.replace(/\s+/g, "")}`}>{company.phone}</a>
              <br />
              Address: {company.address}
            </p>
          </section>

          <section className="terms-section" aria-labelledby="terms-last-updated">
            <h2 id="terms-last-updated">Last Updated</h2>
            <p>April 16, 2026</p>
          </section>
        </div>
      </section>
    </main>
  );
}
