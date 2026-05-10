import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("kuswa_lang") || "bn");

  useEffect(() => {
    localStorage.setItem("kuswa_lang", lang);
    document.body.classList.remove("lang-bn", "lang-en");
    document.body.classList.add(lang === "bn" ? "lang-bn" : "lang-en");
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      t: translations[lang],
      toggle: () => setLang((l) => (l === "bn" ? "en" : "bn")),
      setLang,
      pick: (en, bn) => (lang === "bn" ? bn : en),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
