import React, { useEffect, useState } from "react";
import { KUSWA_IMAGES } from "../lib/images";

const SLIDES = [
  { src: KUSWA_IMAGES.eid_distribution, caption_bn: "ঈদ সামগ্রি বিতরণ ২০২৫", caption_en: "Eid Food Distribution 2025" },
  { src: KUSWA_IMAGES.sirat_mahfil, caption_bn: "সীরাত মাহফিল ২০২৪", caption_en: "Sirat Mahfil 2024" },
  { src: KUSWA_IMAGES.social_awareness, caption_bn: "মাদক বিরোধী র‍্যালি", caption_en: "Anti-Drug Rally" },
  { src: KUSWA_IMAGES.self_reliance, caption_bn: "স্বাবলম্বীকরণ সহায়তা", caption_en: "Self-Reliance Support" },
];

export default function HeroSlideshow({ lang }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-soft" data-testid="hero-slideshow">
      <div className="relative w-full h-[440px]">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === idx ? "opacity-100" : "opacity-0"}`}
            data-testid={`hero-slide-${i}`}
          >
            <img src={s.src} alt={s.caption_en} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-kuswa-dark-blue/55 via-kuswa-dark-blue/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-kuswa-gold animate-pulse" />
                {lang === "bn" ? s.caption_bn : s.caption_en}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 right-5 flex gap-1.5" data-testid="hero-indicators">
        {SLIDES.map((_, i) => (
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
