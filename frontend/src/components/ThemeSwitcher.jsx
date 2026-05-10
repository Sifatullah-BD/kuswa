import React, { useState } from "react";
import { useTheme, THEMES } from "../context/ThemeContext";
import { useLang } from "../context/LanguageContext";
import { Palette, X, RotateCcw, Check } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme, custom, setCustomColors, reset } = useTheme();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [palette, setPalette] = useState({
    dark_blue: "#0D4F97", blue: "#1E73BE", light_blue: "#56C2F0",
    orange: "#F28C28", gold: "#F5B14C",
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Customize theme"
        data-testid="theme-fab"
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-gradient-button text-white shadow-soft hover:scale-110 transition-transform grid place-items-center"
      >
        <Palette size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} data-testid="theme-modal">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-soft max-h-[85vh] overflow-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-kuswa-dark-blue">
                  {lang === "bn" ? "থিম পছন্দ করুন" : "Choose Theme"}
                </h3>
                <p className="text-xs text-kuswa-muted">
                  {lang === "bn" ? "নিজের পছন্দমত রঙে সাইটটি দেখুন" : "View the site in your preferred colors"}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-kuswa-bg" data-testid="theme-close">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3" data-testid="theme-presets">
              {Object.entries(THEMES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => { setTheme(key); }}
                  data-testid={`theme-preset-${key}`}
                  className={`group p-3 rounded-2xl text-left border-2 transition-all ${
                    theme === key && !custom ? "border-kuswa-orange bg-kuswa-bg" : "border-kuswa-bg hover:border-kuswa-light-blue"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {t.swatch.map((c, i) => (
                      <span key={i} className="w-7 h-7 rounded-full ring-2 ring-white shadow-softer" style={{ background: c }} />
                    ))}
                    {theme === key && !custom && <Check size={16} className="ml-auto text-kuswa-orange" />}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-kuswa-ink">
                    {lang === "bn" ? t.name_bn : t.name_en}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5">
              <button
                onClick={() => setShowCustom((v) => !v)}
                className="w-full px-4 py-2.5 rounded-xl bg-kuswa-bg hover:bg-kuswa-light-blue/30 text-sm font-semibold text-kuswa-dark-blue transition"
                data-testid="theme-custom-toggle"
              >
                {showCustom ? (lang === "bn" ? "বন্ধ করুন" : "Close") : (lang === "bn" ? "নিজের রং তৈরি করুন" : "Create your own")}
              </button>

              {showCustom && (
                <div className="mt-4 space-y-3" data-testid="theme-custom-form">
                  {[
                    ["dark_blue", lang === "bn" ? "প্রাইমারি (গাঢ়)" : "Primary (Dark)"],
                    ["blue", lang === "bn" ? "প্রাইমারি (মাঝারি)" : "Primary (Medium)"],
                    ["light_blue", lang === "bn" ? "প্রাইমারি (হালকা)" : "Primary (Light)"],
                    ["orange", lang === "bn" ? "অ্যাকসেন্ট (গাঢ়)" : "Accent (Bold)"],
                    ["gold", lang === "bn" ? "অ্যাকসেন্ট (হালকা)" : "Accent (Soft)"],
                  ].map(([k, label]) => (
                    <label key={k} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-kuswa-muted font-medium">{label}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={palette[k]}
                          onChange={(e) => setPalette({ ...palette, [k]: e.target.value })}
                          className="w-10 h-10 rounded-lg cursor-pointer border border-kuswa-bg"
                          data-testid={`theme-color-${k}`}
                        />
                        <input
                          type="text"
                          value={palette[k]}
                          onChange={(e) => setPalette({ ...palette, [k]: e.target.value })}
                          className="w-24 px-2 py-1.5 text-xs font-mono rounded-md border border-kuswa-bg"
                        />
                      </div>
                    </label>
                  ))}
                  <button
                    onClick={() => setCustomColors(palette)}
                    className="btn-primary w-full text-sm !py-2.5"
                    data-testid="theme-apply-custom"
                  >
                    {lang === "bn" ? "প্রয়োগ করুন" : "Apply"}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={reset}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-kuswa-muted hover:text-kuswa-orange transition"
              data-testid="theme-reset"
            >
              <RotateCcw size={14} /> {lang === "bn" ? "ডিফল্টে ফিরে যান" : "Reset to default"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
