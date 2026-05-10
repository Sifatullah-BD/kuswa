import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { api, formatApiError } from "../lib/api";
import { toast } from "sonner";
import { LogOut, Home, Newspaper, Calendar, Users as UsersIcon, Image as ImageIcon, MessageSquare, Settings, Trash2, Check, X, Plus } from "lucide-react";

const TABS = [
  { key: "news", label: "News", Icon: Newspaper },
  { key: "events", label: "Events", Icon: Calendar },
  { key: "members", label: "Members", Icon: UsersIcon },
  { key: "committee", label: "Committee", Icon: UsersIcon },
  { key: "gallery", label: "Gallery", Icon: ImageIcon },
  { key: "messages", label: "Messages", Icon: MessageSquare },
  { key: "settings", label: "Settings", Icon: Settings },
];

function Field({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-kuswa-muted font-medium">{label}</span>
      <input {...props} className="px-3 py-2 rounded-lg border border-kuswa-bg focus:border-kuswa-dark-blue outline-none" />
    </label>
  );
}
function TextArea({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-kuswa-muted font-medium">{label}</span>
      <textarea rows={3} {...props} className="px-3 py-2 rounded-lg border border-kuswa-bg focus:border-kuswa-dark-blue outline-none" />
    </label>
  );
}

const emptyNews = { title_en: "", title_bn: "", content_en: "", content_bn: "", image_url: "", category: "news", is_published: true };
const emptyEvent = { title_en: "", title_bn: "", description_en: "", description_bn: "", event_date: "", location_en: "", location_bn: "", image_url: "", is_upcoming: true };
const emptyCommittee = { name_en: "", name_bn: "", position_en: "", position_bn: "", category: "executive", photo_url: "", bio_en: "", bio_bn: "", order: 0 };
const emptyGallery = { title_en: "", title_bn: "", media_type: "photo", media_url: "", album: "general", description_en: "", description_bn: "" };

export default function Admin() {
  const { user, checking, logout } = useAuth();
  const [tab, setTab] = useState("news");

  if (checking) return <div className="min-h-screen grid place-items-center">Loading...</div>;
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-kuswa-bg" data-testid="admin-dashboard">
      <div className="bg-white border-b border-kuswa-bg sticky top-0 z-40">
        <div className="container-x flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-kuswa-dark-blue font-bold">
              <Home size={18} /> KUSWA
            </Link>
            <span className="text-sm text-kuswa-muted hidden sm:inline">Admin Dashboard</span>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold hover:bg-kuswa-bg" data-testid="admin-logout">
            <LogOut size={16} /> Logout
          </button>
        </div>
        <div className="container-x flex gap-1 overflow-x-auto py-2">
          {TABS.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setTab(key)} data-testid={`admin-tab-${key}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                tab === key ? "bg-kuswa-dark-blue text-white" : "text-kuswa-ink hover:bg-kuswa-bg"
              }`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="container-x py-8">
        {tab === "news" && <CrudList endpoint="/news" empty={emptyNews} title="News & Notices" fields={[
          ["title_en", "Title (EN)"], ["title_bn", "Title (BN)"], ["image_url", "Image URL"],
          ["content_en", "Content (EN)", "textarea"], ["content_bn", "Content (BN)", "textarea"],
          ["category", "Category (news|notice)"],
        ]} renderItem={(n) => <><b>{n.title_en}</b><div className="text-xs text-kuswa-muted">{n.title_bn}</div></>} />}

        {tab === "events" && <CrudList endpoint="/events" empty={emptyEvent} title="Events" fields={[
          ["title_en", "Title (EN)"], ["title_bn", "Title (BN)"], ["event_date", "Event Date"],
          ["location_en", "Location (EN)"], ["location_bn", "Location (BN)"], ["image_url", "Image URL"],
          ["description_en", "Description (EN)", "textarea"], ["description_bn", "Description (BN)", "textarea"],
        ]} renderItem={(e) => <><b>{e.title_en}</b><div className="text-xs text-kuswa-muted">{e.event_date} · {e.location_en}</div></>} />}

        {tab === "committee" && <CrudList endpoint="/committee" empty={emptyCommittee} title="Executive Committee" fields={[
          ["name_en", "Name (EN)"], ["name_bn", "Name (BN)"],
          ["position_en", "Position (EN)"], ["position_bn", "Position (BN)"],
          ["category", "Category (executive|advisor|ulama|office|student|expat|business|youth|sports|culture|agriculture)"],
          ["photo_url", "Photo URL"], ["order", "Order", "number"],
          ["bio_en", "Bio (EN)", "textarea"], ["bio_bn", "Bio (BN)", "textarea"],
        ]} renderItem={(m) => <><b>{m.name_en}</b><div className="text-xs text-kuswa-muted">{m.position_en} · <span className="text-kuswa-orange">{m.category || "executive"}</span></div></>} />}

        {tab === "gallery" && <CrudList endpoint="/gallery" empty={emptyGallery} title="Gallery" fields={[
          ["title_en", "Title (EN)"], ["title_bn", "Title (BN)"],
          ["media_type", "Media Type (photo|video)"], ["album", "Album"],
          ["media_url", "Media URL"],
          ["description_en", "Description (EN)", "textarea"], ["description_bn", "Description (BN)", "textarea"],
        ]} renderItem={(g) => <><b>{g.title_en}</b><div className="text-xs text-kuswa-muted">{g.media_type} · {g.album}</div></>} />}

        {tab === "members" && <MembersTab />}
        {tab === "messages" && <MessagesTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

function CrudList({ endpoint, empty, title, fields, renderItem }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const load = () => api.get(endpoint).then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (payload.order !== undefined) payload.order = Number(payload.order || 0);
      if (editing) await api.put(`${endpoint}/${editing}`, payload);
      else await api.post(endpoint, payload);
      toast.success("Saved");
      setForm(empty); setEditing(null); setOpen(false); load();
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail) || err.message); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try { await api.delete(`${endpoint}/${id}`); toast.success("Deleted"); load(); }
    catch (err) { toast.error(formatApiError(err.response?.data?.detail) || err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-kuswa-dark-blue">{title}</h2>
        <button onClick={() => { setForm(empty); setEditing(null); setOpen(!open); }} className="btn-primary !py-2 !px-4 text-sm" data-testid={`admin-${title.toLowerCase().split(' ')[0]}-add-btn`}>
          <Plus size={16} /> {open ? "Close" : "Add New"}
        </button>
      </div>

      {open && (
        <form onSubmit={save} className="card-soft grid sm:grid-cols-2 gap-4" data-testid="admin-form">
          {fields.map(([k, label, type]) => type === "textarea"
            ? <div key={k} className="sm:col-span-2"><TextArea label={label} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
            : <Field key={k} label={label} type={type || "text"} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          )}
          <button type="submit" className="btn-primary sm:col-span-2 mt-2">{editing ? "Update" : "Create"}</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {items.length === 0 && <div className="card-soft text-kuswa-muted">No items yet</div>}
        {items.map((it) => (
          <div key={it.id} className="card-soft flex items-start justify-between gap-4">
            <div className="flex-1">{renderItem(it)}</div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => { setForm(it); setEditing(it.id); setOpen(true); window.scrollTo(0,0); }} className="px-3 py-1.5 rounded-full text-xs bg-kuswa-bg hover:bg-kuswa-dark-blue hover:text-white">Edit</button>
              <button onClick={() => del(it.id)} className="px-3 py-1.5 rounded-full text-xs bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MembersTab() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const load = () => api.get(`/members/admin${filter ? `?status_filter=${filter}` : ""}`).then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, [filter]);

  const setStatus = async (id, status) => {
    try { await api.put(`/members/${id}/status`, { status }); toast.success("Updated"); load(); }
    catch (err) { toast.error(formatApiError(err.response?.data?.detail) || err.message); }
  };
  const del = async (id) => {
    if (!window.confirm("Delete?")) return;
    try { await api.delete(`/members/${id}`); load(); } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-kuswa-dark-blue">Member Applications</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-kuswa-bg" data-testid="member-filter">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="space-y-3">
        {items.length === 0 && <div className="card-soft text-kuswa-muted">No applications</div>}
        {items.map((m) => (
          <div key={m.id} className="card-soft flex flex-wrap items-start justify-between gap-4" data-testid={`admin-member-${m.id}`}>
            <div className="flex-1 min-w-[200px]">
              <div className="font-bold text-kuswa-dark-blue">{m.name}</div>
              <div className="text-xs text-kuswa-muted mt-1">{m.email} · {m.mobile} · {m.profession}</div>
              <div className="text-xs text-kuswa-muted">{m.address}</div>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                m.status === "approved" ? "bg-green-100 text-green-700" :
                m.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
              }`}>{m.status}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStatus(m.id, "approved")} className="px-3 py-1.5 rounded-full text-xs bg-green-50 text-green-700 hover:bg-green-600 hover:text-white" data-testid={`approve-${m.id}`}><Check size={14} /></button>
              <button onClick={() => setStatus(m.id, "rejected")} className="px-3 py-1.5 rounded-full text-xs bg-red-50 text-red-700 hover:bg-red-600 hover:text-white"><X size={14} /></button>
              <button onClick={() => del(m.id)} className="px-3 py-1.5 rounded-full text-xs bg-kuswa-bg hover:bg-kuswa-dark-blue hover:text-white"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesTab() {
  const [items, setItems] = useState([]);
  const load = () => api.get("/contact").then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);
  const del = async (id) => { if (!window.confirm("Delete?")) return; await api.delete(`/contact/${id}`); load(); };
  return (
    <div>
      <h2 className="text-2xl font-bold text-kuswa-dark-blue mb-4">Contact Messages</h2>
      <div className="space-y-3">
        {items.length === 0 && <div className="card-soft text-kuswa-muted">No messages</div>}
        {items.map((m) => (
          <div key={m.id} className="card-soft">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="font-bold text-kuswa-dark-blue">{m.name} <span className="text-xs text-kuswa-muted">· {m.email}</span></div>
                <div className="text-xs text-kuswa-muted">{m.subject}</div>
              </div>
              <button onClick={() => del(m.id)} className="px-3 py-1.5 rounded-full text-xs bg-red-50 text-red-600"><Trash2 size={14} /></button>
            </div>
            <p className="mt-3 text-sm text-kuswa-ink">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [s, setS] = useState({});
  useEffect(() => { api.get("/settings").then((r) => setS(r.data)).catch(() => {}); }, []);
  const save = async (e) => {
    e.preventDefault();
    try { await api.put("/settings", s); toast.success("Settings saved"); }
    catch (err) { toast.error(formatApiError(err.response?.data?.detail) || err.message); }
  };
  const f = (k, l) => <Field label={l} value={s[k] ?? ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} />;
  return (
    <div>
      <h2 className="text-2xl font-bold text-kuswa-dark-blue mb-4">Site Settings</h2>
      <form onSubmit={save} className="card-soft grid sm:grid-cols-2 gap-4" data-testid="admin-settings-form">
        {f("bank_name", "Bank Name")}
        {f("bank_account_holder", "Account Holder Name")}
        {f("bank_account", "Bank Account")}
        {f("bank_branch", "Bank Branch")}
        {f("bkash_number", "bKash Number")}
        {f("nagad_number", "Nagad Number")}
        {f("rocket_number", "Rocket Number")}
        {f("contact_phone", "Phone")}
        {f("contact_email", "Email")}
        {f("contact_address_en", "Address (EN)")}
        {f("contact_address_bn", "Address (BN)")}
        {f("facebook_url", "Facebook URL")}
        {f("youtube_url", "YouTube URL")}
        <div className="sm:col-span-2">{f("map_embed_url", "Map Embed URL")}</div>
        <button type="submit" className="btn-primary sm:col-span-2 mt-2">Save Settings</button>
      </form>
    </div>
  );
}
