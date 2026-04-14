"use client";

import SectorCard from "@/components/shared/SectorCard";
import SectionHeading from "@/components/shared/SectionHeading";
import SectorShowcaseSlider from "@/components/sectors/SectorShowcaseSlider";
import { sectors } from "@/lib/sectors";
import { useTranslation } from "react-i18next";

const sectorGroups = [
  {
    key: "core-services",
    eyebrow: "Core Services",
    title: "Start here: the revenue engines",
    description: "These are the first services to lead the website and the strongest business drivers.",
    slugs: ["solar", "electrical-services", "construction"],
  },
  {
    key: "business-industry",
    eyebrow: "Business & Industry",
    title: "Commercial and operational sectors",
    description: "Industry-facing services that support trading, production, execution, and field operations.",
    slugs: ["manufacture", "export-import", "purchases-and-sales", "contract-field"],
  },
  {
    key: "lifestyle-public-services",
    eyebrow: "Lifestyle & Public Services",
    title: "Public-facing sectors and community services",
    description: "The service set that supports public engagement, experiences, and everyday life programs.",
    slugs: ["event-management", "tourism", "education", "health", "sports"],
  },
  {
    key: "technology-innovation",
    eyebrow: "Technology & Innovation",
    title: "Digital growth and intelligence",
    description: "The future-facing technology sectors that support automation, software, and AI-driven growth.",
    slugs: ["it-field", "ai"],
  },
  {
    key: "agriculture",
    eyebrow: "Agriculture",
    title: "Kept separate as a standalone strength",
    description: "Agriculture remains its own dedicated vertical because it is a key sector in Assam.",
    slugs: ["agriculture"],
  },
];

export default function SectorsPage() {
  const { t } = useTranslation();
  const sectorMap = new Map(sectors.map((sector) => [sector.slug, sector] as const));

  return (
    <main className="sectors-page">
      <section className="sectors-hero">
        <SectorShowcaseSlider />
      </section>

      <section className="section section-soft sectors-content">
        <div className="container">
          <SectionHeading
            eyebrow={t("Roadmap")}
            title={t("A structured multi-sector roadmap")}
            description={t(
              "Solar stays active at the top, then the rest of the portfolio is grouped into a clearer business hierarchy."
            )}
            align="center"
          />

          <div className="sectors-group-list">
            {sectorGroups.map((group) => (
              <section key={group.key} className="sectors-group-block">
                <div className="sectors-group-banner">
                  <div className="sectors-group-banner-main">
                    <SectionHeading
                      eyebrow={t(group.eyebrow)}
                      title={t(group.title)}
                      description={t(group.description)}
                    />
                  </div>

                  <aside className="sectors-group-meta" aria-label={`${t(group.eyebrow)} ${t("summary")}`}>
                    <span className="sectors-group-meta-kicker">{t("Priority cluster")}</span>
                    <strong>{group.slugs.length} {t("sectors")}</strong>
                    <p>{t("Curated for a cleaner business narrative and stronger visual hierarchy.")}</p>
                  </aside>
                </div>

                <div className="sectors-group-body">
                  <div className="sector-grid">
                    {group.slugs
                      .map((slug) => sectorMap.get(slug))
                      .filter(Boolean)
                      .map((sector) => (
                        <SectorCard key={sector!.slug} sector={sector!} />
                      ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
