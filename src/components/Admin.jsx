import { useEffect, useMemo, useState } from "react";
import { ExternalLink, LockKeyhole, LogOut, RefreshCw, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";

const ADMIN_PASSCODE = String(import.meta.env.VITE_ADMIN_PASSCODE || "masakapa2026").trim();
const AUTH_KEY = "masakapa-admin-authed";
const STATUS_OPTIONS = ["all", "new", "investigating", "resolved"];
const TYPE_OPTIONS = ["all", "missing_ingredient", "recipe_issue", "app_bug", "suggestion"];

const typeLabels = {
  missing_ingredient: "Missing Ingredient",
  recipe_issue: "Recipe Issue",
  app_bug: "App Bug",
  suggestion: "Suggestion",
};

const typeStyles = {
  missing_ingredient: "bg-amber-100 text-amber-800",
  recipe_issue: "bg-red-100 text-red-800",
  app_bug: "bg-purple-100 text-purple-800",
  suggestion: "bg-blue-100 text-blue-800",
};

const statusLabels = {
  new: "New",
  investigating: "Investigating",
  resolved: "Resolved",
};

function readAuth() {
  try {
    return window.sessionStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

function writeAuth(value) {
  try {
    if (value) window.sessionStorage.setItem(AUTH_KEY, "true");
    else window.sessionStorage.removeItem(AUTH_KEY);
  } catch {
    // Session storage may be unavailable in private browsing.
  }
}

function normalizePresets(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

function formatDate(value) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown date"
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function whatsappUrl(value) {
  const digits = String(value || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

function FeedbackCard({ item, onStatusChange, onDelete }) {
  const presets = normalizePresets(item.issue_template);
  const phoneUrl = whatsappUrl(item.contact);
  const type = item.type || "suggestion";
  const status = item.status || "new";
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${typeStyles[type] || "bg-stone-100 text-stone-700"}`}>
              {typeLabels[type] || type}
            </span>
            <span className="text-xs text-stone-400">{formatDate(item.created_at)}</span>
          </div>
          <p className="mt-2 text-xs font-semibold text-stone-600">
            Recipe: {item.recipe_title || item.recipe_id || "General feedback"}
          </p>
        </div>
        {status === "resolved" && (
          <button type="button" onClick={() => onDelete(item)} title="Delete feedback" aria-label="Delete feedback" className="rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        )}
      </div>
      {presets.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {presets.map((preset, index) => <span key={`${preset}-${index}`} className="rounded-md bg-stone-100 px-2 py-1 text-[11px] text-stone-600">{preset}</span>)}
        </div>
      )}
      {item.description && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700">{item.description}</p>}
      {item.contact && (
        <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
          <span className="truncate">{item.contact}</span>
          {phoneUrl && <a href={phoneUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-green-50 px-2 py-1 font-bold text-green-700 hover:bg-green-100"><ExternalLink size={12} /> WhatsApp</a>}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-100 pt-3">
        <label className="text-[11px] font-bold uppercase tracking-wide text-stone-400" htmlFor={`status-${item.id}`}>Status</label>
        <select id={`status-${item.id}`} value={status} onChange={(event) => onStatusChange(item, event.target.value)} className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs font-semibold text-stone-700 outline-none focus:border-amber-400">
          {STATUS_OPTIONS.slice(1).map((option) => <option key={option} value={option}>{statusLabels[option]}</option>)}
        </select>
      </div>
    </article>
  );
}

export default function Admin({ onBackToApp }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuth);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchFeedbacks = async () => {
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setLoading(true);
    setError("");
    const { data, error: fetchError } = await supabase.from("feedbacks").select("*").order("created_at", { ascending: false });
    if (fetchError) setError(fetchError.message);
    else setFeedbacks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const timer = window.setTimeout(fetchFeedbacks, 0);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated]);

  const metrics = useMemo(() => ({
    total: feedbacks.length,
    newIssues: feedbacks.filter((item) => (item.status || "new") === "new").length,
    resolved: feedbacks.filter((item) => item.status === "resolved").length,
  }), [feedbacks]);

  const filteredFeedbacks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return feedbacks.filter((item) => {
      const matchesStatus = statusFilter === "all" || (item.status || "new") === statusFilter;
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const haystack = [item.description, item.contact, item.recipe_id, item.recipe_title, ...normalizePresets(item.issue_template)].filter(Boolean).join(" ").toLowerCase();
      return matchesStatus && matchesType && (!term || haystack.includes(term));
    });
  }, [feedbacks, search, statusFilter, typeFilter]);

  const handleLogin = (event) => {
    event.preventDefault();
    if (String(passcode).trim() === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      window.sessionStorage.setItem(AUTH_KEY, "true");
      setPasscodeError(false);
      return;
    }
    setPasscodeError(true);
  };

  const logout = () => {
    writeAuth(false);
    setIsAuthenticated(false);
  };

  const updateStatus = async (item, status) => {
    if (!supabase) return;
    setFeedbacks((items) => items.map((entry) => entry.id === item.id ? { ...entry, status } : entry));
    const { error: updateError } = await supabase.from("feedbacks").update({ status }).eq("id", item.id);
    if (updateError) {
      setError(updateError.message);
      fetchFeedbacks();
    }
  };

  const handleDelete = async (id) => {
    if (!supabase) return;
    const { error: deleteError } = await supabase.from("feedbacks").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else setFeedbacks((items) => items.filter((entry) => entry.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 text-stone-800">
        <div className="mx-auto flex min-h-[80vh] max-w-sm items-center">
          <form onSubmit={handleLogin} className="w-full rounded-3xl border border-stone-200 bg-white p-7 shadow-xl">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800"><LockKeyhole size={22} /></div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Masak Apa Hari Ini</p>
            <h1 className="mt-2 text-2xl font-bold">Admin Feedback</h1>
            <p className="mt-2 text-sm text-stone-500">Enter the admin passcode to continue.</p>
            <input autoFocus type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} placeholder="Passcode" className="mt-5 w-full rounded-xl border border-stone-200 px-3 py-3 outline-none focus:border-amber-400" />
            {passcodeError && <p className="mt-2 text-xs font-semibold text-red-600">Incorrect passcode.</p>}
            <button type="submit" className="mt-4 w-full rounded-xl bg-[#d6573a] py-3 text-sm font-bold text-white hover:bg-[#c84e3c]">Unlock Dashboard</button>
            <button type="button" onClick={onBackToApp} className="mt-3 w-full text-xs font-semibold text-stone-500 hover:text-stone-800">Go to App</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-5 text-stone-800 sm:px-8 lg:px-12">
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Masak Apa Hari Ini</p><h1 className="mt-1 text-3xl font-bold">Feedback Dashboard</h1></div>
        <div className="flex items-center gap-2"><button type="button" onClick={onBackToApp} className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50">Go to App</button><button type="button" onClick={logout} title="Log out" aria-label="Log out" className="rounded-full border border-stone-200 bg-white p-2 text-stone-500 hover:text-stone-800"><LogOut size={16} /></button></div>
      </header>
      <main className="mx-auto max-w-7xl py-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {[['Total Feedbacks', metrics.total, 'bg-white'], ['New Issues', metrics.newIssues, 'bg-amber-50'], ['Resolved Issues', metrics.resolved, 'bg-green-50']].map(([label, value, color]) => <div key={label} className={`rounded-2xl border border-stone-200 ${color} p-5`}><p className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</p><p className="mt-2 text-3xl font-bold text-stone-800">{value}</p></div>)}
        </div>
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 md:flex-row"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search feedback..." className="min-w-0 flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-amber-400" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-stone-200 px-3 py-2 text-sm"><option value="all">All Statuses</option>{STATUS_OPTIONS.slice(1).map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="rounded-xl border border-stone-200 px-3 py-2 text-sm"><option value="all">All Types</option>{TYPE_OPTIONS.slice(1).map((value) => <option key={value} value={value}>{typeLabels[value]}</option>)}</select><button type="button" onClick={fetchFeedbacks} title="Refresh" aria-label="Refresh" className="rounded-xl border border-stone-200 p-2 text-stone-500 hover:bg-stone-50"><RefreshCw size={17} className={loading ? "animate-spin" : ""} /></button></div>
        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <p className="mt-5 text-xs font-semibold text-stone-500">{filteredFeedbacks.length} feedback record{filteredFeedbacks.length === 1 ? "" : "s"}</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">{filteredFeedbacks.map((item) => <FeedbackCard key={item.id} item={item} onStatusChange={updateStatus} onDelete={setDeleteTarget} />)}</div>
        {!loading && filteredFeedbacks.length === 0 && <div className="mt-3 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-stone-500">No feedback matches the current filters.</div>}
      </main>
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl border border-amber-100 bg-white p-6 shadow-2xl">
            <h3 className="mb-1 text-base font-bold text-gray-900">Padam Maklum Balas?</h3>
            <p className="mb-6 text-xs text-gray-600">Tindakan ini tidak boleh dibatalkan. Rekod ini akan dipadam daripada pangkalan data.</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-100">Batal</button>
              <button type="button" onClick={() => { handleDelete(deleteTarget.id); setDeleteTarget(null); }} className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-red-700">Padam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
