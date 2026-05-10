import React, { useEffect, useState } from "react";
import { useLang } from "../context/LanguageContext";
import { api, formatApiError } from "../lib/api";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function Contact() {
  const { t, lang } = useLang();
  const [s, setS] = useState({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => { api.get("/settings").then((r) => setS(r.data || {})).catch(() => {}); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/contact", form);
      toast.success(t.contact_form.success);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setBusy(false);
    }
  };

  const cf = t.contact_form;

  return (
    <div data-testid="contact-page">
      <section className="bg-gradient-soft py-20">
        <div className="container-x">
          <h1 className={`text-4xl sm:text-5xl font-bold ${lang === "bn" ? "font-bn" : "font-display"} text-kuswa-dark-blue`}>
            {t.sections.contact_title}
          </h1>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-2 gap-10">
          <div>
            <div className="card-soft space-y-5">
              {s.contact_address_en && (
                <div className="flex gap-3" data-testid="contact-address">
                  <MapPin className="text-kuswa-orange shrink-0 mt-1" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-kuswa-muted font-semibold">
                      {lang === "bn" ? "ঠিকানা" : "Address"}
                    </div>
                    <div className="font-semibold text-kuswa-dark-blue">
                      {lang === "bn" ? s.contact_address_bn : s.contact_address_en}
                    </div>
                  </div>
                </div>
              )}
              {s.contact_phone && (
                <a href={`tel:${s.contact_phone}`} className="flex gap-3" data-testid="contact-phone">
                  <Phone className="text-kuswa-orange shrink-0 mt-1" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-kuswa-muted font-semibold">
                      {lang === "bn" ? "ফোন" : "Phone"}
                    </div>
                    <div className="font-semibold text-kuswa-dark-blue">{s.contact_phone}</div>
                  </div>
                </a>
              )}
              {s.contact_email && (
                <a href={`mailto:${s.contact_email}`} className="flex gap-3" data-testid="contact-email">
                  <Mail className="text-kuswa-orange shrink-0 mt-1" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-kuswa-muted font-semibold">
                      {lang === "bn" ? "ই-মেইল" : "Email"}
                    </div>
                    <div className="font-semibold text-kuswa-dark-blue">{s.contact_email}</div>
                  </div>
                </a>
              )}
            </div>

            <div className="mt-6 rounded-2xl overflow-hidden shadow-softer">
              <iframe
                title="map"
                src={s.map_embed_url || "https://www.google.com/maps?q=Bera+Pabna+Bangladesh&output=embed"}
                className="w-full h-72 border-0"
                loading="lazy"
              />
            </div>
          </div>

          <div className="card-soft" data-testid="contact-form-card">
            <h3 className={`text-2xl font-bold ${lang === "bn" ? "font-bn" : "font-display"} text-kuswa-dark-blue`}>
              {lang === "bn" ? "আমাদের লিখুন" : "Send us a message"}
            </h3>
            <form onSubmit={submit} className="mt-6 grid gap-4" data-testid="contact-form">
              {[["name", cf.name, "text", true],
                ["email", cf.email, "email", true],
                ["phone", cf.phone, "tel", false],
                ["subject", cf.subject, "text", false]].map(([k, label, type, req]) => (
                <label key={k} className="flex flex-col gap-1.5 text-sm">
                  <span className="text-kuswa-muted font-medium">{label}{req && <span className="text-kuswa-orange"> *</span>}</span>
                  <input
                    type={type}
                    required={req}
                    value={form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    data-testid={`contact-input-${k}`}
                    className="px-4 py-2.5 rounded-lg border border-kuswa-bg bg-white focus:border-kuswa-dark-blue focus:ring-2 focus:ring-kuswa-light-blue/30 outline-none transition"
                  />
                </label>
              ))}
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-kuswa-muted font-medium">{cf.message} <span className="text-kuswa-orange">*</span></span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  data-testid="contact-input-message"
                  className="px-4 py-2.5 rounded-lg border border-kuswa-bg bg-white focus:border-kuswa-dark-blue focus:ring-2 focus:ring-kuswa-light-blue/30 outline-none transition"
                />
              </label>
              <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60" data-testid="contact-submit-btn">
                <Send size={16} /> {busy ? t.common.loading : cf.submit}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
