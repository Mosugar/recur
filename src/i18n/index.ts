import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import en from "./en.json";
import fr from "./fr.json";

export const resources = { en: { translation: en }, fr: { translation: fr } };

function detectLanguage(): string {
  const locale = getLocales()[0]?.languageCode ?? "en";
  return locale === "fr" ? "fr" : "en";
}

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
export { detectLanguage };
