import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Each color: "R G B" (space-separated, no commas) — works with rgb(var(--x) / alpha)
export const THEMES = {
  default: {
    name_bn: "ডিফল্ট (নীল-কমলা)",
    name_en: "Default (Blue-Orange)",
    swatch: ["#0D4F97", "#F28C28"],
    vars: {
      "--c-dark-blue": "13 79 151",
      "--c-blue": "30 115 190",
      "--c-light-blue": "86 194 240",
      "--c-orange": "242 140 40",
      "--c-gold": "245 177 76",
    },
  },
  forest: {
    name_bn: "অরণ্য (সবুজ-সোনালি)",
    name_en: "Forest (Green-Gold)",
    swatch: ["#15803D", "#CA8A04"],
    vars: {
      "--c-dark-blue": "20 83 45",
      "--c-blue": "21 128 61",
      "--c-light-blue": "74 222 128",
      "--c-orange": "202 138 4",
      "--c-gold": "250 204 21",
    },
  },
  sunset: {
    name_bn: "সূর্যাস্ত (মেরুন-অ্যাম্বার)",
    name_en: "Sunset (Maroon-Amber)",
    swatch: ["#7F1D1D", "#D97706"],
    vars: {
      "--c-dark-blue": "127 29 29",
      "--c-blue": "185 28 28",
      "--c-light-blue": "252 165 165",
      "--c-orange": "217 119 6",
      "--c-gold": "251 191 36",
    },
  },
  ocean: {
    name_bn: "সাগর (টিল-কোরাল)",
    name_en: "Ocean (Teal-Coral)",
    swatch: ["#0E7490", "#EA580C"],
    vars: {
      "--c-dark-blue": "14 116 144",
      "--c-blue": "8 145 178",
      "--c-light-blue": "103 232 249",
      "--c-orange": "234 88 12",
      "--c-gold": "251 146 60",
    },
  },
  royal: {
    name_bn: "রাজকীয় (ইন্ডিগো-অ্যাম্বার)",
    name_en: "Royal (Indigo-Amber)",
    swatch: ["#312E81", "#B45309"],
    vars: {
      "--c-dark-blue": "49 46 129",
      "--c-blue": "67 56 202",
      "--c-light-blue": "165 180 252",
      "--c-orange": "180 83 9",
      "--c-gold": "245 158 11",
    },
  },
  emerald: {
    name_bn: "পান্না (এমেরাল্ড-পিচ)",
    name_en: "Emerald (Emerald-Peach)",
    swatch: ["#065F46", "#F97316"],
    vars: {
      "--c-dark-blue": "6 95 70",
      "--c-blue": "5 150 105",
      "--c-light-blue": "110 231 183",
      "--c-orange": "249 115 22",
      "--c-gold": "253 186 116",
    },
  },
};

const ThemeContext = createContext(null);

function applyTheme(theme, customVars = null) {
  const t = THEMES[theme] || THEMES.default;
  const vars = customVars || t.vars;
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

function hexToRGB(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("kuswa_theme") || "default");
  const [custom, setCustom] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kuswa_custom_theme")) || null; } catch { return null; }
  });

  useEffect(() => {
    if (theme === "custom" && custom) {
      applyTheme("default", custom);
    } else {
      applyTheme(theme);
    }
    localStorage.setItem("kuswa_theme", theme);
    if (custom) localStorage.setItem("kuswa_custom_theme", JSON.stringify(custom));
  }, [theme, custom]);

  const setCustomColors = (palette) => {
    // palette: { dark_blue, blue, light_blue, orange, gold } as hex strings
    const v = {
      "--c-dark-blue": hexToRGB(palette.dark_blue),
      "--c-blue": hexToRGB(palette.blue),
      "--c-light-blue": hexToRGB(palette.light_blue),
      "--c-orange": hexToRGB(palette.orange),
      "--c-gold": hexToRGB(palette.gold),
    };
    setCustom(v);
    setTheme("custom");
  };

  const reset = () => {
    setCustom(null);
    setTheme("default");
    localStorage.removeItem("kuswa_custom_theme");
  };

  const value = useMemo(() => ({ theme, setTheme, custom, setCustomColors, reset }), [theme, custom]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
