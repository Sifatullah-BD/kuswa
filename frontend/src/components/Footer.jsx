import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { api } from "../lib/api";
import { Facebook, Mail, MapPin, Phone, Youtube } from "lucide-react";

const LOGO = "https://customer-assets.emergentagent.com/job_bb744ec9-a084-4368-b9f5-270ac09fd22f/artifacts/cetkcmdm_Untitled%20design.png";

export default function Footer() {
  const { t, lang } = useLang();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get("/settings").then((r) => setSettings(r.data || {})).catch(() => {});
  }, []);

  const links = [
    ["about", "/about"],
    ["activities", "/activities"],
    ["committee", "/committee"],
    ["members", "/members"],
    ["news", "/news"],
    ["events", "/events"],
    ["gallery", "/gallery"],
    ["donation", "/donation"],
    ["contact", "/contact"],
  ];

  return (
    <footer className="mt-24 bg-kuswa-dark-blue text-white" data-testid="site-footer">
      <div className="container-x py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="KUSWA" className="w-14 h-14 rounded-full" />
            <div>
              <div className="text-lg font-bold">{t.org_name}</div>
              <div className="text-xs text-white/70">{t.estd}</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/75 leading-relaxed max-w-md">
            {lang === "bn"
              ? "মানবতা, শিক্ষা ও সমাজ কল্যাণে নিবেদিত একটি অরাজনৈতিক সংগঠন।"
              : "A non-political organization dedicated to humanity, education and social welfare."}
          </p>
          <div className="flex items-center gap-3 mt-5">
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noreferrer"
                 className="w-10 h-10 grid place-items-center rounded-full bg-white/10 hover:bg-kuswa-orange transition-colors"
                 data-testid="footer-facebook">
                <Facebook size={18} />
              </a>
            )}
            {settings.youtube_url && (
              <a href={settings.youtube_url} target="_blank" rel="noreferrer"
                 className="w-10 h-10 grid place-items-center rounded-full bg-white/10 hover:bg-kuswa-orange transition-colors"
                 data-testid="footer-youtube">
                <Youtube size={18} />
              </a>
            )}
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-kuswa-gold mb-4">
            {lang === "bn" ? "কুইক লিংক" : "Quick Links"}
          </h4>
          <ul className="space-y-2 text-sm">
            {links.map(([key, path]) => (
              <li key={key}>
                <Link to={path} className="text-white/80 hover:text-kuswa-gold transition-colors" data-testid={`footer-link-${key}`}>
                  {t.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-kuswa-gold mb-4">
            {lang === "bn" ? "যোগাযোগ" : "Contact"}
          </h4>
          <ul className="space-y-3 text-sm text-white/85">
            {settings.contact_address_en && (
              <li className="flex gap-3"><MapPin size={18} className="shrink-0 text-kuswa-light-blue mt-0.5" />
                <span>{lang === "bn" ? settings.contact_address_bn : settings.contact_address_en}</span>
              </li>
            )}
            {settings.contact_phone && (
              <li className="flex gap-3"><Phone size={18} className="shrink-0 text-kuswa-light-blue mt-0.5" />
                <a href={`tel:${settings.contact_phone}`}>{settings.contact_phone}</a>
              </li>
            )}
            {settings.contact_email && (
              <li className="flex gap-3"><Mail size={18} className="shrink-0 text-kuswa-light-blue mt-0.5" />
                <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-5 text-xs text-white/70 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} {t.org_name}. {lang === "bn" ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}</span>
          <Link to="/login" className="hover:text-kuswa-gold" data-testid="footer-admin-link">{t.nav.admin}</Link>
        </div>
      </div>
    </footer>
  );
}
