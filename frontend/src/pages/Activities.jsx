import React from "react";
import { useLang } from "../context/LanguageContext";
import { KUSWA_IMAGES } from "../lib/images";
import { BookOpen, HandHeart, Users, HeartPulse, Leaf, Music } from "lucide-react";

const ICONS = [BookOpen, HandHeart, Users, HeartPulse, Leaf, Music];
const IMAGES = [
  KUSWA_IMAGES.eid_distribution,
  KUSWA_IMAGES.sirat_mahfil,
  KUSWA_IMAGES.social_awareness,
  KUSWA_IMAGES.self_reliance,
  KUSWA_IMAGES.president_message,
  KUSWA_IMAGES.eid_distribution,
];

export default function Activities() {
  const { t, lang } = useLang();
  return (
    <div data-testid="activities-page">
      <section className="bg-gradient-soft py-20">
        <div className="container-x">
          <h1 className={`text-4xl sm:text-5xl font-bold ${lang === "bn" ? "font-bn" : "font-display"} text-kuswa-dark-blue`}>
            {t.sections.activities_title}
          </h1>
          <p className="mt-3 text-kuswa-muted">{t.sections.activities_sub}</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.activities.map((a, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div key={i} className="card-soft overflow-hidden" data-testid={`activity-${i}`}>
                <div className="-mx-6 -mt-6 mb-4 h-44 overflow-hidden rounded-t-2xl">
                  <img src={IMAGES[i % IMAGES.length]} alt={a.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
                <div className="w-12 h-12 grid place-items-center rounded-xl bg-gradient-button text-white mb-3">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-kuswa-dark-blue">{a.title}</h3>
                <p className="mt-2 text-sm text-kuswa-muted leading-relaxed">{a.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
