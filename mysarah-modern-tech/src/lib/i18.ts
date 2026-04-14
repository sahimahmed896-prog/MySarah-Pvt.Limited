import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import assamese from "@/locales/assamese.json";
import eng from "@/locales/eng.json";
import hindi from "@/locales/hindi.json";

export type LanguageCode = "en" | "hi" | "as";

export const LANGUAGE_STORAGE_KEY = "mysarah.language";

export const languageOptions: Array<{ value: LanguageCode; label: string }> = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "as", label: "অসমীয়া" },
];

export function isLanguageCode(value: string): value is LanguageCode {
  return value === "en" || value === "hi" || value === "as";
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      en: { translation: eng.strings },
      hi: { translation: hindi.strings },
      as: { translation: assamese.strings },
    },
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "hi", "as"],
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export default i18n;
