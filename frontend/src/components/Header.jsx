import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Globe2, LogOut, LayoutDashboard } from "lucide-react";

const LOGO = "https://customer-assets.emergentagent.com/job_bb744ec9-a084-4368-b9f5-270ac09fd22f/artifacts/cetkcmdm_Untitled%20design.png";

const navKeys = [
  ["home", "/"],
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

export default function Header() {
  const { t, lang, toggle } = useLang();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-kuswa-bg" data-testid="site-header">
      {/* Top thin gradient bar */}
      <div className="h-1.5 bg-gradient-header" />

      <div className="container-x flex items-center justify-between h-20 gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0" data-testid="header-logo-link">
          <img src={LOGO} alt="KUSWA Logo" className="w-12 h-12 rounded-full object-cover ring-2 ring-kuswa-light-blue/40" />
          <div className="leading-tight">
            <div className={`text-base sm:text-lg font-bold ${lang === "bn" ? "font-bn" : "font-display"} text-kuswa-dark-blue`}>
              {t.org_name}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-kuswa-orange font-semibold">
              {lang === "bn" ? "কুশা · প্রতিষ্ঠিত ২০০৪" : "KUSWA · Estd 2004"}
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navKeys.map(([key, path]) => (
            <NavLink
              key={key}
              to={path}
              data-testid={`nav-${key}`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? "bg-kuswa-dark-blue text-white" : "text-kuswa-ink hover:bg-kuswa-bg"
                }`
              }
              end={path === "/"}
            >
              {t.nav[key]}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-kuswa-dark-blue/20 text-sm font-semibold text-kuswa-dark-blue hover:bg-kuswa-dark-blue hover:text-white transition-colors"
            data-testid="lang-toggle-btn"
          >
            <Globe2 size={16} /> {t.common.lang}
          </button>

          {user && user.role === "admin" ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/admin" className="btn-secondary !py-2 !px-4 text-sm" data-testid="header-dashboard-btn">
                <LayoutDashboard size={16} /> {t.common.dashboard}
              </Link>
              <button onClick={logout} className="p-2 rounded-full hover:bg-kuswa-bg" data-testid="header-logout-btn" aria-label="logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/donation"
              className="hidden md:inline-flex btn-primary !py-2 !px-5 text-sm"
              data-testid="header-donate-btn"
            >
              {t.hero.cta_donate}
            </Link>
          )}

          <button
            className="lg:hidden p-2 rounded-md hover:bg-kuswa-bg"
            onClick={() => setOpen((v) => !v)}
            aria-label="menu"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-kuswa-bg bg-white" data-testid="mobile-menu">
          <div className="container-x py-4 grid grid-cols-2 gap-1">
            {navKeys.map(([key, path]) => (
              <NavLink
                key={key}
                to={path}
                onClick={() => setOpen(false)}
                data-testid={`mnav-${key}`}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-kuswa-dark-blue text-white" : "text-kuswa-ink hover:bg-kuswa-bg"
                  }`
                }
                end={path === "/"}
              >
                {t.nav[key]}
              </NavLink>
            ))}
            <button
              onClick={() => { toggle(); setOpen(false); }}
              className="col-span-2 mt-2 inline-flex justify-center items-center gap-2 px-3 py-2 rounded-md border border-kuswa-dark-blue/20 text-sm font-semibold text-kuswa-dark-blue"
              data-testid="mobile-lang-toggle"
            >
              <Globe2 size={16} /> {t.common.lang}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
