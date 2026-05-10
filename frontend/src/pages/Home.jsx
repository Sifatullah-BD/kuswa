import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { api } from "../lib/api";
import { KUSWA_IMAGES, KUSWA_GALLERY } from "../lib/images";
import NoticeAlert from "../components/NoticeAlert";
import HeroSlideshow from "../components/HeroSlideshow";
import { ArrowRight, BookOpen, HandHeart, HeartPulse, Leaf, Music, Users, Calendar, Camera, Sparkles } from "lucide-react";

const LOGO = "https://customer-assets.emergentagent.com/job_bb744ec9-a084-4368-b9f5-270ac09fd22f/artifacts/cetkcmdm_Untitled%20design.png";
const ACT_ICONS = [BookOpen, HandHeart, Users, HeartPulse, Leaf, Music];

export default function Home() {
  const { t, lang } = useLang();
  const [stats, setStats] = useState(null);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    api.get("/stats").then((r) => setStats(r.data)).catch(() => {});
    api.get("/news").then((r) => setNews(r.data.slice(0, 3))).catch(() => {});
    api.get("/events").then((r) => setEvents(r.data.slice(0, 3))).catch(() => {});
    api.get("/gallery").then((r) => setGallery(r.data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      {/* Hero */}
      <section className="relative bg-gradient-soft overflow-hidden">
        <NoticeAlert />
        <div className="container-x grid lg:grid-cols-12 gap-10 items-center pt-10 pb-20 lg:py-24">
          <div className="lg:col-span-6 animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-softer text-xs font-semibold text-kuswa-orange uppercase tracking-wider">
              <Sparkles size={14} /> {t.hero.tagline}
            </span>
            <h1 className={`mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight ${lang === "bn" ? "font-bn" : "font-display"}`}>
              <span className="text-kuswa-dark-blue">{t.hero.title_lead}</span>{" "}
              <span className="text-gradient-warm">{t.hero.title_accent}</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-kuswa-muted leading-relaxed max-w-xl">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/members" className="btn-primary" data-testid="hero-join-btn">
                {t.hero.cta_join} <ArrowRight size={18} />
              </Link>
              <Link to="/donation" className="btn-outline" data-testid="hero-donate-btn">
                {t.hero.cta_donate}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <HeroSlideshow lang={lang} />
            <div className="absolute -bottom-6 -left-4 sm:-left-8 glass-card rounded-2xl p-4 flex items-center gap-3 shadow-soft z-10">
              <img src={LOGO} alt="logo" className="w-12 h-12 rounded-full" />
              <div>
                <div className="text-xs text-kuswa-muted">{t.estd}</div>
                <div className="font-bold text-kuswa-dark-blue">{t.org_short}</div>
              </div>
            </div>
            <div className="absolute -top-6 -right-4 sm:-right-8 glass-card rounded-2xl p-4 hidden sm:block z-10">
              <div className="text-2xl font-bold text-kuswa-orange">{stats?.years_active ?? 22}+</div>
              <div className="text-xs text-kuswa-muted">{t.stats.years}</div>
            </div>
          </div>
        </div>
      </section>

      {/* About short */}
      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <h2 className={`text-3xl sm:text-4xl font-bold ${lang === "bn" ? "font-bn" : "font-display"}`}>
              <span className="text-gradient-brand">{t.sections.about_short_title}</span>
            </h2>
            <p className="mt-4 text-kuswa-muted leading-relaxed">{t.sections.about_short_text}</p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-kuswa-orange font-semibold" data-testid="home-about-link">
              {t.common.learn_more} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            {KUSWA_GALLERY.map((g, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden shadow-softer ${i % 2 ? "translate-y-6" : ""}`}>
                <img src={g.src} alt={g.title_en} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-section text-white" data-testid="home-stats">
        <div className="container-x">
          <h2 className={`text-2xl sm:text-3xl font-bold text-center ${lang === "bn" ? "font-bn" : "font-display"}`}>
            {t.sections.stats_title}
          </h2>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              ["years", stats?.years_active ?? "20+"],
              ["members", stats?.members ?? 0],
              ["events", stats?.events ?? 0],
              ["news", stats?.news ?? 0],
              ["gallery", stats?.gallery ?? 0],
            ].map(([key, val]) => (
              <div key={key} className="text-center" data-testid={`stat-${key}`}>
                <div className="text-3xl sm:text-4xl font-extrabold text-kuswa-gold">{val}</div>
                <div className="mt-1 text-sm text-white/85">{t.stats[key]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="section-pad bg-kuswa-bg">
        <div className="container-x">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <h2 className={`text-3xl sm:text-4xl font-bold ${lang === "bn" ? "font-bn" : "font-display"}`}>
                <span className="text-gradient-brand">{t.sections.activities_title}</span>
              </h2>
              <p className="text-kuswa-muted mt-2">{t.sections.activities_sub}</p>
            </div>
            <Link to="/activities" className="text-kuswa-dark-blue font-semibold inline-flex items-center gap-2">
              {t.common.view_all} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.activities.map((act, i) => {
              const Icon = ACT_ICONS[i % ACT_ICONS.length];
              return (
                <div key={i} className="card-soft" data-testid={`activity-card-${i}`}>
                  <div className="w-12 h-12 grid place-items-center rounded-xl bg-gradient-button text-white mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-kuswa-dark-blue">{act.title}</h3>
                  <p className="mt-2 text-sm text-kuswa-muted leading-relaxed">{act.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* News + Events combined */}
      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl sm:text-3xl font-bold ${lang === "bn" ? "font-bn" : "font-display"}`}>
                {t.sections.news_title}
              </h2>
              <Link to="/news" className="text-kuswa-orange font-semibold text-sm">{t.common.view_all}</Link>
            </div>
            <div className="space-y-4">
              {news.length === 0 && <div className="card-soft text-kuswa-muted">{t.common.empty}</div>}
              {news.map((n) => (
                <Link key={n.id} to="/news" className="card-soft flex gap-4 items-start" data-testid={`home-news-${n.id}`}>
                  <Calendar className="text-kuswa-orange shrink-0 mt-1" size={22} />
                  <div>
                    <div className="font-semibold text-kuswa-dark-blue">{lang === "bn" ? n.title_bn : n.title_en}</div>
                    <div className="text-xs text-kuswa-muted mt-1">{new Date(n.created_at).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US")}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl sm:text-3xl font-bold ${lang === "bn" ? "font-bn" : "font-display"}`}>
                {t.sections.events_title}
              </h2>
              <Link to="/events" className="text-kuswa-orange font-semibold text-sm">{t.common.view_all}</Link>
            </div>
            <div className="space-y-4">
              {events.length === 0 && <div className="card-soft text-kuswa-muted">{t.common.empty}</div>}
              {events.map((e) => (
                <div key={e.id} className="card-soft" data-testid={`home-event-${e.id}`}>
                  <div className="text-xs uppercase tracking-wider text-kuswa-orange font-semibold">{e.event_date}</div>
                  <div className="font-semibold mt-1 text-kuswa-dark-blue">{lang === "bn" ? e.title_bn : e.title_en}</div>
                  <div className="text-sm text-kuswa-muted mt-1">{lang === "bn" ? e.location_bn : e.location_en}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="section-pad bg-kuswa-bg">
        <div className="container-x">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <h2 className={`text-3xl sm:text-4xl font-bold ${lang === "bn" ? "font-bn" : "font-display"}`}>
              <span className="text-gradient-brand">{t.sections.gallery_title}</span>
            </h2>
            <Link to="/gallery" className="text-kuswa-dark-blue font-semibold inline-flex items-center gap-2">
              <Camera size={16} /> {t.common.view_all}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(gallery.length ? gallery.map((g) => ({ src: g.media_url, title_en: g.title_en, title_bn: g.title_bn, id: g.id }))
              : KUSWA_GALLERY.map((g, i) => ({ ...g, id: i }))
            ).map((g) => (
                <div key={g.id} className="rounded-2xl overflow-hidden shadow-softer relative group">
                  <img src={g.src} alt={g.title_en} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                    {lang === "bn" ? g.title_bn : g.title_en}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <section className="section-pad">
        <div className="container-x">
          <div className="rounded-3xl p-10 sm:p-14 bg-gradient-section text-white relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-kuswa-orange/30 blur-3xl" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className={`text-3xl sm:text-4xl font-bold ${lang === "bn" ? "font-bn" : "font-display"}`}>
                  {t.sections.donate_title}
                </h2>
                <p className="mt-3 text-white/90 max-w-lg">{t.sections.donate_sub}</p>
              </div>
              <div className="flex md:justify-end">
                <Link to="/donation" className="btn-primary" data-testid="home-donate-cta">
                  {t.hero.cta_donate} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}