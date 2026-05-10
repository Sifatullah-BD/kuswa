import React, { useEffect, useState } from "react";
import { useLang } from "../context/LanguageContext";
import { api, formatApiError } from "../lib/api";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

const initialForm = {
  name: "", father_name: "", dob: "", address: "", profession: "",
  institution: "", education: "", email: "", mobile: "", blood_group: "",
  nid_or_birth_reg: "", photo_url: "",
};

export default function Members() {
  const { t, lang } = useLang();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/members/public").then((r) => setMembers(r.data)).catch(() => {});
  }, []);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/members", form);
      toast.success(t.member_form.success);
      setForm(initialForm);
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const f = t.member_form;

  const fields = [
    ["name", f.name, "text", true],
    ["father_name", f.father_name, "text", true],
    ["dob", f.dob, "date", false],
    ["address", f.address, "text", true],
    ["profession", f.profession, "text", false],
    ["institution", f.institution, "text", false],
    ["education", f.education, "text", false],
    ["email", f.email, "email", true],
    ["mobile", f.mobile, "tel", true],
    ["blood_group", f.blood_group, "text", false],
    ["nid_or_birth_reg", f.nid, "text", false],
    ["photo_url", f.photo_url, "url", false],
  ];

  return (
    <div data-testid="members-page">
      <section className="bg-gradient-soft py-20">
        <div className="container-x">
          <h1 className={`text-4xl sm:text-5xl font-bold ${lang === "bn" ? "font-bn" : "font-display"} text-kuswa-dark-blue`}>
            {t.sections.members_title}
          </h1>
          <p className="mt-3 text-kuswa-muted">{t.sections.members_sub}</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="card-soft" data-testid="member-form-card">
              <h2 className={`text-2xl font-bold flex items-center gap-2 ${lang === "bn" ? "font-bn" : "font-display"}`}>
                <UserPlus className="text-kuswa-orange" /> {f.title}
              </h2>
              <form onSubmit={submit} className="mt-6 grid sm:grid-cols-2 gap-4" data-testid="member-form">
                {fields.map(([k, label, type, req]) => (
                  <label key={k} className="flex flex-col gap-1.5 text-sm">
                    <span className="text-kuswa-muted font-medium">
                      {label} {req && <span className="text-kuswa-orange">*</span>}
                    </span>
                    <input
                      type={type}
                      required={req}
                      value={form[k]}
                      onChange={onChange(k)}
                      data-testid={`member-input-${k}`}
                      className="px-4 py-2.5 rounded-lg border border-kuswa-bg bg-white focus:border-kuswa-dark-blue focus:ring-2 focus:ring-kuswa-light-blue/30 outline-none transition"
                    />
                  </label>
                ))}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary sm:col-span-2 mt-2 disabled:opacity-60"
                  data-testid="member-submit-btn"
                >
                  {submitting ? t.common.loading : f.submit}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h3 className={`text-xl font-bold mb-4 ${lang === "bn" ? "font-bn" : "font-display"}`}>
              {lang === "bn" ? "আমাদের সদস্যবৃন্দ" : "Our Members"}
            </h3>
            <div className="space-y-3 max-h-[640px] overflow-auto pr-1" data-testid="public-members-list">
              {members.length === 0 && <div className="card-soft text-kuswa-muted">{t.common.empty}</div>}
              {members.map((m) => (
                <div key={m.id} className="card-soft !p-4 flex items-center gap-3" data-testid={`pub-member-${m.id}`}>
                  <div className="w-12 h-12 rounded-full bg-gradient-section grid place-items-center text-white font-bold">
                    {m.name?.[0]?.toUpperCase() || "K"}
                  </div>
                  <div>
                    <div className="font-semibold text-kuswa-dark-blue">{m.name}</div>
                    <div className="text-xs text-kuswa-muted">{m.profession || m.address}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
