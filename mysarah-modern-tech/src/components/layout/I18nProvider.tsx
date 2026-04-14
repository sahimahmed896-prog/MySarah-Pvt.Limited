"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { LANGUAGE_STORAGE_KEY, isLanguageCode } from "@/lib/i18";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && isLanguageCode(saved)) {
      void i18n.changeLanguage(saved);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
