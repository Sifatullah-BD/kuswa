import React, { useEffect, useState } from "react";
import { KUSWA_GALLERY } from "../lib/images";
import { api } from "../lib/api";

export default function HeroSlideshow({ lang }) {
  const [slides, setSlides] = useState(
    KUSWA_GALLERY.map((g) => ({ src: g.src, caption_bn: g.title_bn, caption_en: g.title_en }))
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    api.get("/gallery?media_type=photo").then((r) => {
      const items = r.data || [];
      if (items.length > 0) {
        setSlides(items.map((g) => ({
          src: g.media_url,
          caption_bn: g.title_bn || g.album || "কুশা",
          caption_en: g.title_en || g.album || "KUSWA",
        })));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-soft" data-testid="hero-slideshow">
      <div className="relative w-full h-[440px]">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === idx ? "opacity-100" : "opacity-0"}`}
            data-testid={`hero-slide-${i}`}
          >
            <img src={s.src} alt={s.caption_en} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-kuswa-dark-blue/55 via-kuswa-dark-blue/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-kuswa-gold animate-pulse shrink-0" />
                <span className="truncate">{lang === "bn" ? s.caption_bn : s.caption_en}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 right-5 flex gap-1.5 max-w-[60%] flex-wrap justify-end" data-testid="hero-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`slide ${i + 1}`}
            data-testid={`hero-indicator-${i}`}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-kuswa-gold" : "w-3 bg-white/60 hover:bg-white"}`}
          />
        ))}
      </div>
    </div>
  );
}
