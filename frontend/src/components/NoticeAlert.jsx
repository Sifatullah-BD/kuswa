import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { api } from "../lib/api";
import { Bell, X, ArrowRight, CalendarDays } from "lucide-react";

export default function NoticeAlert() {
  const { t, lang } = useLang();
  const [items, setItems] = useState([]);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/news?category=notice").catch(() => ({ data: [] })),
      api.get("/events").catch(() => ({ data: [] })),
    ]).then(([n, e]) => {
      const notices = (n.data || []).slice(0, 2).map((x) => ({
        kind: "notice", id: `n-${x.id}`, link: "/news",
        title: lang === "bn" ? x.title_bn : x.title_en,
        meta: new Date(x.created_at).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US"),
      }));
      const today = new Date().toISOString().slice(0, 10);
      const events = (e.data || [])
        .filter((ev) => (ev.event_date || "") >= today || ev.is_upcoming)
        .slice(0, 2)
        .map((x) => ({
          kind: "event", id: `e-${x.id}`, link: "/events",
          title: lang === "bn" ? x.title_bn : x.title_en,
          meta: x.event_date,
        }));
      setItems([...notices, ...events]);
    });
  }, [lang]);

  if (closed || items.length === 0) return null;

  return (
    <div className="container-x pt-6" data-testid="notice-alert">
      <div className="relative rounded-2xl overflow-hidden p-5 sm:p-6 glass-card shadow-soft animate-fade-up">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-kuswa-orange/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-kuswa-light-blue/40 blur-3xl pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="w-11 h-11 grid place-items-center rounded-xl bg-gradient-button text-white shrink-0 animate-pulse">
            <Bell size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-bold text-kuswa-orange">
                {items[0].kind === "notice" ? t.common.notice : t.common.upcoming}
              </span>
              <span className="text-xs text-kuswa-muted">·</span>
              <span className="text-xs text-kuswa-muted">{items[0].meta}</span>
            </div>
            <div className="mt-1 grid sm:grid-cols-2 gap-2">
              {items.map((it) => (
                <Link key={it.id} to={it.link} className="group flex items-center gap-2 text-sm font-semibold text-kuswa-dark-blue hover:text-kuswa-orange transition" data-testid={`notice-${it.id}`}>
                  {it.kind === "event" ? <CalendarDays size={14} /> : <Bell size={14} />}
                  <span className="truncate">{it.title}</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition" />
                </Link>
              ))}
            </div>
          </div>
          <button onClick={() => setClosed(true)} className="p-1.5 rounded-full hover:bg-kuswa-bg" aria-label="close" data-testid="notice-close">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
