import React, { useEffect, useState, useMemo } from "react";
import { useLang } from "../context/LanguageContext";
import { api } from "../lib/api";
import { User } from "lucide-react";

const ALL_CATS = ["executive", "advisor", "ulama", "office", "student", "expat", "business", "youth", "sports", "culture", "agriculture"];

export default function Committee() {
  const { t, lang } = useLang();
  const [list, setList] = useState([]);
  const [active, setActive] = useState("all");

  useEffect(() => {
    api.get("/committee").then((r) => setList(r.data || [])).catch(() => {});
  }, []);

  const availableCats = useMemo(() => {
    const set = new Set(list.map((x) => x.category || "executive"));
    return ALL_CATS.filter((c) => set.has(c));
  }, [list]);

  const filtered = active === "all" ? list : list.filter((m) => (m.category || "executive") === active);

  const grouped = useMemo(() => {
    const g = {};
    list.forEach((m) => {
      const c = m.category || "executive";
      g[c] = g[c] || [];
      g[c].push(m);
    });
    return g;
  }, [list]);

  return (
    <div data-testid="committee-page">
      <section className="bg-gradient-soft py-20">
        <div className="container-x">
          <h1 className={`text-4xl sm:text-5xl font-bold ${lang === "bn" ? "font-bn" : "font-display"} text-kuswa-dark-blue`}>
            {t.sections.committee_title}
          </h1>
          <p className="mt-3 text-kuswa-muted">
            {lang === "bn" ? "কুশার নেতৃত্বে যাঁরা আছেন" : "The leaders steering KUSWA forward"}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x">
          {list.length === 0 ? (
            <div className="card-soft text-kuswa-muted">{t.common.empty}</div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-8" data-testid="committee-tabs">
                <button
                  onClick={() => setActive("all")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${active === "all" ? "bg-kuswa-dark-blue text-white" : "bg-kuswa-bg text-kuswa-ink hover:bg-kuswa-light-blue/30"}`}
                  data-testid="committee-tab-all"
                >
                  {lang === "bn" ? "সব" : "All"}
                </button>
                {availableCats.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    data-testid={`committee-tab-${c}`}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${active === c ? "bg-kuswa-dark-blue text-white" : "bg-kuswa-bg text-kuswa-ink hover:bg-kuswa-light-blue/30"}`}
                  >
                    {t.categories?.[c] || c}
                  </button>
                ))}
              </div>

              {active === "all" ? (
                <div className="space-y-12">
                  {availableCats.map((c) => (
                    <div key={c}>
                      <h2 className={`text-2xl font-bold mb-5 ${lang === "bn" ? "font-bn" : "font-display"}`}>
                        <span className="text-gradient-brand">{t.categories?.[c] || c}</span>
                      </h2>
                      <CommitteeGrid items={grouped[c] || []} lang={lang} />
                    </div>
                  ))}
                </div>
              ) : (
                <CommitteeGrid items={filtered} lang={lang} />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function CommitteeGrid({ items, lang }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((m) => (
        <div key={m.id} className="card-soft text-center" data-testid={`committee-${m.id}`}>
          <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-kuswa-bg ring-4 ring-kuswa-light-blue/30">
            {m.photo_url ? (
              <img src={m.photo_url} alt={m.name_en} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-kuswa-dark-blue">
                <User size={48} />
              </div>
            )}
          </div>
          <h3 className="mt-4 text-lg font-bold text-kuswa-dark-blue">{lang === "bn" ? m.name_bn : m.name_en}</h3>
          <div className="mt-1 text-sm font-semibold text-kuswa-orange">
            {lang === "bn" ? m.position_bn : m.position_en}
          </div>
          {(lang === "bn" ? m.bio_bn : m.bio_en) && (
            <p className="mt-3 text-sm text-kuswa-muted">{lang === "bn" ? m.bio_bn : m.bio_en}</p>
          )}
        </div>
      ))}
    </div>
  );
}
