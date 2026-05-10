import React, { useEffect, useState } from "react";
import { useLang } from "../context/LanguageContext";
import { api } from "../lib/api";
import { Calendar, Newspaper } from "lucide-react";

export function NewsPage() {
  const { t, lang } = useLang();
  const [list, setList] = useState([]);
  useEffect(() => { api.get("/news").then((r) => setList(r.data)).catch(() => {}); }, []);
  return (
    <div data-testid="news-page">
      <section className="bg-gradient-soft py-20">
        <div className="container-x">
          <h1 className={`text-4xl sm:text-5xl font-bold ${lang === "bn" ? "font-bn" : "font-display"} text-kuswa-dark-blue`}>
            {t.sections.news_title}
          </h1>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-x">
          {list.length === 0 ? (
            <div className="card-soft text-kuswa-muted">{t.common.empty}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((n) => (
                <article key={n.id} className="card-soft overflow-hidden" data-testid={`news-${n.id}`}>
                  {n.image_url && (
                    <div className="-mx-6 -mt-6 mb-4 h-44 overflow-hidden rounded-t-2xl">
                      <img src={n.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-kuswa-orange font-semibold">
                    <Newspaper size={14} /> {n.category}
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-kuswa-dark-blue">{lang === "bn" ? n.title_bn : n.title_en}</h3>
                  <p className="mt-2 text-sm text-kuswa-muted line-clamp-3">{lang === "bn" ? n.content_bn : n.content_en}</p>
                  <div className="mt-3 text-xs text-kuswa-muted">
                    {new Date(n.created_at).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US")}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function EventsPage() {
  const { t, lang } = useLang();
  const [list, setList] = useState([]);
  useEffect(() => { api.get("/events").then((r) => setList(r.data)).catch(() => {}); }, []);
  return (
    <div data-testid="events-page">
      <section className="bg-gradient-soft py-20">
        <div className="container-x">
          <h1 className={`text-4xl sm:text-5xl font-bold ${lang === "bn" ? "font-bn" : "font-display"} text-kuswa-dark-blue`}>
            {t.sections.events_title}
          </h1>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-x">
          {list.length === 0 ? (
            <div className="card-soft text-kuswa-muted">{t.common.empty}</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {list.map((e) => (
                <article key={e.id} className="card-soft" data-testid={`event-${e.id}`}>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-kuswa-orange font-semibold">
                    <Calendar size={14} /> {e.event_date}
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-kuswa-dark-blue">{lang === "bn" ? e.title_bn : e.title_en}</h3>
                  <p className="mt-2 text-sm text-kuswa-muted">{lang === "bn" ? e.description_bn : e.description_en}</p>
                  <div className="mt-3 text-xs text-kuswa-muted">
                    {lang === "bn" ? e.location_bn : e.location_en}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
