import React, { useEffect, useState, useMemo } from "react";
import { useLang } from "../context/LanguageContext";
import { api } from "../lib/api";
import { KUSWA_GALLERY } from "../lib/images";

export default function Gallery() {
  const { t, lang } = useLang();
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("photo");
  const [album, setAlbum] = useState("all");

  useEffect(() => { api.get("/gallery").then((r) => setItems(r.data)).catch(() => {}); }, []);

  const photos = items.filter((i) => i.media_type === "photo");
  const videos = items.filter((i) => i.media_type === "video");
  const albums = useMemo(() => Array.from(new Set(photos.map((p) => p.album || "general"))), [photos]);
  const filteredPhotos = album === "all" ? photos : photos.filter((p) => (p.album || "general") === album);
  const showFallback = tab === "photo" && photos.length === 0;

  return (
    <div data-testid="gallery-page">
      <section className="bg-gradient-soft py-20">
        <div className="container-x">
          <h1 className={`text-4xl sm:text-5xl font-bold ${lang === "bn" ? "font-bn" : "font-display"} text-kuswa-dark-blue`}>
            {lang === "bn" ? "গ্যালারি" : "Gallery"}
          </h1>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex p-1 bg-kuswa-bg rounded-full" data-testid="gallery-tabs">
              {[["photo", lang === "bn" ? "ছবি" : "Photos"], ["video", lang === "bn" ? "ভিডিও" : "Videos"]].map(([k, label]) => (
                <button key={k} onClick={() => setTab(k)} data-testid={`gallery-tab-${k}`}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    tab === k ? "bg-white text-kuswa-dark-blue shadow-softer" : "text-kuswa-muted"
                  }`}>{label}</button>
              ))}
            </div>
          </div>

          {tab === "photo" && albums.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6" data-testid="album-filter">
              <button onClick={() => setAlbum("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${album === "all" ? "bg-kuswa-dark-blue text-white" : "bg-kuswa-bg"}`}>
                {lang === "bn" ? "সব অ্যালবাম" : "All Albums"}
              </button>
              {albums.map((a) => (
                <button key={a} onClick={() => setAlbum(a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${album === a ? "bg-kuswa-dark-blue text-white" : "bg-kuswa-bg"}`}>
                  {a}
                </button>
              ))}
            </div>
          )}

          {tab === "photo" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(showFallback
                ? KUSWA_GALLERY.map((g, i) => ({ id: i, media_url: g.src, title_en: g.title_en, title_bn: g.title_bn, album: "KUSWA" }))
                : filteredPhotos.map((p) => ({ id: p.id, media_url: p.media_url, title_en: p.title_en, title_bn: p.title_bn, album: p.album }))
              ).map((g) => (
                <div key={g.id} className="rounded-2xl overflow-hidden shadow-softer hover:shadow-soft transition relative group" data-testid={`gallery-photo-${g.id}`}>
                  <img src={g.media_url} alt={g.title_en} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition">
                    {lang === "bn" ? g.title_bn : g.title_en}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "video" && (
            videos.length === 0 ? (
              <div className="card-soft text-kuswa-muted">{t.common.empty}</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((v) => (
                  <div key={v.id} className="card-soft" data-testid={`gallery-video-${v.id}`}>
                    <div className="aspect-video rounded-xl overflow-hidden bg-black">
                      <iframe src={v.media_url} title={v.title_en} className="w-full h-full" allowFullScreen />
                    </div>
                    <h3 className="mt-3 font-semibold text-kuswa-dark-blue">{lang === "bn" ? v.title_bn : v.title_en}</h3>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
