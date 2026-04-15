"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { SolarInsights } from "@/types/lead";
import { useTranslation } from "react-i18next";

export default function SolarInsightsPanel() {
  const { t } = useTranslation();
  const SolarInstallMap = dynamic(() => import("@/components/home/SolarInstallMap"), {
    ssr: false,
    loading: () => <p className="insights-loading">{t("Loading map...")}</p>,
  });

  const [insights, setInsights] = useState<SolarInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInsights() {
      setLoading(true);
      setError("");
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second timeout (allows 8s DB + 4s network)

        const response = await fetch("/api/insights/solar", { 
          method: "GET", 
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();
        if (!response.ok) {
          setError(data.error || t("Unable to load insights."));
          return;
        }
        setInsights(data.data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError(t("Insights are taking longer than expected. The app will continue without them."));
        } else {
          setError(t("Unable to load installation analytics."));
        }
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, [t]);

  if (loading) {
    return <p className="insights-loading">{t("Loading installation analytics...")}</p>;
  }

  if (error) {
    return <p className="insights-loading">{error}</p>;
  }

  if (!insights) {
    return <p className="insights-loading">{t("No installation analytics available yet.")}</p>;
  }

  return (
    <div className="insights-grid">
      <article className="insights-map-card">
        <div className="insights-head">
          <p className="eyebrow">{t("Live Impact")}</p>
          <h3>{t("Solar installation footprint")}</h3>
        </div>

        <div className="insights-map-shell">
          <SolarInstallMap locations={insights.locations.slice(0, 6)} />
        </div>

        <ul className="insights-location-list">
          {insights.locations.slice(0, 6).map((location) => (
            <li key={location.name}>
              <strong>{location.name}</strong>
              <span>{location.count} {t("installs")}</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="insights-chart-card">
        <div className="insights-metric-rows">
          <div className="insights-metric-row">
            <small>{t("Solar Installed")}</small>
            <strong>{insights.totals.installed}</strong>
          </div>
          <div className="insights-metric-row">
            <small>{t("Visit Confirmed")}</small>
            <strong>{insights.totals.visitConfirmed}</strong>
          </div>
          <div className="insights-metric-row">
            <small>{t("Completion Rate")}</small>
            <strong>{insights.totals.completionRate}%</strong>
          </div>
        </div>
      </article>
    </div>
  );
}
