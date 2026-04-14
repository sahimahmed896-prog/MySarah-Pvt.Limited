"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { company } from "@/lib/constants";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h4>{company.name}</h4>
          <p>{company.address}</p>
          <p>{company.email}</p>
        </div>
        <div>
          <h4>{t("Explore")}</h4>
          <ul>
            <li>
              <Link href="/">{t("Home")}</Link>
            </li>
            <li>
              <Link href="/sectors">{t("Sectors")}</Link>
            </li>
            <li>
              <Link href="/contact">{t("Contact")}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>{t("Mission")}</h4>
          <p>
            {t("Building a multi-sector technology platform from Assam with a strong foundation in clean energy and scalable service delivery.")}
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>{t("© {year} Mysarah Modern Tech Private Limited. All rights reserved.").replace("{year}", new Date().getFullYear().toString())}</p>
      </div>
    </footer>
  );
}
