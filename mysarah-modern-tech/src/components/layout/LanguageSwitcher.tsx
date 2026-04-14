"use client";

import { useTranslation } from "react-i18next";
import { languageOptions, type LanguageCode, LANGUAGE_STORAGE_KEY } from "@/lib/i18";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as LanguageCode;
    void i18n.changeLanguage(next);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
  }

  return (
    <div className="language-switcher-wrap">
      <label htmlFor="site-language" className="language-switcher-label">
        Language
      </label>
      <select id="site-language" value={i18n.language} onChange={handleChange} className="language-switcher" aria-label="Select language">
        {languageOptions.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}