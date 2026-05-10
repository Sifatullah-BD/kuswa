import React, { useEffect, useState } from "react";
import { useLang } from "../context/LanguageContext";
import { api } from "../lib/api";
import { Building2, Smartphone, Wallet, Copy, Check } from "lucide-react";

function CopyRow({ label, value, testid }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-kuswa-bg last:border-0" data-testid={testid}>
      <div>
        <div className="text-xs uppercase tracking-wider text-kuswa-muted font-semibold">{label}</div>
        <div className="font-mono font-semibold text-kuswa-dark-blue mt-0.5">{value}</div>
      </div>
      <button
        onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-kuswa-bg hover:bg-kuswa-dark-blue hover:text-white transition-colors"
      >
        {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
      </button>
    </div>
  );
}

export default function Donation() {
  const { t, lang } = useLang();
  const [s, setS] = useState({});

  useEffect(() => { api.get("/settings").then((r) => setS(r.data || {})).catch(() => {}); }, []);

  const d = t.donate;

  return (
    <div data-testid="donation-page">
      <section className="bg-gradient-soft py-20">
        <div className="container-x">
          <h1 className={`text-4xl sm:text-5xl font-bold ${lang === "bn" ? "font-bn" : "font-display"} text-kuswa-dark-blue`}>
            {lang === "bn" ? "অনুদান দিন" : "Donate to KUSWA"}
          </h1>
          <p className="mt-3 text-kuswa-muted max-w-2xl">{t.sections.donate_sub}</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-3 gap-6">
          <div className="card-soft" data-testid="donate-bank-card">
            <div className="w-12 h-12 grid place-items-center rounded-xl bg-gradient-section text-white mb-4">
              <Building2 size={22} />
            </div>
            <h3 className="text-xl font-bold text-kuswa-dark-blue">{d.bank}</h3>
            <div className="mt-4">
              <CopyRow label={d.bank} value={s.bank_name} testid="donate-bank-name" />
              <CopyRow label={lang === "bn" ? "অ্যাকাউন্ট নাম" : "Account Holder"} value={s.bank_account_holder} testid="donate-bank-holder" />
              <CopyRow label={d.account} value={s.bank_account} testid="donate-bank-account" />
              <CopyRow label={d.branch} value={s.bank_branch} testid="donate-bank-branch" />
            </div>
          </div>

          <div className="card-soft" data-testid="donate-bkash-card">
            <div className="w-12 h-12 grid place-items-center rounded-xl bg-gradient-button text-white mb-4">
              <Smartphone size={22} />
            </div>
            <h3 className="text-xl font-bold text-kuswa-dark-blue">{d.bkash}</h3>
            <div className="mt-4">
              <CopyRow label={d.bkash} value={s.bkash_number} testid="donate-bkash-number" />
              <div className="text-xs text-kuswa-muted mt-3">
                {lang === "bn" ? "Send Money অপশন ব্যবহার করুন" : "Use Send Money option"}
              </div>
            </div>
          </div>

          <div className="card-soft" data-testid="donate-nagad-card">
            <div className="w-12 h-12 grid place-items-center rounded-xl bg-gradient-section text-white mb-4">
              <Wallet size={22} />
            </div>
            <h3 className="text-xl font-bold text-kuswa-dark-blue">{d.nagad}</h3>
            <div className="mt-4">
              <CopyRow label={d.nagad} value={s.nagad_number} testid="donate-nagad-number" />
              <CopyRow label={d.rocket} value={s.rocket_number} testid="donate-rocket-number" />
            </div>
          </div>
        </div>

        <div className="container-x mt-10">
          <div className="rounded-2xl p-8 bg-gradient-section text-white">
            <h3 className={`text-2xl font-bold ${lang === "bn" ? "font-bn" : "font-display"}`}>
              {lang === "bn" ? "ধন্যবাদ আপনার সহমর্মিতার জন্য" : "Thank you for your generosity"}
            </h3>
            <p className="mt-2 text-white/90 max-w-2xl">
              {lang === "bn"
                ? "আপনার প্রতিটি অনুদান আমাদের সমাজ কল্যাণমূলক কাজকে আরও বিস্তৃত করছে। অনুদানের পর আমাদের জানাতে পারেন +880 1622-564511 নম্বরে।"
                : "Every contribution helps us expand our welfare work. After donating, please notify us at +880 1622-564511."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
