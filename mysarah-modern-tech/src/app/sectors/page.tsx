"use client";

import SectorCard from "@/components/shared/SectorCard";
import SectionHeading from "@/components/shared/SectionHeading";
import SectorShowcaseSlider from "@/components/sectors/SectorShowcaseSlider";
import { sectors } from "@/lib/sectors";
import { useTranslation } from "react-i18next";

const sectorGroups = [
  {
    key: "core-services",
    title: "Core Services",
    slugs: ["solar", "electrical-services", "construction"],
  },
  {
    key: "business-industry",
    title: "Commercial and Operational Sectors",
    slugs: ["manufacture", "export-import", "purchases-and-sales", "contract-field"],
  },
  {
    key: "lifestyle-public-services",
    title: "Lifestyle and Public Services",
    slugs: ["event-management", "tourism", "education", "health", "sports"],
  },
  {
    key: "technology-innovation",
    title: "Technology and Innovation",
    slugs: ["it-field", "ai"],
  },
  {
    key: "agriculture",
    title: "Agriculture",
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
            eyebrow={t("Business Portfolio")}
            title={t("Our multi-sector business portfolio")}
            description={t(
              "Solar stays active at the top, and the rest of the portfolio is organized by business function."
            )}
            align="center"
          />

          <div className="sectors-group-list">
            {sectorGroups.map((group) => (
              <section key={group.key} className="sectors-group-block">
                <div className="sectors-group-banner">
                  <div className="sectors-group-banner-main">
                    <SectionHeading
                      title={t(group.title)}
                      align="center"
                    />
                  </div>

                  <aside className="sectors-group-meta" aria-label={`${t(group.title)} ${t("summary")}`}>
                    <strong>{group.slugs.length} {t("sectors")}</strong>
                    <p>{t("available")}</p>
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
