"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

const links = [
  { href: "/", labelKey: "Home" },
  { href: "/sectors", labelKey: "Sectors" },
  { href: "/about", labelKey: "About" },
  { href: "/contact", labelKey: "Contact" },
];

export default function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand-mark">
          <Image
            src="/logo.png"
            alt="Mysarah Modern Tech logo"
            width={84}
            height={84}
            sizes="(max-width: 780px) 52px, 64px"
            className="brand-logo"
            priority
          />
          <div>
            <strong>Mysarah Modern Tech</strong>
            <small>Private Limited</small>
          </div>
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch
                  className={isActive(link.href) ? "nav-link active" : "nav-link"}
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
